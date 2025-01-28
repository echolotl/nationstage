interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
}

class RateLimiter {
    private queue: Array<() => Promise<void>> = [];
    private processing = false;
    private lastRateLimit: RateLimitInfo = {
        limit: 50,
        remaining: 50,
        reset: 30
    };

    private updateRateLimit(headers: Headers) {
        this.lastRateLimit = {
            limit: parseInt(headers.get('RateLimit-Limit') || '50'),
            remaining: parseInt(headers.get('RateLimit-Remaining') || '50'),
            reset: parseInt(headers.get('RateLimit-Reset') || '30'),
            retryAfter: parseInt(headers.get('Retry-After') || '0')
        };
    }

    private async sleep(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    private async processQueue() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            if (this.lastRateLimit.remaining <= 1) {
                const waitTime = this.lastRateLimit.retryAfter || this.lastRateLimit.reset;
                console.log(`Rate limit reached, waiting ${waitTime} seconds...`);
                await this.sleep(waitTime);
            }

            const task = this.queue.shift();
            if (task) {
                try {
                    await task();
                } catch (error) {
                    console.error('Task failed:', error);
                }
            }
        }

        this.processing = false;
    }

    async enqueue<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const task = async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            this.queue.push(task);
            this.processQueue();
        });
    }

    handleResponse(response: Response) {
        this.updateRateLimit(response.headers);
        
        if (response.status === 429) {
            console.warn('Rate limit exceeded');
            return false;
        }
        return true;
    }
}

export const rateLimiter = new RateLimiter();

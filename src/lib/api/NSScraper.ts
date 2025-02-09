import { invoke } from '@tauri-apps/api/core';
import { rateLimiter } from './rateLimit';

interface ScraperResponse {
    status: number;
    body: string;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

class NSScraper {
    private static readonly BASE_URL = 'https://www.nationstates.net';

    private static async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static async fetchWithRetry(url: string, attempts: number = RETRY_ATTEMPTS): Promise<ScraperResponse> {
        try {
            const userAgent = await invoke<string>('get_user_agent');
            return await invoke<ScraperResponse>('fetch_page', { url, userAgent });
        } catch (error) {
            if (attempts > 1) {
                await this.delay(RETRY_DELAY);
                return this.fetchWithRetry(url, attempts - 1);
            }
            throw error;
        }
    }

    static async fetchPage(path: string): Promise<Document> {
        return rateLimiter.enqueue(async () => {
            const url = `${this.BASE_URL}${path}`;
            const response = await this.fetchWithRetry(url);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch page: ${response.status}`);
            }

            const parser = new DOMParser();
            return parser.parseFromString(response.body, 'text/html');
        });
    }

    static async getBannerInventory(nation: string): Promise<string[]> {
        const doc = await this.fetchPage(`/nation=${nation}/page=banners`);
        console.log(doc);
        const bannerIds: string[] = [];
        
        const bannerElements = doc.querySelectorAll('.banner');
        bannerElements.forEach(banner => {
            // Skip if banner has locked class
            const isLocked = banner.querySelector('.bannerlocked');
            if (isLocked) return;
            
            const id = banner.getAttribute('data-banner-id');
            if (id) bannerIds.push(id);
        });

        return bannerIds;
    }
}

export default NSScraper;
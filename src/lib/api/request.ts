import { invoke } from '@tauri-apps/api/core';

interface AuthState {
    nation: string;
    pin: string;
    autologin: string;
}

interface RequestOptions {
    params?: Record<string, string>;
    nation?: string; // Optional override for nation
}

async function refreshSession(nation: string, autologin: string): Promise<boolean> {
    try {
        console.log('Refreshing session...'); // Debug
        const response = await fetch(
            `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=ping`,
            {
                headers: {
                    'User-Agent': await invoke<string>('get_user_agent'),
                    'X-Autologin': autologin
                }
            }
        );

        if (response.ok) {
            const pin = response.headers.get('X-Pin');
            if (pin) {
                console.log('Got new PIN from refresh'); // Debug
                await invoke('update_pin', { pin });
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Session refresh failed:', error);
        return false;
    }
}

async function makeAuthenticatedRequest(endpoint: string, options: RequestOptions = {}) {
    const authData = await invoke<AuthState>('get_auth');
    const pin = await invoke<string>('get_pin');
    
    if (!authData) {
        throw new Error('Not authenticated');
    }

    const nation = options.nation || authData.nation;
    
    // Create params object
    const params = new URLSearchParams();
    if (options.params?.q) {
        params.append('q', options.params.q);
    }
    
    Object.entries(options.params || {}).forEach(([key, value]) => {
        if (key !== 'q' && value !== undefined && value !== null) {
            params.append(key, value);
        }
    });
    
    params.append('nation', nation);

    const url = `https://www.nationstates.net/cgi-bin/api.cgi?${params.toString()}`;
    console.log('Request URL:', url); // Debug

    // Try with current PIN first
    if (pin) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': await invoke<string>('get_user_agent'),
                    'X-Pin': pin
                }
            });

            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.warn('Request with PIN failed:', error);
        }
    }

    // If PIN failed or wasn't available, try refreshing session
    if (authData.autologin) {
        const refreshed = await refreshSession(authData.nation, authData.autologin);
        if (refreshed) {
            const newPin = await invoke<string>('get_pin');
            const response = await fetch(url, {
                headers: {
                    'User-Agent': await invoke<string>('get_user_agent'),
                    'X-Pin': newPin
                }
            });

            if (response.ok) {
                return await response.text();
            }
        }
    }

    throw new Error('Authentication failed');
}

async function makeUnauthenticatedRequest(endpoint: string, options: RequestOptions = {}) {
    const userAgent = await invoke<string>('get_user_agent');
    
    const params = new URLSearchParams({
        ...options.params
    });

    if (options.nation) {
        params.append('nation', options.nation);
    }

    const url = `https://www.nationstates.net/cgi-bin/api.cgi?${params.toString()}`;
    console.log('Request URL:', url);

    const response = await fetch(url, {
        headers: {
            'User-Agent': userAgent
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.text();
}

export async function getNationInfo(customNation?: string) {
    const options: RequestOptions = {
        params: { q: 'name+flag+region',}
    };
    
    if (customNation) {
        options.nation = customNation;
    }
    
    return makeAuthenticatedRequest('', options);
}

export async function getIssues() {
    const options: RequestOptions = {
        params: { q: 'issues' }
    };
    return makeAuthenticatedRequest('', options);
}
export async function getNotices() {
    // Calculate 10 days ago in epoch seconds
    const tenDaysAgo = Math.floor((Date.now() - (10 * 24 * 60 * 60 * 1000)) / 1000);
    
    const options: RequestOptions = {
        params: { 
            q: 'notices+unread',
            from: tenDaysAgo.toString()
        }
    };
    
    return makeAuthenticatedRequest('', options);
}

export async function getRegionInfo(region: string) {
    // This request doesn't need a nation parameter
    const options: RequestOptions = {
        params: {
            region,
            q: 'name+power'
        }
    };
    
    return makeUnauthenticatedRequest('', options);
}

export async function getNationRankings(nation?: string): Promise<string> {
    const options: RequestOptions = {
        params: {
            q: 'numnations+census',
            mode: 'rank+score',
            scale: 'all'
        }
    };

    if (nation) {
        // Fix to ensure nation parameter is properly added
        options.params = {
            ...options.params,
            nation
        };
    }

    const response = await makeUnauthenticatedRequest('', options);
    if (!response.includes('NUMNATIONS')) {
        // If NUMNATIONS is missing, make a separate request to get it
        const worldStatsResponse = await makeUnauthenticatedRequest('', {
            params: { q: 'numnations' }
        });
        return `<WORLD>${worldStatsResponse}${response}</WORLD>`;
    }
    return response;
}

export async function getNationDetails(customNation?: string) {
    const shards = [
        'admirables', 'animal', 'animaltrait', 'answered', 'banners',
        'capital', 'category', 'crime', 'currency', 'customleader',
        'customcapital', 'customreligion', 'demonym', 'demonym2',
        'demonym2plural', 'dispatches', 'flag', 'founded', 'foundedtime',
        'freedom', 'fullname', 'gdp', 'govtdesc', 'govtpriority',
        'happenings', 'industrydesc', 'influence', 'lastactivity',
        'lastlogin', 'legislation', 'majorindustry', 'motto', 'name',
        'notables', 'policies', 'poorest', 'population', 'region',
        'religion', 'richest', 'sensibilities', 'type', 'tax', 'wa'
    ].join('+');

    const options: RequestOptions = {
        params: { q: shards }
    };

    if (customNation) {
        options.nation = customNation;
    }

    return makeUnauthenticatedRequest('', options);
}

export async function getRegionDetails(region: string) {
    const shards = [
        'banlist', 'banner', 'bannerby', 'bannerurl', 'census', 
        'censusranks', 'dbid', 'delegate', 'delegateauth', 'delegatevotes',
        'dispatches', 'embassies', 'embassyrmb', 'factbook', 'flag',
        'founded', 'foundedtime', 'founder', 'frontier', 'gavote',
        'governor', 'governortitle', 'happenings', 'history', 'lastupdate',
        'lastmajorupdate', 'lastminorupdate', 'magnetism', 'messages',
        'name', 'nations', 'numnations', 'wanations', 'numwanations',
        'officerspoll', 'power', 'recruiters', 'scvote', 'tags',
        'wabadges', 'zombie'
    ].join('+');

    const options: RequestOptions = {
        params: {
            region,
            q: shards
        }
    };
    
    return makeUnauthenticatedRequest('', options);
}

export async function getNewspaperInfo(customNation?: string) {
    const options: RequestOptions = {
        params: { q: 'name+customcapital' }
    };
    
    if (customNation) {
        options.nation = customNation;
    }
    
    return makeAuthenticatedRequest('', options);
}

export async function answerIssue(issueId: string, optionId: string) {
    const options: RequestOptions = {
        params: {
            c: 'issue',
            issue: issueId,
            option: optionId
        }
    };
    return makeAuthenticatedRequest('', options);
}
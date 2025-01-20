import { writable, get } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core';

interface AuthStore {
    isAuthenticated: boolean;
    nation: string;
    region: string | null;
}

interface SavedAccount {
    nation: string;
    autologin: string;
    region: string | null;
}

const defaultAuth: AuthStore = {
    isAuthenticated: false,
    nation: '',
    region: null
};

export const auth = writable<AuthStore>(defaultAuth);
export const isAuthenticated = writable(false);
export const currentNation = writable<string>('');
export const savedAccounts = writable<SavedAccount[]>([]);

// Initialize auth state on app start
export async function initAuth(): Promise<void> {
    try {
        console.log('Initializing auth...'); // Debug
        const savedAuth = await invoke<{ nation: string; autologin: string } | null>('get_saved_auth');
        console.log('Raw saved auth response:', savedAuth); // Debug
        
        if (savedAuth && typeof savedAuth === 'object') {
            console.log('Validating saved auth data...'); // Debug
            if ('nation' in savedAuth && 'autologin' in savedAuth) {
                console.log('Found valid auth data, attempting auto-login...'); // Debug
                
                // Pre-set the auth state with saved credentials
                auth.set({
                    isAuthenticated: true,
                    nation: savedAuth.nation,
                    region: null
                });
                currentNation.set(savedAuth.nation);
                isAuthenticated.set(true);

                // Attempt auto-login with saved credentials
                const success = await autoLogin(savedAuth.nation, savedAuth.autologin);
                if (!success) {
                    console.log('Auto-login failed, clearing auth...'); // Debug
                    await logout(); // Clear invalid saved auth
                } else {
                    console.log('Auto-login successful'); // Debug
                }
            } else {
                console.log('Invalid saved auth data structure:', savedAuth); // Debug
            }
        } else {
            console.log('No saved auth data found or invalid format'); // Debug
        }
    } catch (error) {
        console.error('Failed to initialize auth:', error);
    }
}

async function autoLogin(nation: string, autologin: string): Promise<boolean> {
    try {
        const response = await fetch(
            `https://www.nationstates.net/cgi-bin/api.cgi?nation=${encodeURIComponent(nation)}&q=ping+region`,
            {
                headers: {
                    'User-Agent': await invoke<string>('get_user_agent'),
                    'X-Autologin': autologin
                }
            }
        );

        if (!response.ok) return false;

        // Get region info
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const regionName = xmlDoc.querySelector("REGION")?.textContent || null;

        auth.set({
            isAuthenticated: true,
            nation,
            region: regionName
        });
        currentNation.set(nation);
        isAuthenticated.set(true);

        return true;
    } catch (error) {
        console.error('Auto-login failed:', error);
        return false;
    }
}

export async function handleLogin(nation: string, password: string, rememberMe: boolean = false): Promise<boolean> {
    try {
        const response = await fetch(
            `https://www.nationstates.net/cgi-bin/api.cgi?nation=${encodeURIComponent(nation)}&q=ping+region`,
            {
                headers: {
                    'User-Agent': await invoke<string>('get_user_agent'),
                    'X-Password': password
                }
            }
        );

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const autologin = response.headers.get('X-Autologin');
        if (!autologin) {
            throw new Error('Missing authentication data');
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const regionName = xmlDoc.querySelector("REGION")?.textContent || null;

        if (rememberMe) {
            await invoke('save_auth', {
                nation,
                autologin,
                region: regionName
            });
            const accounts = get(savedAccounts);
            const updatedAccounts = accounts.filter(acc => acc.nation !== nation);
            updatedAccounts.push({
                nation,
                autologin,
                region: regionName
            });
            savedAccounts.set(updatedAccounts);
        }

        auth.set({
            isAuthenticated: true,
            nation,
            region: regionName
        });
        
        currentNation.set(nation);
        isAuthenticated.set(true);
        
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        auth.set(defaultAuth);
        return false;
    }
}

export async function switchAccount(nation: string): Promise<boolean> {
    const accounts = get(savedAccounts);
    const account = accounts.find(acc => acc.nation === nation);
    
    if (account) {
        const success = await autoLogin(account.nation, account.autologin);
        if (success) {
            // Update current account
            auth.set({
                isAuthenticated: true,
                nation: account.nation,
                region: account.region
            });
            currentNation.set(account.nation);
            return true;
        }
    }
    return false;
}

export async function logout(): Promise<void> {
    await invoke('clear_auth');
    auth.set(defaultAuth);
    isAuthenticated.set(false);
    currentNation.set('');
}

// Initialize auth on import
initAuth();
// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const prerender = true;
export const ssr = false;

import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { invoke } from '@tauri-apps/api/core';

export const load: LayoutLoad = async ({ url }) => {
    // Skip auth check for login page to avoid redirect loop
    if (url.pathname === '/login') {
        return {};
    }

    try {
        // Check if we have valid auth credentials
        const auth = await invoke('get_auth');
        
        if (!auth) {
            throw redirect(303, '/login');
        }

        return {};
    } catch (error) {
        // If there's any error (including no auth), redirect to login
        throw redirect(303, '/login');
    }
};

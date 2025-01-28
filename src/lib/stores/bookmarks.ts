import { writable } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core';

export interface Bookmark {
    id: string;
    name: string;
    type: 'nation' | 'region';
    flag: string;
    banner: string;  // Add banner field
}

function createBookmarkStore() {
    const { subscribe, set, update } = writable<Bookmark[]>([]);

    return {
        subscribe,
        init: async () => {
            const { items } = await invoke<{ items: Bookmark[] }>('get_bookmarks');
            set(items);
        },
        add: async (bookmark: Bookmark) => {
            await invoke('save_bookmark', { bookmark });
            update(items => [...items.filter(b => b.id !== bookmark.id), bookmark]);
        },
        remove: async (id: string) => {
            await invoke('remove_bookmark', { id });
            update(items => items.filter(b => b.id !== id));
        }
    };
}

export const bookmarks = createBookmarkStore();

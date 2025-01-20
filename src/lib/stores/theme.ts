import { writable } from 'svelte/store';

const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'dark';
export const theme = writable(stored || 'dark');

theme.subscribe(value => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
    }
});
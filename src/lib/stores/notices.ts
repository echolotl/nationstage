import { writable } from 'svelte/store';
import type { Notice } from '$lib/types/notices';

export const notices = writable<Notice[]>([]);
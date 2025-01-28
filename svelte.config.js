import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html', // SPA mode
			strict: false
		}),
		prerender: {
			entries: [] // Don't prerender any routes
		}
	},
	preprocess: vitePreprocess()
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		origin: 'https://ubiquitous-broccoli-p9w9j6qqx67h99q-5173.app.github.dev'
	}
});

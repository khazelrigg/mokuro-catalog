import { sveltekit } from '@sveltejs/kit/vite';  // Import the SvelteKit plugin for Vite
import { defineConfig } from 'vite';  // Import Vite's configuration function

export default defineConfig({
  // Register the SvelteKit plugin
  plugins: [sveltekit()],

  server: {
    host: true  // Allows the development server to be accessible from the local network
  }
});

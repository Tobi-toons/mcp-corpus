import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://tobi-toons.github.io',
  base: '/mcp-corpus',
  vite: {
    plugins: [tailwindcss()]
  }
});

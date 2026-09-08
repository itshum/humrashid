// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.humrashid.com',

  // Moved off GitHub Pages to Vercel. `output` stays the default
  // 'static' - every existing page keeps prerendering exactly as it
  // did on GH Pages - the adapter just makes server rendering
  // available to any future route that opts out via
  // `export const prerender = false` (e.g. the Atrium read-aloud
  // feature's article-fetch endpoint).
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/design-system'),
    }),
  ]
});
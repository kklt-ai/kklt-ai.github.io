import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kklt-ai.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-light',
    },
  },
});

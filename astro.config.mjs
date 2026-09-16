import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ranchotexasubatuba.com.br',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
  build: { format: 'directory', inlineStylesheets: 'always' },
});

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import mdTwins from './src/integrations/md-twins';
import llmsTxt from './src/integrations/llms-txt';

export default defineConfig({
  site: 'https://project-monai.github.io',
  outDir: './dist',
  publicDir: './public',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
    mdTwins(),
    llmsTxt(),
  ],
  build: {
    format: 'file',
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// The production domain is not confirmed yet. Canonical URLs, Open Graph URLs
// and the XML sitemap are only emitted once PUBLIC_SITE_URL is set.
const site = env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: site
    ? [sitemap({ filter: (page) => !/\/(privacy|terms|404)\/?$/.test(page) })]
    : [],
  build: {
    inlineStylesheets: 'auto',
  },
});

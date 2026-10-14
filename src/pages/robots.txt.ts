import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];
  // Draft legal pages use a noindex meta tag instead of Disallow, so crawlers can read it.
  // The sitemap line appears once PUBLIC_SITE_URL is set.
  if (site) lines.push('', `Sitemap: ${new URL('/sitemap-index.xml', site).toString()}`);
  return new Response(lines.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};

/**
 * Footer navigation. `href: null` marks a destination that does not exist
 * yet (no page or section on the site); the footer shows the label as plain
 * text, not a dead link, until a real URL is set here.
 * Hash links are homepage anchors; the footer prefixes them with "/" on other pages.
 */
import { business } from '../config/business';

export interface FooterLink {
  label: string;
  href: string | null;
}

/** XML sitemap is only generated once PUBLIC_SITE_URL is set (see astro.config.mjs). */
const sitemapHref = business.siteUrl ? '/sitemap-index.xml' : null;

export const footerNav: { id: string; heading: string; links: FooterLink[] }[] = [
  {
    id: 'company',
    heading: 'Company',
    links: [
      { label: 'Home', href: '#top' },
      { label: 'About Us', href: null },
      { label: 'Our Approach', href: '#approach' },
      { label: 'Industries', href: '#industries' },
      { label: 'Insights', href: '#insights' },
      { label: 'Careers', href: null },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    id: 'solutions',
    heading: 'Solutions',
    links: [
      { label: 'CCTV & Surveillance', href: '#service-cctv' },
      { label: 'Access Control', href: '#service-access' },
      { label: 'Video Door Phones', href: '#service-vdp' },
      { label: 'Intercom Systems', href: '#service-vdp' },
      { label: 'System Integration', href: '#service-install' },
      { label: 'AMC & Maintenance', href: '#maintenance' },
    ],
  },
  {
    id: 'resources',
    heading: 'Resources',
    links: [
      { label: 'Security Health Check', href: '#audit' },
      { label: 'Case Studies', href: null },
      { label: 'FAQs', href: '#faq' },
      { label: 'Blog / Insights', href: '#insights' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Sitemap', href: sitemapHref },
    ],
  },
];

export const footerLegal: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookie Policy', href: null },
  { label: 'Sitemap', href: sitemapHref },
];

export const footerAbout =
  'Intelligent security solutions for homes, businesses, and institutions. From consultation to installation and ongoing support, 8PAHAR helps you build safer, smarter, and more secure spaces.';

export const footerTagline = ['Intelligent security', 'for a safer tomorrow.'];

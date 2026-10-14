/**
 * JSON-LD builders. Only facts confirmed in the business config are emitted:
 * the Organization upgrades to LocalBusiness only once an address and phone
 * exist, and no ratings or reviews are ever generated.
 */
import { business } from '../config/business';
import { getFaqs } from '../content/faq';

export function buildStructuredData(site: URL | undefined, description: string): Record<string, unknown>[] {
  const url = site?.toString();
  const abs = (path: string) => (site ? new URL(path, site).toString() : undefined);
  const isLocal = Boolean(business.address && business.phone);

  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isLocal ? 'LocalBusiness' : 'Organization',
    name: business.name,
    alternateName: 'Aath Pahar',
    slogan: business.tagline,
    description,
    ...(url && { url, '@id': `${url}#organization` }),
    ...(site && { logo: abs('/brand/icon-512.png'), image: abs('/og-image.jpg') }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        addressLocality: business.address.locality,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
    }),
    ...(business.serviceAreas.length > 0 && { areaServed: business.serviceAreas }),
    ...(business.social.length > 0 && { sameAs: business.social.map((s) => s.href) }),
  };

  // FAQPage mirrors the visible FAQ text exactly. Search engines decide whether
  // to show any rich result; this markup does not guarantee one.
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getFaqs().map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.join(' ') },
    })),
  };

  return [org, faq];
}

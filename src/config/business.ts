/**
 * 8PAHAR business configuration.
 *
 * Every value that has not been confirmed by the business is `null` (or an
 * empty list). Components check these values and hide the related UI —
 * nothing here is ever shown as a placeholder. Fill these in before launch;
 * see README.md → "Before launch".
 */

const env = import.meta.env;

/** Returns a trimmed env value, or null when unset/blank. */
function fromEnv(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export type AuditPricing =
  | { type: 'free' }
  | { type: 'paid'; note: string }
  | null; // Not confirmed yet — copy explains that terms are confirmed before booking.

export type SocialPlatform = 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'x';

/** Footer order. Each profile URL comes from its env variable; unset ones are hidden. */
const SOCIAL_PROFILES: { platform: SocialPlatform; label: string; href: string | null }[] = [
  { platform: 'linkedin', label: 'LinkedIn', href: fromEnv(env.PUBLIC_SOCIAL_LINKEDIN) },
  { platform: 'instagram', label: 'Instagram', href: fromEnv(env.PUBLIC_SOCIAL_INSTAGRAM) },
  { platform: 'youtube', label: 'YouTube', href: fromEnv(env.PUBLIC_SOCIAL_YOUTUBE) },
  { platform: 'facebook', label: 'Facebook', href: fromEnv(env.PUBLIC_SOCIAL_FACEBOOK) },
  { platform: 'x', label: 'X', href: fromEnv(env.PUBLIC_SOCIAL_X) },
];

export interface BusinessConfig {
  name: string;
  descriptor: string;
  hindiName: string;
  tagline: string;
  /** Production origin, e.g. https://www.example.com. */
  siteUrl: string | null;
  /** E.164 telephone number, e.g. +91XXXXXXXXXX. */
  phone: string | null;
  /** E.164 WhatsApp Business number. */
  whatsapp: string | null;
  email: string | null;
  /** Confirmed business hours shown under the phone number, e.g. "Mon – Sat, 9:30 AM – 6:30 PM". */
  hours: string | null;
  /** Approved note shown under the email address, e.g. a confirmed response time. */
  emailNote: string | null;
  /** Short public location line for the footer, e.g. "Jaipur, Rajasthan, India". */
  location: string | null;
  /** Approved note shown under the location, e.g. a service-area statement. */
  locationNote: string | null;
  /** Registered or principal business address, once confirmed. */
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  } | null;
  /** Confirmed cities / regions served. Empty until confirmed. */
  serviceAreas: string[];
  /** Whether the security audit is free or paid. */
  auditPricing: AuditPricing;
  /** Endpoint receiving enquiry JSON. See server/lead-handler.ts. */
  leadEndpoint: string | null;
  /** Google Tag Manager container ID. */
  gtmId: string | null;
  /** Social profiles, once confirmed (only configured ones are listed). */
  social: { platform: SocialPlatform; label: string; href: string }[];
  /** Set to true once legal has approved the privacy policy and terms text. */
  legalPagesApproved: boolean;
}

export const business: BusinessConfig = {
  name: '8PAHAR',
  descriptor: 'Intelligent Security Systems',
  hindiName: 'आठ पहर',
  tagline: 'Watchful. Always.',
  siteUrl: fromEnv(env.PUBLIC_SITE_URL),
  phone: fromEnv(env.PUBLIC_PHONE),
  whatsapp: fromEnv(env.PUBLIC_WHATSAPP),
  email: fromEnv(env.PUBLIC_EMAIL),
  hours: fromEnv(env.PUBLIC_BUSINESS_HOURS),
  emailNote: fromEnv(env.PUBLIC_EMAIL_NOTE),
  location: fromEnv(env.PUBLIC_LOCATION),
  locationNote: fromEnv(env.PUBLIC_LOCATION_NOTE),
  address: null,
  serviceAreas: [],
  auditPricing: null,
  leadEndpoint: fromEnv(env.PUBLIC_LEAD_ENDPOINT),
  gtmId: fromEnv(env.PUBLIC_GTM_ID),
  social: SOCIAL_PROFILES.filter((s): s is BusinessConfig['social'][number] => s.href !== null),
  legalPagesApproved: false,
};

/** tel: link for the configured phone number. */
export const telHref = business.phone ? `tel:${business.phone.replace(/[^\d+]/g, '')}` : null;

/** Human-readable phone, e.g. "+91 98XXX XXXXX" (returned as configured). */
export const phoneDisplay = business.phone;

/** wa.me link with an optional pre-filled message (no personal data). */
export function whatsappHref(message?: string): string | null {
  if (!business.whatsapp) return null;
  const digits = business.whatsapp.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export const mailHref = business.email ? `mailto:${business.email}` : null;

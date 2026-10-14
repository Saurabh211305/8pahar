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
  /** Social profiles, once confirmed. */
  social: { label: string; href: string }[];
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
  address: null,
  serviceAreas: [],
  auditPricing: null,
  leadEndpoint: fromEnv(env.PUBLIC_LEAD_ENDPOINT),
  gtmId: fromEnv(env.PUBLIC_GTM_ID),
  social: [],
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

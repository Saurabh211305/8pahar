/**
 * Lead data contract shared by the browser forms and the server handler
 * (server/lead-handler.ts). Keep validation rules here so both sides agree.
 */

export const PROPERTY_TYPES = [
  { value: 'residential-home', label: 'Home / villa' },
  { value: 'housing-society', label: 'Apartment / housing society' },
  { value: 'office-commercial', label: 'Office / commercial building' },
  { value: 'retail', label: 'Retail / showroom' },
  { value: 'industrial-warehouse', label: 'Factory / warehouse / industrial site' },
  { value: 'construction-site', label: 'Construction site' },
  { value: 'institution', label: 'Institution / organisation' },
  { value: 'other', label: 'Other' },
] as const;

export const REQUIREMENTS = [
  { value: 'security-audit', label: 'Security audit / assessment' },
  { value: 'security-plan', label: 'Integrated security plan' },
  { value: 'cctv', label: 'CCTV / IP camera system' },
  { value: 'ai-surveillance', label: 'AI-enabled surveillance' },
  { value: 'access-control', label: 'Access control' },
  { value: 'video-door-phone', label: 'Video door phone' },
  { value: 'installation', label: 'Installation & integration' },
  { value: 'monitoring', label: 'Monitoring solution' },
  { value: 'upgrade', label: 'Upgrade an existing system' },
  { value: 'repair', label: 'Repair / troubleshooting' },
  { value: 'amc', label: 'Annual Maintenance Contract (AMC)' },
  { value: 'question', label: 'General question' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]['value'];
export type Requirement = (typeof REQUIREMENTS)[number]['value'];

export interface LeadAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
}

export interface LeadPayload {
  name: string;
  phone: string;
  propertyType: PropertyType;
  location: string;
  requirement: Requirement;
  details?: string;
  consent: true;
  /** Which form captured the lead: "audit" | "enquiry". */
  formId: string;
  /** The CTA that led the visitor to the form, if any. */
  ctaSource?: string;
  /** Page URL without query string or fragment. */
  landingPage: string;
  attribution: LeadAttribution;
  submittedAt: string;
}

export type FieldErrors = Partial<Record<'name' | 'phone' | 'propertyType' | 'location' | 'requirement' | 'details' | 'consent', string>>;

export const LIMITS = { name: 80, location: 80, details: 1000, attribution: 150 } as const;

const propertyValues = new Set<string>(PROPERTY_TYPES.map((p) => p.value));
const requirementValues = new Set<string>(REQUIREMENTS.map((r) => r.value));

/**
 * Normalises Indian phone input to 10 digits. Accepts spaces, dashes,
 * a +91 / 91 country code or a leading 0. Returns null when invalid.
 */
export function normalisePhone(input: string): string | null {
  let digits = input.replace(/[\s\-().]/g, '');
  if (!/^\+?\d+$/.test(digits)) return null;
  digits = digits.replace(/^\+/, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[1-9]\d{9}$/.test(digits) ? digits : null;
}

export interface RawLeadFields {
  name?: unknown;
  phone?: unknown;
  propertyType?: unknown;
  location?: unknown;
  requirement?: unknown;
  details?: unknown;
  consent?: unknown;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Validates the visitor-entered fields. Returns errors keyed by field. */
export function validateLeadFields(raw: RawLeadFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = str(raw.name);
  const location = str(raw.location);
  const details = str(raw.details);

  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!str(raw.phone)) errors.phone = 'Please enter a phone number so our team can reach you.';
  else if (!normalisePhone(str(raw.phone))) errors.phone = 'Please enter a valid 10-digit phone number, e.g. 98XXX XXXXX.';

  if (!propertyValues.has(str(raw.propertyType))) errors.propertyType = 'Please choose your property type.';

  if (location.length < 2) errors.location = 'Please enter the city or area of the property.';
  else if (location.length > LIMITS.location) errors.location = `Please keep the location under ${LIMITS.location} characters.`;

  if (!requirementValues.has(str(raw.requirement))) errors.requirement = 'Please choose what you need help with.';

  if (details.length > LIMITS.details) errors.details = `Please keep additional details under ${LIMITS.details} characters.`;

  if (raw.consent !== true && raw.consent !== 'on' && raw.consent !== 'true') {
    errors.consent = 'Please confirm that we may contact you about this enquiry.';
  }
  return errors;
}

export function labelFor(list: readonly { value: string; label: string }[], value: string): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

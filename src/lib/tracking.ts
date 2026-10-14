/**
 * Analytics event layer.
 *
 * Events are pushed to `window.dataLayer` (Google Tag Manager), sent to
 * `gtag` when present, and re-dispatched as a DOM CustomEvent
 * (`8pahar:track`) so any other analytics/CRM adapter can listen without
 * changing this file. No personal data (name, phone, free text) is ever
 * included in event parameters.
 *
 * Client-side events describe visitor intent only. `qualified_lead` and
 * `audit_booked` must be recorded from the CRM / booking workflow (e.g. as
 * offline or server-side conversions) — a click is never a qualified lead.
 */

export const EVENTS = {
  auditCtaClick: 'security_audit_cta_click',
  formStart: 'security_form_start',
  formSubmit: 'security_form_submit',
  phoneClick: 'phone_click',
  whatsappClick: 'whatsapp_click',
  serviceEnquiry: 'service_enquiry',
  /** Recorded by the CRM workflow — not fired by the website. */
  qualifiedLead: 'qualified_lead',
  /** Recorded by the CRM / booking workflow — not fired by the website. */
  auditBooked: 'audit_booked',
} as const;

export type ClientEvent = Exclude<(typeof EVENTS)[keyof typeof EVENTS], 'qualified_lead' | 'audit_booked'>;
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: ClientEvent, params: Params = {}): void {
  const clean: Params = {};
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== '') clean[key] = value;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...clean });
  if (typeof window.gtag === 'function') window.gtag('event', event, clean);
  window.dispatchEvent(new CustomEvent('8pahar:track', { detail: { event, params: clean } }));
}

/* ---------- Attribution ---------- */

const ATTR_KEY = '8pahar:attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/**
 * Stores campaign parameters for the browsing session (first touch wins).
 * Uses sessionStorage only; nothing persists beyond the session.
 */
export function captureAttribution(maxLength = 150): void {
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const query = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = query.get(key);
      if (value) data[key] = value.slice(0, maxLength);
    }
    if (document.referrer) {
      try {
        const ref = new URL(document.referrer);
        if (ref.origin !== window.location.origin) data.referrer = ref.origin; // origin only — no paths/queries
      } catch {
        /* ignore malformed referrer */
      }
    }
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (private mode / blocked) — attribution is optional */
  }
}

export function readAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

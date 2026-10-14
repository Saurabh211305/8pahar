/**
 * Reference server-side lead handler (Web Fetch API: Request → Response).
 *
 * It is NOT deployed automatically — the site is static. Wrap `handleLead`
 * in the serverless runtime you choose (Vercel / Netlify / Cloudflare
 * Workers / your own Node server), then set PUBLIC_LEAD_ENDPOINT to its URL.
 * See README.md → "Lead capture & CRM".
 *
 * Responsibilities:
 *  - re-validate every field (never trust the browser)
 *  - drop obvious spam (honeypot + minimum completion time)
 *  - forward the lead to the CRM webhook with an HMAC signature
 *  - never log personal data
 */
import { LIMITS, normalisePhone, validateLeadFields, type LeadPayload } from '../src/lib/lead-schema';

export interface LeadHandlerEnv {
  /** CRM / automation webhook that stores the lead (secret, server-only). */
  CRM_WEBHOOK_URL?: string;
  /** Shared secret used to sign the webhook body (HMAC-SHA256). */
  CRM_WEBHOOK_SECRET?: string;
  /** Comma-separated list of allowed browser origins, e.g. https://www.example.com */
  ALLOWED_ORIGINS?: string;
}

const MIN_COMPLETION_MS = 2500;
const MAX_BODY_BYTES = 8_000;

const json = (status: number, body: unknown, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });

function corsHeaders(request: Request, env: LeadHandlerEnv): Record<string, string> {
  const origin = request.headers.get('origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'origin',
  };
}

async function sign(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);

export async function handleLead(request: Request, env: LeadHandlerEnv): Promise<Response> {
  const cors = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' }, cors);

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'payload_too_large' }, cors);

  // JSON from the enhanced form; urlencoded from the no-JavaScript fallback.
  const isForm = (request.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded');
  let body: Record<string, unknown>;
  try {
    body = isForm ? Object.fromEntries(new URLSearchParams(text)) : (JSON.parse(text) as Record<string, unknown>);
  } catch {
    return json(400, { ok: false, error: 'invalid_json' }, cors);
  }

  // Spam heuristics: silently accept so bots learn nothing, but do not forward.
  const honeypot = typeof body._hp === 'string' && body._hp.length > 0;
  const tooFast = typeof body._t === 'number' && body._t < MIN_COMPLETION_MS;
  if (honeypot || tooFast) return json(200, { ok: true }, cors);

  const errors = validateLeadFields(body);
  if (Object.keys(errors).length > 0) return json(422, { ok: false, error: 'validation_failed', fields: errors }, cors);

  const attribution = (typeof body.attribution === 'object' && body.attribution) || {};
  const lead: LeadPayload = {
    name: clip(body.name, LIMITS.name)!,
    phone: normalisePhone(String(body.phone))!,
    propertyType: body.propertyType as LeadPayload['propertyType'],
    location: clip(body.location, LIMITS.location)!,
    requirement: body.requirement as LeadPayload['requirement'],
    details: clip(body.details, LIMITS.details) || undefined,
    consent: true,
    formId: clip(body.formId, 40) ?? 'unknown',
    ctaSource: clip(body.ctaSource, 80),
    landingPage: clip(body.landingPage, 300) ?? '',
    attribution: Object.fromEntries(
      Object.entries(attribution as Record<string, unknown>)
        .filter(([k]) => /^(utm_(source|medium|campaign|term|content)|referrer)$/.test(k))
        .map(([k, v]) => [k, clip(v, LIMITS.attribution)]),
    ),
    submittedAt: new Date().toISOString(),
  };

  if (!env.CRM_WEBHOOK_URL || !env.CRM_WEBHOOK_SECRET) {
    console.error('[lead-handler] CRM webhook is not configured; lead not stored.');
    return json(503, { ok: false, error: 'not_configured' }, cors);
  }

  const payload = JSON.stringify(lead);
  try {
    const res = await fetch(env.CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-8pahar-signature': await sign(env.CRM_WEBHOOK_SECRET, payload) },
      body: payload,
    });
    if (!res.ok) {
      console.error(`[lead-handler] CRM webhook responded ${res.status}`); // status only, never lead data
      return json(502, { ok: false, error: 'upstream_failed' }, cors);
    }
  } catch {
    console.error('[lead-handler] CRM webhook unreachable');
    return json(502, { ok: false, error: 'upstream_unreachable' }, cors);
  }

  return json(200, { ok: true }, cors);
}

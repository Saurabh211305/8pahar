/**
 * Progressive enhancement for the landing page. Everything here is optional:
 * without JavaScript, anchors still navigate, <details> still open and forms
 * still POST to the configured endpoint.
 */
import { captureAttribution, readAttribution, track, EVENTS } from '../lib/tracking';
import { LIMITS, normalisePhone, validateLeadFields, type FieldErrors, type RawLeadFields } from '../lib/lead-schema';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = (): ScrollBehavior => (reducedMotion() ? 'auto' : 'smooth');

/* ---------------------------------------------------------------- Header */

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileNav(): { close: () => void } {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const label = document.querySelector<HTMLElement>('[data-nav-toggle-label]');
  const noop = { close: () => {} };
  if (!toggle || !nav) return noop;

  const setOpen = (open: boolean, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    if (open) nav.querySelector<HTMLElement>('a, button')?.focus();
    else if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (mq) => {
    if (mq.matches) setOpen(false);
  });
  return { close: () => setOpen(false) };
}

/** Header dropdowns: disclosure buttons (click / Enter / Space), Esc and outside-click close. */
function initMenus(): void {
  const toggles = [...document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]')];
  if (!toggles.length) return;
  const closeAll = (except?: HTMLButtonElement) =>
    toggles.forEach((t) => t !== except && t.setAttribute('aria-expanded', 'false'));

  toggles.forEach((toggle) =>
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      closeAll(toggle);
      toggle.setAttribute('aria-expanded', String(open));
    }),
  );
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-menu]') || target.closest('[data-menu] a')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
    if (open) {
      closeAll();
      open.focus();
    }
  });
  // Close a desktop dropdown once keyboard focus leaves it.
  document.querySelectorAll<HTMLElement>('[data-menu]').forEach((menu) =>
    menu.addEventListener('focusout', (e) => {
      if (!menu.contains(e.relatedTarget as Node | null)) closeAll();
    }),
  );
}

/* ------------------------------------------------------------------ Forms */

type LeadForm = HTMLFormElement & { dataset: DOMStringMap };
const FIELD_NAMES = ['name', 'phone', 'propertyType', 'location', 'requirement', 'details', 'consent'] as const;

function readFields(form: LeadForm): RawLeadFields {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? ''),
    phone: String(data.get('phone') ?? ''),
    propertyType: String(data.get('propertyType') ?? ''),
    location: String(data.get('location') ?? ''),
    requirement: String(data.get('requirement') ?? ''),
    details: String(data.get('details') ?? ''),
    consent: (form.elements.namedItem('consent') as HTMLInputElement | null)?.checked === true,
  };
}

/** Element that carries a field's invalid state: the control, or the fieldset of a radio group. */
function fieldTarget(form: LeadForm, name: string): HTMLElement | null {
  const item = form.elements.namedItem(name);
  if (item instanceof RadioNodeList) return form.querySelector<HTMLElement>(`[data-field-group="${name}"]`);
  return item as HTMLElement | null;
}

/** Element to focus for a field (first radio of a group). */
function focusTarget(form: LeadForm, name: string): HTMLElement | null {
  const item = form.elements.namedItem(name);
  if (item instanceof RadioNodeList) return (item[0] as HTMLElement | undefined) ?? null;
  return item as HTMLElement | null;
}

function showErrors(form: LeadForm, errors: FieldErrors, only?: string): void {
  for (const name of FIELD_NAMES) {
    if (only && name !== only) continue;
    const input = fieldTarget(form, name);
    const errorEl = form.querySelector<HTMLElement>(`#${form.dataset.leadForm}-${name}-error`);
    if (!input || !errorEl) continue;
    const message = errors[name] ?? '';
    errorEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}

function updateSubmitLabel(form: LeadForm): void {
  const alt = form.dataset.altSubmitLabel;
  const text = form.querySelector<HTMLElement>('[data-submit-text]');
  if (!alt || !text) return;
  const requirement = (form.elements.namedItem('requirement') as HTMLSelectElement | null)?.value ?? '';
  text.textContent = !requirement || requirement === 'security-audit' ? form.dataset.submitLabel ?? text.textContent : alt;
}

async function submitLead(endpoint: string, payload: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: 'omit',
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

function initLeadForm(form: LeadForm): void {
  const root = form.closest<HTMLElement>('[data-lead-root]');
  const status = form.querySelector<HTMLElement>('[data-lead-status]');
  const statusText = form.querySelector<HTMLElement>('[data-lead-status-text]');
  const success = root?.querySelector<HTMLElement>('[data-lead-success]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const formId = form.dataset.leadForm ?? 'unknown';
  const loadedAt = Date.now();
  let started = false;
  let submitting = false;
  const touched = new Set<string>();

  form.noValidate = true;
  updateSubmitLabel(form);

  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    track(EVENTS.formStart, { form_id: formId });
  });

  // Validate a field once the visitor has left it; re-validate as they correct it.
  form.addEventListener('focusout', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name || !FIELD_NAMES.includes(name as (typeof FIELD_NAMES)[number])) return;
    if (!(e.target as HTMLInputElement).value && name !== 'consent') return;
    touched.add(name);
    showErrors(form, validateLeadFields(readFields(form)), name);
  });
  form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    target.classList.remove('is-prefilled');
    if (touched.has(target.name)) showErrors(form, validateLeadFields(readFields(form)), target.name);
  });
  form.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    target.classList.remove('is-prefilled');
    if (target.name === 'requirement') updateSubmitLabel(form);
    if (target.name === 'consent' || touched.has(target.name)) showErrors(form, validateLeadFields(readFields(form)), target.name);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (status) status.hidden = true;

    const fields = readFields(form);
    const errors = validateLeadFields(fields);
    FIELD_NAMES.forEach((n) => touched.add(n));
    showErrors(form, errors);
    const firstInvalid = FIELD_NAMES.find((n) => errors[n]);
    if (firstInvalid) {
      focusTarget(form, firstInvalid)?.focus();
      return;
    }

    const endpoint = form.dataset.endpoint ?? '';
    const payload = {
      ...fields,
      phone: normalisePhone(String(fields.phone)),
      consent: true,
      formId,
      ctaSource: (form.elements.namedItem('ctaSource') as HTMLInputElement | null)?.value || undefined,
      landingPage: `${window.location.origin}${window.location.pathname}`,
      attribution: readAttribution(),
      _hp: (form.elements.namedItem('_hp') as HTMLInputElement | null)?.value ?? '',
      _t: Date.now() - loadedAt,
      details: String(fields.details ?? '').slice(0, LIMITS.details) || undefined,
    };

    submitting = true;
    button?.setAttribute('aria-disabled', 'true');
    button?.setAttribute('aria-busy', 'true');

    let ok: boolean;
    if (endpoint) {
      ok = await submitLead(endpoint, payload);
    } else if (import.meta.env.DEV) {
      // Development only: no endpoint configured, so simulate acceptance. No personal data is logged.
      console.info('[8PAHAR] PUBLIC_LEAD_ENDPOINT is not set — submission simulated in development.');
      await new Promise((r) => setTimeout(r, 500));
      ok = true;
    } else {
      ok = false;
      if (statusText) statusText.textContent = 'Online enquiries are temporarily unavailable. Please try again later.';
    }

    submitting = false;
    button?.removeAttribute('aria-disabled');
    button?.removeAttribute('aria-busy');

    if (ok) {
      // Counted only after the endpoint has accepted the lead.
      track(EVENTS.formSubmit, {
        form_id: formId,
        requirement: String(fields.requirement),
        property_type: String(fields.propertyType),
        cta_source: payload.ctaSource,
      });
      form.reset();
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } else if (status) {
      status.hidden = false;
    }
  });
}

/* -------------------------------------------------------------- CTA links */

function prefillForm(form: LeadForm, property?: string, requirement?: string, source?: string): void {
  // A form can translate general CTA values to its own options (see ASSESSMENT_PREFILL_ALIASES).
  let aliases: Record<string, string> = {};
  try {
    aliases = JSON.parse(form.dataset.prefillAliases ?? '{}') as Record<string, string>;
  } catch {
    /* no aliases */
  }
  const apply = (name: string, raw?: string) => {
    const value = raw && raw in aliases ? aliases[raw] : raw;
    if (!value) return;
    const item = form.elements.namedItem(name);
    if (item instanceof RadioNodeList) {
      const radio = [...item].find((r) => (r as HTMLInputElement).value === value) as HTMLInputElement | undefined;
      if (!radio) return;
      radio.checked = true;
    } else {
      const select = item as HTMLSelectElement | null;
      if (!select || !select.options || ![...select.options].some((o) => o.value === value)) return;
      select.value = value;
      select.classList.add('is-prefilled');
    }
    fieldTarget(form, name)?.removeAttribute('aria-invalid');
    const err = form.querySelector<HTMLElement>(`#${form.dataset.leadForm}-${name}-error`);
    if (err) err.textContent = '';
  };
  apply('propertyType', property);
  apply('requirement', requirement);
  updateSubmitLabel(form);
  const sourceField = form.querySelector<HTMLInputElement>('[data-cta-source-field]');
  if (sourceField && source) sourceField.value = source;
}

function focusForm(root: HTMLElement, form: LeadForm): void {
  root.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[type="text"], input[type="tel"], select')].filter((el) => el.tabIndex !== -1);
  const firstEmpty = fields.find((el) => !el.value);
  // Focus after the scroll settles so the browser doesn't jump.
  window.setTimeout(() => (firstEmpty ?? fields[0])?.focus({ preventScroll: true }), reducedMotion() ? 0 : 450);
  root.classList.add('is-highlighted');
  window.setTimeout(() => root.classList.remove('is-highlighted'), 1800);
}

function initCtas(nav: { close: () => void }): void {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-cta], a[data-contact]');
    if (!link) return;

    const source = link.dataset.ctaSource;
    if (link.dataset.contact === 'phone') return track(EVENTS.phoneClick, { cta_source: source });
    if (link.dataset.contact === 'whatsapp') return track(EVENTS.whatsappClick, { cta_source: source });

    const kind = link.dataset.cta;
    const property = link.dataset.prefillProperty;
    const requirement = link.dataset.prefillRequirement;
    if (kind === 'audit') track(EVENTS.auditCtaClick, { cta_label: link.dataset.ctaLabel, cta_source: source, property_type: property });
    else if (kind === 'service') track(EVENTS.serviceEnquiry, { cta_label: link.dataset.ctaLabel, cta_source: source, requirement, property_type: property });

    const hash = link.hash;
    if (link.pathname !== window.location.pathname || (hash !== '#audit' && hash !== '#enquiry')) return;
    const form = document.querySelector<LeadForm>(`[data-lead-form="${hash.slice(1)}"]`);
    const root = form?.closest<HTMLElement>('[data-lead-root]');
    if (!form || !root) return;

    e.preventDefault();
    nav.close();
    const successPanel = root.querySelector<HTMLElement>('[data-lead-success]');
    if (form.hidden && successPanel) {
      // Allow another enquiry after a successful one.
      form.hidden = false;
      successPanel.hidden = true;
    }
    prefillForm(form, property, requirement, `${source ?? 'cta'}:${link.dataset.ctaLabel ?? ''}`.slice(0, 80));
    focusForm(root, form);
    history.replaceState(null, '', hash);
  });
}

/* -------------------------------------------------------------------- FAQ */

function initFaqDeepLinks(): void {
  const openFromHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const item = document.getElementById(id);
    if (item instanceof HTMLDetailsElement) item.open = true;
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#faq-"]');
    if (!link) return;
    const item = document.getElementById(link.hash.slice(1));
    if (item instanceof HTMLDetailsElement) item.open = true;
  });
}

/* ------------------------------------------------------- Mobile CTA bar */

function initMobileCta(): void {
  const bar = document.querySelector<HTMLElement>('[data-mobile-cta]');
  const hero = document.querySelector('[data-hero]');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;

  const visible = new Set<Element>();
  const footer = document.querySelector('.site-footer');
  const watched = [hero, ...document.querySelectorAll('[data-lead-root]'), ...(footer ? [footer] : [])];
  const update = () => {
    const show = visible.size === 0;
    bar.classList.toggle('is-visible', show);
    bar.toggleAttribute('inert', !show);
    bar.setAttribute('aria-hidden', String(!show));
  };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    update();
  });
  watched.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------- Init */

captureAttribution(LIMITS.attribution);
initHeader();
const nav = initMobileNav();
initMenus();
initCtas(nav);
document.querySelectorAll<LeadForm>('form[data-lead-form]').forEach(initLeadForm);
initFaqDeepLinks();
initMobileCta();

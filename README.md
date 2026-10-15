# 8PAHAR — Intelligent Security Systems

Conversion-focused landing page for 8PAHAR. Primary goal: qualified
security-audit enquiries.

**Stack:** [Astro](https://astro.build) (static output) · TypeScript · hand-written
CSS design tokens · self-hosted Manrope + Newsreader (Fontsource). No UI
framework — the page ships as pre-rendered HTML with ~one small script for
navigation, forms, CTA pre-selection and analytics.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check (types) + static build to dist/
npm run preview   # serve the production build
npm run images    # re-generate responsive WebP photography (needs curl + ImageMagick)
```

## Structure

```
src/
  config/business.ts      ← ALL unconfirmed business details (phone, areas, pricing…)
  content/site.ts         ← page copy for the 12 sections
  content/faq.ts          ← FAQ copy (also feeds FAQPage structured data)
  content/images.ts       ← photo registry (sizes, aspect ratios)
  components/sections/    ← one component per section, in page order
  components/ui/          ← CtaLink, EnquiryForm, Picture, SectionHeading, Icon
  components/illustrations/ ← custom SVG diagrams (coverage, problems, 8-stage, services)
  components/brand/       ← Logo, vector Wordmark, Hindi lockup (traced from brand-source/)
  lib/lead-schema.ts      ← lead fields + validation shared by browser and server
  lib/tracking.ts         ← analytics events + UTM attribution
  lib/structured-data.ts  ← JSON-LD (Organization/LocalBusiness + FAQPage)
  scripts/main.ts         ← progressive enhancement
server/lead-handler.ts    ← reference server-side lead endpoint (not auto-deployed)
```

Page order: 01 Hero · 02 Problems · 03 Security health check (audit form) ·
04 8-stage architecture · 05 Services · 06 Industries · 07 Intelligent
surveillance · 08 How it works · 09 Why 8PAHAR · 10 AMC · 11 FAQ · 12 Final
enquiry form.

## Hero (approved reference design)

The header and hero recreate the approved reference mock-up. The photograph is
the supplied asset (`brand-source/hero-architecture-reference.webp`); its
baked-in labels were removed with `scripts/clean-hero-labels.py` and re-created
as HTML. The "See how a security audit helps" callout links to the How it works
section because no video exists yet — point `hero.callout.href` in
`src/content/site.ts` at a real video when one is produced.

## Section 02 (approved reference design)

The diagnostic photograph is the supplied asset
(`brand-source/gaps-property-reference.webp`). Its six baked callout boxes were
removed with `scripts/clean-gaps-labels.py` and re-created as HTML callouts,
positioned in image coordinates (`problems.gaps[].at` in `src/content/site.ts`)
so they stay on the photograph's connector lines. Keep the script's box list
and those positions in sync if the image changes.

## Section 03 (approved reference design)

The illustration is the supplied artwork (`brand-source/health-check-illustration.webp`,
from "SECTION 3 VECTOR IMAGE.png"), resized only. The booking form
(`src/components/ui/AssessmentForm.astro`) uses the Section 03 option sets in
`src/lib/lead-schema.ts`; CTAs elsewhere that pre-select general values are
translated through `ASSESSMENT_PREFILL_ALIASES`.

## Section 04 (approved reference design)

The illustration is the supplied artwork (`brand-source/security-architecture-illustration.webp`,
from "section 4 vector image.png"), resized only; its eight icon nodes are part
of the image. The stage labels are HTML, pinned to the nodes via
`methodology.stages[].at` (percent of the 1672×941 artwork) in `src/content/site.ts`.
Node centres were measured from the image; update `at` if the artwork changes.

## Before launch

Nothing below is published as fact until it is configured — the related UI is
hidden instead of showing placeholders.

| Item | Where | Effect when set |
| --- | --- | --- |
| Production domain | `PUBLIC_SITE_URL` | canonical URLs, absolute OG URLs, XML sitemap, sitemap line in robots.txt |
| Lead endpoint | `PUBLIC_LEAD_ENDPOINT` | forms submit; **without it production forms show an "unavailable" error** |
| Phone | `PUBLIC_PHONE` (E.164) | Call buttons (FAQ, final section, footer, mobile bar) |
| WhatsApp | `PUBLIC_WHATSAPP` (E.164) | WhatsApp buttons |
| Email | `PUBLIC_EMAIL` | footer + privacy notice |
| GTM container | `PUBLIC_GTM_ID` | loads Google Tag Manager |
| Audit free / paid | `auditPricing` in `business.ts` | audit panel note + FAQ answer |
| Service areas | `serviceAreas` in `business.ts` | footer, FAQ, `areaServed` |
| Address | `address` in `business.ts` | footer; with phone, upgrades schema to `LocalBusiness` |
| Social profiles | `social` in `business.ts` | footer + `sameAs` |
| Legal text approved | `legalPagesApproved` | removes the draft notice and `noindex` from /privacy and /terms |

Also: replace stock photography with real project photos (see `CREDITS.md`),
have the privacy notice and terms reviewed (they are drafts describing what the
site actually collects), and research the final keyword map — the keyword
themes in the copy are a starting point, not verified search-volume targets.

## Lead capture & CRM

The browser POSTs JSON to `PUBLIC_LEAD_ENDPOINT`:

```json
{ "name", "phone", "propertyType", "location", "requirement", "details?",
  "consent": true, "formId": "audit|enquiry", "ctaSource",
  "landingPage", "attribution": { "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer" },
  "_hp": "honeypot", "_t": msSincePageLoad }
```

`server/lead-handler.ts` is a ready-made Web-standard handler
(`Request → Response`) that re-validates every field with the shared schema,
drops honeypot/too-fast submissions, normalises the phone number, and forwards
the clean lead to `CRM_WEBHOOK_URL` signed with HMAC-SHA256
(`x-8pahar-signature`, secret `CRM_WEBHOOK_SECRET`). It never logs personal
data. To finish the integration:

1. Choose the CRM (or automation tool) and create an inbound webhook.
2. Deploy `handleLead` in your host's serverless runtime (Vercel/Netlify
   function, Cloudflare Worker, or a small Node server), with
   `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` and `ALLOWED_ORIGINS` set as
   server-side secrets.
3. Set `PUBLIC_LEAD_ENDPOINT` to the deployed URL and rebuild.
4. Verify a real submission arrives in the CRM and the signature checks out.

No credentials are stored in this repository. Without JavaScript the form
falls back to a standard urlencoded POST, which the handler also accepts.

## Analytics events

Pushed to `window.dataLayer` (GTM), `gtag` if present, and a
`8pahar:track` DOM event. Parameters never include names, phone numbers or
free text.

| Event | Fired when |
| --- | --- |
| `security_audit_cta_click` | any audit CTA is clicked (intent only) |
| `service_enquiry` | a service/property-specific CTA is clicked (intent only) |
| `security_form_start` | first interaction with a form |
| `security_form_submit` | **only after the endpoint accepts the lead** |
| `phone_click` / `whatsapp_click` | contact links clicked |
| `qualified_lead` / `audit_booked` | **not fired by the site** — record these from the CRM/booking workflow (e.g. offline conversion import) |

UTM parameters are captured first-touch per browser session (sessionStorage)
and attached to the lead.

## What was verified

- `astro check`: 0 errors / warnings; production build succeeds.
- Desktop 1440, tablet 820, mobile 390: no horizontal overflow, no console
  errors, no failed requests.
- CTAs pre-select property type / requirement and scroll to the right form;
  validation, error state, success state and dataLayer events tested in a
  browser against an intercepted endpoint; mobile nav (Esc, focus return) and
  mobile CTA bar (hidden over hero, forms and footer) tested.
- `server/lead-handler.ts` tested for valid, invalid, honeypot, too-fast,
  form-encoded and unconfigured cases.
- Core Web Vitals must be measured after deployment on real hosting.

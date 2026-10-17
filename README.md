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

## Section 05 (approved reference design)

Photography is the supplied set ("section 5-*.png"), resized only; per-card
zoom/focal points (`services.items[].crop`) reproduce the reference crops.
**Missing asset:** the Video Door Phones & Intercoms photo was not supplied.
`public/images/svc-vdp-temp-330.webp` is a temporary crop of that photo from the
approved mock-up (no text) — replace it with the original and update the
`svc-vdp-temp` entry in `src/content/images.ts`.

## Section 06 (approved reference design)

Photography is the supplied set ("section 6*.png"), resized only. Cards open
the Section 03 form with the property type pre-selected; the arcs on the left
are part of the supplied background photograph.

## Section 07 (approved reference design)

The illustration is the supplied artwork ("section7-vector image.png"), resized
only. The four example event cards are HTML, pinned in illustration
coordinates (`intelligence.chip/events[].at`); they are illustrative, not a
live feed. **Temporary assets:** `public/images/evt-{person,vehicle,delivery}.webp`
are thumbnail crops from the approved mock-up — replace with supplied images.

## Section 08 (approved reference design)

Content lives in `howItWorks` (`src/content/site.ts`). No image assets were
supplied for this section, so the five step vignettes are inline SVG
(`src/components/illustrations/ProcessArt.astro`, decorative, `aria-hidden`).
Desktop: five columns joined by a curved connector with arrows. Tablet
(≤1180px): 3 + 2 grid, connector hidden. Mobile (≤700px): vertical timeline.
The CTA goes to the Section 03 form (`#audit`); a click is tracked as a CTA
event only, not as a lead or booking.

## Section 09 (approved reference design)

Content lives in `why` (`src/content/site.ts`); the component is
`src/components/sections/Why.astro` (id `why-8pahar` kept for the existing nav
link). No images or icons: numbered circles, fine dividers, terracotta accent
lines and two low-contrast CSS corner curves. Desktop 3 × 2 grid; ≤1240px two
columns; ≤700px one column. The CTA goes to the Section 03 form (`#audit`).
The previous `assessment` photo is no longer used on the page.

## Section 10 (approved reference design)

Content lives in `amc` (`src/content/site.ts`); the component is
`src/components/sections/Amc.astro` (id `maintenance` kept for existing links).
Typography and layout only: no photos or icons. The **AMC eligibility banner**
states the business rule (complete camera systems installed by 8PAHAR only)
and must stay visible at every breakpoint. There is no dedicated AMC plans
page yet: "Explore AMC Plans" opens the AMC answer in the FAQ (`#faq-amc`),
and "Discuss Your AMC" goes to the enquiry form with AMC preselected.
Side-by-side layout above 1400px (compact buttons ≤1660px); stacked below;
single-column services on mobile. The previous `technician` photo is no
longer used on the page.

## Section 11 (approved reference design)

Questions and answers live in `src/content/faq.ts` (exactly six, in the
approved order); the same text feeds the FAQPage structured data. The
component is `src/components/sections/Faq.astro` on a white background. The
accordion uses real buttons (`aria-expanded`, `aria-controls`, labelled answer
regions), keeps one answer open at a time, and opens the matching answer for
deep links (`#faq-audit`, `#faq-amc` are linked from Section 02, Section 10
and the header, so keep those ids). Without JavaScript every answer is shown.
"Talk to Our Team" goes to the enquiry form with "General question" selected.

## Section 12 (Insights & resources)

`src/components/sections/Insights.astro`, placed between the FAQ and the
final enquiry section (which keeps the `#enquiry` form every CTA uses). Six
article links, two columns of three on desktop, one column ≤700px.
**Article titles and URLs are set in `src/content/insights.ts`.** No URLs
have been supplied yet: while a `url` is empty the block renders as a
placeholder (an `<a>` without `href`, not clickable, arrow dimmed). Internal
paths open in the same tab; full `https://` URLs open in a new tab with
`rel="noopener noreferrer"`.

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

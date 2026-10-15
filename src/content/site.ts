/**
 * Landing-page copy. Edit text here without touching layout components.
 *
 * Copy rules: no invented statistics, clients, certifications, response
 * times or guarantees. Capabilities are described as "where supported" and
 * every engagement's scope is agreed per project.
 */
import type { PropertyType, Requirement } from '../lib/lead-schema';

export interface Cta {
  label: string;
  href: string;
  /** Pre-selects a property type in the destination form. */
  property?: PropertyType;
  /** Pre-selects a requirement in the destination form. */
  requirement?: Requirement;
  /** Analytics label for the CTA's position on the page. */
  source: string;
}

/* ---------- Section 01 — Hero (approved reference design) ---------- */
export const hero = {
  eyebrow: 'Intelligent Security Systems',
  audiences: ['Residential', 'Commercial', 'Industrial'],
  titleLines: ['You Don’t Need', 'More Cameras.'],
  titleAccentLines: ['You Need Fewer', 'Blind Spots.'],
  lede: 'A smarter approach to security — from assessment to surveillance, access control and ongoing support.',
  primary: { label: 'Book a Security Audit', href: '#audit', requirement: 'security-audit', source: 'hero' } satisfies Cta,
  primaryNote: 'Get a property-specific assessment',
  secondary: { label: 'Tell Us Your Security Problem', href: '#enquiry', source: 'hero' } satisfies Cta,
  imageAlt: 'Contemporary stone-clad residence at dusk with a landscaped boundary wall, a sliding gate and a ceiling-mounted dome camera above the entrance',
  labels: {
    coverage: { title: 'Live Coverage', detail: 'Main Entrance' },
    gap: { title: 'Potential Blind Spot' },
  },
  strip: [
    { icon: 'eye', title: 'Surveillance Systems', text: 'See what matters.', href: '#service-cctv' },
    { icon: 'lock', title: 'Access Control', text: 'Manage entry points.', href: '#service-access' },
    { icon: 'chart', title: 'Security Assessment', text: 'Find the gaps.', href: '#audit' },
    { icon: 'wrench', title: 'Maintenance & Support', text: 'Keep it performing.', href: '#maintenance' },
  ] as const,
  callout: {
    text: 'See How a Security Audit Helps You Protect What Matters',
    // No video exists yet: the callout links to the on-page explanation of the audit process.
    href: '#how-it-works',
    thumbAlt: '',
  },
};

/* ---------- Section 02 — The problem (approved reference design) ---------- */
export type GapIcon = 'eye' | 'camera' | 'bell' | 'key' | 'power' | 'wrench';

export interface Gap {
  id: string;
  label: string;
  icon: GapIcon;
  /**
   * Callout card position on the diagnostic photograph, as percentages of the
   * 1536×1024 source: [left, top, width, height]. These match the baked
   * connector lines in the image and the boxes removed by
   * scripts/clean-gaps-labels.py — change them together.
   */
  at: [number, number, number, number];
}

export const problems = {
  number: '02',
  eyebrow: 'The problem',
  eyebrowAccent: 'Identify the gaps',
  titleLines: ['Your Property', 'May Be Covered.'],
  titleAccentLines: ['But Is It Actually', 'Secure?'],
  lede: 'Security gaps aren’t always obvious. Poor camera placement, uncontrolled access, system downtime and missed maintenance can leave weaknesses in an otherwise well-equipped property.',
  imageAlt:
    'Illustrative diagram on a contemporary stone, glass and timber residence at dusk: a ceiling-mounted camera’s field of view is shaded green, an uncovered side area is shaded terracotta, and six numbered callouts mark common security gaps.',
  gaps: [
    { id: 'blind-spots', label: 'Blind Spots', icon: 'eye', at: [85.5, 29.69, 13.3, 7.52] },
    { id: 'camera-placement', label: 'Poor Camera Placement', icon: 'camera', at: [62.7, 8.5, 14.0, 8.4] },
    { id: 'missed-events', label: 'Missed Events', icon: 'bell', at: [24.8, 22.36, 14.91, 7.71] },
    { id: 'unmanaged-access', label: 'Unmanaged Access', icon: 'key', at: [20.51, 57.71, 13.09, 7.91] },
    { id: 'system-downtime', label: 'System Downtime', icon: 'power', at: [44.34, 70.41, 13.02, 7.91] },
    { id: 'missed-maintenance', label: 'Missed Maintenance', icon: 'wrench', at: [83.79, 55.76, 13.87, 7.91] },
  ] satisfies Gap[],
  primary: { label: 'Identify My Security Gaps', href: '#audit', requirement: 'security-audit', source: 'problems' } satisfies Cta,
  // The FAQ answer that explains what a security assessment covers (opens the accordion item).
  secondary: { label: 'Explore Our Security Assessment', href: '#faq-audit', source: 'problems' } satisfies Cta,
};

/* ---------- Section 03 — Security health check (approved reference design) ---------- */
export const audit = {
  number: '03',
  eyebrow: 'Security health check',
  title: 'Know Where Your Security Stands.',
  lede: 'Tell us about your property and security needs. We’ll help you understand the next steps towards a more reliable security setup.',
  categories: [
    { icon: 'eye', title: 'Camera coverage', text: 'Visibility, coverage gaps, viewing angles and important areas.' },
    { icon: 'door', title: 'Entry and exit points', text: 'Doors, gates, entrances and other critical access routes.' },
    { icon: 'gear', title: 'Equipment condition', text: 'Existing cameras, recording equipment, connectivity and system health.' },
    { icon: 'key', title: 'Access control', text: 'How access is managed and where improvements may be needed.' },
    { icon: 'bell', title: 'Monitoring and alerts', text: 'Visibility, event alerts and monitoring arrangements, where applicable.' },
    { icon: 'wrench', title: 'Maintenance needs', text: 'Servicing, repairs, upgrades and ongoing support requirements.' },
  ] as const,
  annotation: 'A comprehensive look at what matters.',
  imageAlt:
    'Illustration of a security consultant holding a tablet with a floor plan, looking at a contemporary glass-and-stone residence; circular icons for a camera, key, door, alert bell, visibility and maintenance mark the areas a security assessment reviews.',
  form: {
    title: 'Book Your Security Assessment',
    intro: 'A few details about your property.',
    submit: 'Book My Security Audit',
    privacy: 'Your information is kept confidential and used only to discuss your enquiry.',
  },
};

/* ---------- Section 04 — The 8PAHAR security architecture (approved reference design) ---------- */
export interface Stage {
  name: string;
  text: string;
  /** Label's top-left corner on the illustration, as % of the 1672×941 artwork, beside its icon node. */
  at: [number, number];
  tone: 'green' | 'terracotta';
}

export const methodology = {
  number: '04',
  eyebrow: 'The 8PAHAR security architecture',
  title: { lines: ['Eight Stages.', 'One More Considered'], last: 'Approach to', accent: 'Security.' },
  lede: 'From understanding your property’s risks to maintaining the system over time, our eight-stage framework connects the decisions that make security work together.',
  cta: { label: 'Book a Security Audit', href: '#audit', requirement: 'security-audit', source: 'architecture' } satisfies Cta,
  statement: 'Let’s build a security approach around your property.',
  tagline: ['A connected', 'approach to a', 'safer tomorrow'],
  imageAlt:
    'Illustration of a contemporary villa with landscaped grounds, encircled by a pathway of eight icons — assess, design, deploy, detect, monitor, respond, maintain and protect — representing the stages of the 8PAHAR security framework.',
  // Positions derive from the icon-node centres in the artwork (see README → Section 04).
  stages: [
    { name: 'Assess', text: 'Understand your property, requirements and vulnerabilities.', at: [57.5, 5.7], tone: 'green' },
    { name: 'Design', text: 'Plan the right combination of security components for your property.', at: [81.9, 9.7], tone: 'terracotta' },
    { name: 'Deploy', text: 'Install, configure and integrate the agreed systems.', at: [90.6, 33.0], tone: 'green' },
    { name: 'Detect', text: 'Identify relevant activity using cameras, sensors and analytics.', at: [91.3, 59.4], tone: 'terracotta' },
    { name: 'Monitor', text: 'Enable live viewing, recording review or monitoring arrangements.', at: [72.9, 79.8], tone: 'green' },
    { name: 'Respond', text: 'Define how alerts and events should be reviewed or acted upon.', at: [49.9, 78.3], tone: 'terracotta' },
    { name: 'Maintain', text: 'Support ongoing reliability through servicing and updates.', at: [42.5, 59.9], tone: 'green' },
    { name: 'Protect', text: 'Adapt to changing needs and continuously improve your setup.', at: [42.5, 33.7], tone: 'terracotta' },
  ] satisfies Stage[],
};

/* ---------- Section 05 — Solutions & services (approved reference design) ---------- */
export interface Service {
  /** Anchor id (service-<id>) — linked from the header, footer and hero. */
  id: string;
  icon: 'cctv' | 'eye' | 'door' | 'intercom' | 'wrench' | 'gear';
  title: string;
  tagline: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Reference crop: zoom and focal point (object-position) applied to the photo in its card. */
  crop?: { scale: number; at: string };
  cta: Cta;
}

export const services = {
  number: '05',
  eyebrow: 'Solutions & services',
  title: { lines: ['The Right Security', 'Solutions.', 'Designed Around'], accent: 'Your Property.' },
  lede: 'Explore security systems and services designed to work together—from surveillance and access control to installation, upgrades and ongoing support.',
  tagline: ['Smarter', 'security', 'for safer', 'spaces'],
  bgAlt: '',
  items: [
    {
      id: 'cctv',
      icon: 'cctv',
      title: 'CCTV & IP Surveillance',
      tagline: 'See more of what matters.',
      text: 'Design and installation of surveillance cameras, recording systems and coverage layouts suited to the property.',
      image: 'svc-cctv',
      crop: { scale: 1.45, at: '74% 32%' },
      imageAlt: 'White dome security camera mounted beneath a stone-clad overhang beside a glazed facade',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'cctv', source: 'services' },
    },
    {
      id: 'ai',
      icon: 'eye',
      title: 'Intelligent Surveillance',
      tagline: 'Turn footage into useful awareness.',
      text: 'Compatible surveillance features that help identify relevant activity and provide alerts when supported by the equipment and configuration.',
      image: 'svc-ai',
      crop: { scale: 1.55, at: '20% 38%' },
      imageAlt: 'Monitor showing a multi-camera surveillance view of a building entrance with a person in frame',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'ai-surveillance', source: 'services' },
    },
    {
      id: 'access',
      icon: 'door',
      title: 'Access Control',
      tagline: 'Manage who can enter.',
      text: 'Access management solutions designed for residential entrances, offices, commercial properties and controlled areas.',
      image: 'svc-access',
      crop: { scale: 1.45, at: '82% 40%' },
      imageAlt: 'Keypad and card reader mounted on a stone wall beside a glass entrance door',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'access-control', source: 'services' },
    },
    {
      id: 'vdp',
      icon: 'intercom',
      title: 'Video Door Phones & Intercoms',
      tagline: 'Know who’s at the entrance.',
      text: 'Entry communication solutions that help occupants see or communicate with visitors using compatible devices.',
      // TEMPORARY: cropped from the approved mock-up until the original photo is supplied (see README).
      image: 'svc-vdp-temp',
      imageAlt: 'Wall-mounted video door phone screen showing a visitor at the entrance',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'video-door-phone', source: 'services' },
    },
    {
      id: 'install',
      icon: 'wrench',
      title: 'Installation & System Integration',
      tagline: 'Make the components work together.',
      text: 'Professional deployment and configuration of agreed security equipment, including compatible integrations with existing infrastructure.',
      image: 'svc-install',
      crop: { scale: 1.5, at: '38% 18%' },
      imageAlt: 'Technician fitting a dome camera to a ceiling, with a laptop showing camera feeds and network equipment nearby',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'installation', source: 'services' },
    },
    {
      id: 'amc',
      icon: 'gear',
      title: 'Monitoring, Upgrades & AMC',
      tagline: 'Keep your system ready for changing needs.',
      text: 'Ongoing support for existing security systems, including agreed monitoring arrangements, troubleshooting, upgrades and preventive maintenance.',
      image: 'svc-amc',
      crop: { scale: 1.45, at: '58% 25%' },
      imageAlt: 'Technicians at workstations reviewing camera feeds and system status beside a network equipment rack',
      cta: { label: 'Explore service', href: '#enquiry', requirement: 'amc', source: 'services' },
    },
  ] satisfies Service[],
  band: {
    kicker: ['Not sure what', 'your property', 'needs?'],
    cta: { label: 'Find the Right Solution', href: '#audit', requirement: 'security-audit', source: 'services-band' } satisfies Cta,
    text: 'Tell us about your property and we’ll help you explore the appropriate security solutions.',
  },
};

/* ---------- Section 06 — Industries & properties (approved reference design) ---------- */
export interface Industry {
  /** Anchor id (industry-<id>) — linked from the header and footer menus. */
  id: string;
  /** Category name. */
  label: string;
  icon: 'home' | 'building' | 'factory' | 'campus';
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Pre-selects this property type in the Section 03 form. */
  property: string;
}

export const industries = {
  number: '06',
  eyebrow: 'Industries & properties',
  title: { lines: ['Every Property Has', 'Its Own'], accent: ['Security', 'Needs.'] },
  lede: 'From the place you call home to the spaces where business happens, we help shape security solutions around the property, its people and the way it operates.',
  items: [
    {
      id: 'residential',
      label: 'Residential',
      icon: 'home',
      title: 'Homes & Communities',
      text: 'Security designed around everyday living.',
      image: 'ind-residential',
      imageAlt: 'Contemporary stone and timber residence with a landscaped forecourt at sunset',
      property: 'residential',
    },
    {
      id: 'commercial',
      label: 'Commercial',
      icon: 'building',
      title: 'Business & Retail',
      text: 'Visibility and access across business spaces.',
      image: 'ind-commercial',
      imageAlt: 'Glass-fronted commercial building with a canopied entrance and lit lobby at dusk',
      property: 'commercial',
    },
    {
      id: 'industrial',
      label: 'Industrial',
      icon: 'factory',
      title: 'Factories & Warehouses',
      text: 'Security for operational environments.',
      image: 'ind-industrial',
      imageAlt: 'Large warehouse with loading bays and parked lorries at sunset',
      property: 'industrial',
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: 'campus',
      title: 'Campuses & Facilities',
      text: 'Coordinated security across shared spaces.',
      image: 'ind-institutions',
      imageAlt: 'Multi-storey campus building with landscaped walkways and a drop-off forecourt at sunset',
      property: 'other-institutional',
    },
  ] satisfies Industry[],
  cta: {
    kicker: 'Let’s secure what matters to you.',
    label: 'Discuss Your Property’s Security',
    lines: ['Discuss Your Property’s', 'Security.'],
    href: '#audit',
    source: 'industries',
  },
};

/* ---------- Section 07 — Intelligent surveillance ---------- */
export const intelligence = {
  eyebrow: 'Intelligent surveillance',
  title: 'Go Beyond Recording. Build Better Security Awareness.',
  lede: 'Recording tells you what happened. A well-configured intelligent system can help you notice what is happening. Here is what compatible equipment can add — and why it matters.',
  imageAlt: 'Operator at a desk with several computer monitors in a control room with a large wall of screens',
  flow: [
    { name: 'Cameras', text: 'Capture the agreed views' },
    { name: 'Recorder', text: 'Stores footage securely' },
    { name: 'Analytics', text: 'Compatible rules flag events' },
    { name: 'Alerts', text: 'Notify the right person' },
  ],
  capabilities: [
    { name: 'Compatible AI video analytics', value: 'Rules such as line-crossing or intrusion zones help separate meaningful activity from routine movement.' },
    { name: 'Motion & event detection', value: 'Recordings can be tagged by event, so you find the right clip in minutes instead of scrubbing hours of footage.' },
    { name: 'Configurable alerts', value: 'Notifications for chosen zones and times — for example, the boundary wall after closing hours.' },
    { name: 'Remote viewing', value: 'Check live and recorded footage from your phone or computer, wherever you are.' },
    { name: 'Perimeter monitoring', value: 'Boundary-focused camera positions and rules for earlier awareness at the edge of the property.' },
    { name: 'Access-control integration', value: 'Link door events with camera footage so entries can be reviewed alongside video.' },
    { name: 'Centralised viewing', value: 'View compatible cameras from multiple buildings or branches in one place.' },
  ],
  caveat: 'Availability depends on the cameras, recorder and software proposed for your site. Not every camera supports AI analytics or every integration — we’ll be clear about what your equipment can do before you commit.',
  primary: { label: 'Discuss My Surveillance Requirements', href: '#enquiry', requirement: 'ai-surveillance', source: 'intelligence' } satisfies Cta,
  secondary: { label: 'Book a Security Audit', href: '#audit', requirement: 'security-audit', source: 'intelligence' } satisfies Cta,
  link: { label: 'Explore Intelligent Security', href: '#service-ai', source: 'intelligence' } satisfies Cta,
};

/* ---------- Section 08 — How it works ---------- */
export const howItWorks = {
  eyebrow: 'How it works',
  title: 'From Security Gaps to a Clear Action Plan.',
  steps: [
    { title: 'Tell Us About Your Property', text: 'Share the property type, location and your main concern through the form, a call or WhatsApp.', you: 'A few minutes to describe what’s worrying you.' },
    { title: 'Assess Your Requirements', text: 'We discuss the property and, where needed, visit to review coverage, entry points and any existing equipment.', you: 'Walk us through how the property is used.' },
    { title: 'Receive a Recommended Plan', text: 'You get our recommendations, the proposed scope and a quotation where work or equipment is involved.', you: 'Review, ask questions, and decide — no obligation.' },
    { title: 'Deploy the Agreed Solution', text: 'Our team installs, configures and tests the system according to the agreed scope, then shows you how to use it.', you: 'Confirm access and timings for the work.' },
    { title: 'Maintain and Improve the System', text: 'Optional maintenance, repairs and upgrades keep the system performing as your needs change.', you: 'Choose the level of ongoing support you want.' },
  ],
  note: 'Proposals, installation, monitoring and maintenance are always agreed in writing for your specific project.',
  primary: { label: 'Start My Security Assessment', href: '#audit', requirement: 'security-audit', source: 'process' } satisfies Cta,
  secondary: { label: 'Discuss My Requirements', href: '#enquiry', source: 'process' } satisfies Cta,
  link: { label: 'Contact Our Team', href: '#contact', source: 'process' } satisfies Cta,
};

/* ---------- Section 09 — Why 8PAHAR ---------- */
export const why = {
  eyebrow: 'Why 8PAHAR',
  title: 'Security Decisions Based on Your Property, Not Guesswork.',
  lede: 'Our approach is simple: understand the property first, then recommend only what will make a measurable difference to how it is protected.',
  imageAlt: 'Person drafting technical drawings at a desk with a ruler, pens and printed plans',
  caption: 'Every recommendation starts with the property — its layout, use and existing infrastructure.',
  points: [
    { title: 'Property-specific assessment', text: 'We look at your layout, entry points and daily use before suggesting any equipment.' },
    { title: 'Recommendations based on actual requirements', text: 'Each recommendation is tied to a gap we found — not to a package size.' },
    { title: 'Appropriate equipment selection', text: 'Cameras, recorders and access hardware are chosen for the job each one needs to do.' },
    { title: 'Clear proposals and scope', text: 'You see what is included, what isn’t and why, before any work begins.' },
    { title: 'Respect for existing infrastructure', text: 'Where your current cameras or cabling can be reused, we say so.' },
    { title: 'Installation and integration support', text: 'One team takes the system from plan to a working, tested installation.' },
    { title: 'Maintenance after deployment', text: 'Repair, AMC and upgrade options are available once your system is live.' },
  ],
  primary: { label: 'Discuss My Security Requirements', href: '#enquiry', source: 'why' } satisfies Cta,
  secondary: { label: 'Book a Security Audit', href: '#audit', requirement: 'security-audit', source: 'why' } satisfies Cta,
  link: { label: 'Ask Our Team a Question', href: '#enquiry', requirement: 'question', source: 'why' } satisfies Cta,
};

/* ---------- Section 10 — AMC ---------- */
export const amc = {
  eyebrow: 'Ongoing security & AMC',
  title: 'Security Doesn’t End After Installation.',
  lede: 'Cameras drift, lenses gather dust, drives fill up and firmware ages. Regular care keeps the system you invested in working when you need it.',
  imageAlt: 'Technician in a hard hat and gloves working on wiring inside a wall-mounted electrical panel',
  groups: [
    {
      title: 'Preventive care',
      items: ['Preventive maintenance visits', 'Equipment inspections', 'Camera and recording-system checks', 'Applicable monitoring support'],
    },
    {
      title: 'Fixes & improvements',
      items: ['Fault diagnosis', 'Repair support', 'System upgrades', 'Annual Maintenance Contract (AMC) plans'],
    },
  ],
  note: 'Each AMC agreement sets out its visit frequency, inclusions, exclusions and any response commitments in writing. We don’t promise uptime or response times that haven’t been agreed for your site.',
  primary: { label: 'Request AMC Information', href: '#enquiry', requirement: 'amc', source: 'amc' } satisfies Cta,
  secondary: { label: 'Get Maintenance Support', href: '#enquiry', requirement: 'repair', source: 'amc' } satisfies Cta,
  link: { label: 'Explore Maintenance Plans', href: '#faq-amc', source: 'amc' } satisfies Cta,
};

/* ---------- Section 12 — Final conversion ---------- */
export const finalCta = {
  eyebrow: 'Get started',
  title: 'Let’s Identify Your Security Gaps.',
  lede: 'Tell us about your property and your security concerns. Our team can understand your requirements and help determine the appropriate next step.',
  next: [
    'We review your enquiry.',
    'A team member contacts you on the number you provide.',
    'Together we agree the right next step — an audit, a proposal, or simply advice.',
  ],
  formTitle: 'Tell us about your property',
};

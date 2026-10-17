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

/* ---------- Section 07 — Intelligent surveillance (approved reference design) ---------- */
export const intelligence = {
  number: '07',
  eyebrow: 'Intelligent surveillance',
  title: { line: 'See More Than', accent: 'Just the Footage.' },
  lede: 'Compatible intelligent surveillance can help identify relevant activity, surface selected events and provide alerts—so you can review what matters without relying only on continuous manual viewing.',
  capabilities: [
    { icon: 'run' as const, title: 'Detect Relevant Activity', text: 'Identify supported events such as movement in configured areas or activity in designated zones.' },
    { icon: 'bell', title: 'Receive Relevant Alerts', text: 'Configure notifications for supported events so the right people can review activity when needed.' },
    { icon: 'monitor', title: 'Review From One Place', text: 'Access compatible live feeds, recordings and event information through supported devices or software.' },
  ] as const,
  cta: { label: 'Discuss Your Security Needs', href: '#audit', requirement: 'monitoring-alerts', source: 'intelligence' } satisfies Cta,
  imageAlt:
    'Illustration of a building entrance with a ceiling-mounted dome camera, a detection boundary around a car at a barrier gate, and landscaped planting.',
  /**
   * Example event cards from the approved design — illustrative only, not a live
   * feed. Positions are % of the 1536×1024 illustration: [left, top, width].
   * Thumbnails are TEMPORARY crops from the approved mock-up (see README).
   */
  chip: { icon: 'car' as const, title: 'Vehicle Detected', meta: 'Main Entrance · 10:24 AM', at: [32.3, 56.6, 17.6] },
  events: [
    { icon: 'run' as const, title: 'Person Detected', place: 'Entrance', time: '10:21:36 AM', thumb: 'evt-person', at: [78.6, 31.6, 19.4], active: false },
    { icon: 'car' as const, title: 'Vehicle Detected', place: 'Main Entrance', time: '10:24:10 AM', thumb: 'evt-vehicle', at: [78.6, 44.9, 19.4], active: true },
    { icon: 'box' as const, title: 'Delivery Detected', place: 'Service Gate', time: '10:26:14 AM', thumb: 'evt-delivery', at: [78.6, 58.1, 19.4], active: false },
  ],
};

/* ---------- Section 08 — How it works (approved reference design) ---------- */
export const howItWorks = {
  number: '08',
  eyebrow: 'How it works',
  title: { line: 'A Clear Process.', accent: 'Security Built Around You.' },
  lede: 'From understanding your property’s needs to installation and ongoing support, every step is planned around your requirements and the agreed scope.',
  steps: [
    { art: 'enquiry', title: ['Tell Us About', 'Your Property'], text: 'Share your property type, security concerns and what you want to protect.', icon: 'note', outcome: 'An understanding of your requirements.' },
    { art: 'assess', title: ['Assess Your', 'Security Needs'], text: 'Review the relevant areas, existing equipment and potential coverage or access-control gaps.', icon: 'search', outcome: 'A clearer picture of the property’s needs.' },
    { art: 'plan', title: ['Receive Your', 'Recommended Plan'], text: 'Discuss suitable equipment, system configuration, scope and pricing based on the assessment.', icon: 'note', outcome: 'A proposed solution for your approval.' },
    { art: 'install', title: ['Install, Configure', '& Test'], text: 'Deploy the agreed equipment, configure compatible features and test the system.', icon: 'gear', outcome: 'A system configured to the agreed scope.' },
    { art: 'maintain', title: ['Maintain &', 'Improve'], text: 'Access agreed maintenance, troubleshooting, upgrades and ongoing support as required.', icon: 'chart', outcome: 'A path for continued system support.' },
  ] as const,
  cta: { label: 'Book a Security Audit', href: '#audit', requirement: 'security-audit', source: 'process' } satisfies Cta,
};

/* ---------- Section 09 — The 8PAHAR difference ---------- */
export const why = {
  number: '09',
  eyebrow: 'The 8PAHAR difference',
  title: { line: 'Security That Starts', accent: 'With Understanding.' },
  lede: 'Every property is different. We focus on understanding your security requirements, recommending suitable solutions and helping you maintain a system that works for your needs.',
  points: [
    { title: ['Start With the', 'Real Requirements'], text: 'Understand the property’s layout, priorities and existing security concerns before recommending a setup.' },
    { title: ['Recommendations', 'With a Purpose'], text: 'Choose equipment and features based on the property’s needs, rather than adding unnecessary components.' },
    { title: ['Systems That', 'Work Together'], text: 'Plan compatible surveillance, access control and other security components as a coordinated setup where appropriate.' },
    { title: ['Make Existing', 'Equipment Count'], text: 'Where compatible and suitable, assess whether existing equipment can be retained, upgraded or integrated.' },
    { title: ['Clear Scope', 'and Expectations'], text: 'Understand the proposed equipment, installation scope and pricing before approving the work.' },
    { title: ['Support Beyond', 'Installation'], text: 'Plan for maintenance, troubleshooting and upgrades through the support arrangements agreed for your system.' },
  ] as const,
  cta: { label: 'Discuss Your Security Needs', href: '#audit', requirement: 'security-audit', source: 'difference' } satisfies Cta,
};

/* ---------- Section 10 — Ongoing security care (AMC) ---------- */
export const amc = {
  number: '10',
  eyebrow: 'Ongoing security care',
  title: { lines: ['Your Security', "Doesn't End at"], accent: 'Installation.' },
  lede: 'Keep your security system maintained and ready to perform with ongoing support from 8PAHAR after your complete camera system installation.',
  services: [
    { label: 'Prevent', title: ['Preventive', 'Maintenance'], text: 'Routine system checks to help identify potential faults and performance issues.' },
    { label: 'Restore', title: ['Troubleshooting', '& Repairs'], text: 'Support for diagnosing and resolving system issues, subject to AMC terms.' },
    { label: 'Verify', title: ['System', 'Health Checks'], text: 'Review camera operation, recording and connectivity where applicable.' },
    { label: 'Improve', title: ['Upgrades &', 'Expansion'], text: 'Explore upgrades as your property and security requirements evolve.' },
  ] as const,
  eligibility: {
    label: 'AMC eligibility',
    text: 'Available only for complete camera systems installed by 8PAHAR at the property. Third-party installations and incomplete camera installations are not eligible.',
  },
  // No dedicated AMC plans page exists yet: "Explore" opens the AMC answer in the FAQ,
  // "Discuss" goes to the enquiry form with AMC preselected.
  primary: { label: 'Explore AMC Plans', href: '#faq-amc', source: 'amc' } satisfies Cta,
  secondary: { label: 'Discuss Your AMC', href: '#enquiry', requirement: 'amc', source: 'amc' } satisfies Cta,
};

/* ---------- Section 13 — Book your security audit (enquiry form) ---------- */
export const finalCta = {
  number: '13',
  eyebrow: 'Book your security audit',
  title: { lines: ['Stronger Security', 'Starts With'], accent: 'a Conversation.' },
  lede: ['Tell us about your property and security requirements.', 'Our team will get in touch to discuss the next steps.'],
  benefits: [
    { label: 'Understand', text: 'your security needs' },
    { label: 'Get expert advice', text: 'for your property' },
    { label: 'Plan the right solution', text: 'with our team' },
  ],
  form: {
    submit: 'Request a Security Audit',
    busy: 'Sending…',
    consent: 'By submitting this form, you agree to be contacted by the 8PAHAR team regarding your enquiry.',
    success: 'Thank you for contacting 8PAHAR. Our team will get in touch to discuss your security requirements.',
  },
};

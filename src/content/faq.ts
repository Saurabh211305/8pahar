/**
 * FAQ content. Answers that depend on unconfirmed commercial terms read from
 * the business config, so the page never states pricing, service areas or
 * timelines that haven't been confirmed. The same text feeds the FAQPage
 * structured data, keeping markup identical to visible content.
 */
import { business } from '../config/business';

export interface Faq {
  id: string;
  question: string;
  /** Plain-text paragraphs. */
  answer: string[];
}

function auditPricingAnswer(): string[] {
  const pricing = business.auditPricing;
  if (pricing?.type === 'free') return ['The initial security audit is free of charge. Any recommended equipment or work is quoted separately, and you are under no obligation to proceed.'];
  if (pricing?.type === 'paid') return [pricing.note];
  return [
    'It depends on the property and the scope of the assessment. We’ll confirm whether any fee applies — and exactly what it covers — before the audit is booked, so there are no surprises.',
  ];
}

function locationsAnswer(): string[] {
  if (business.serviceAreas.length > 0) {
    return [
      `We currently serve ${business.serviceAreas.join(', ')}.`,
      'If your property is elsewhere, include the location in your enquiry and we’ll tell you whether we can help.',
    ];
  }
  return ['Please include your city or area in the enquiry form. Our team will confirm whether your property is within our current service area before arranging anything.'];
}

export function getFaqs(): Faq[] {
  return [
    {
      id: 'faq-audit',
      question: 'What is included in a security audit?',
      answer: [
        'A security audit reviews how well your property is protected today. Depending on the property and the agreed scope, it can cover camera placement and coverage, entry and exit points, the perimeter, the condition of existing equipment, recording and storage, access control, monitoring and alerting needs, and maintenance.',
        'Afterwards we share the concerns we identified, our recommended improvements and a proposed next step, with a quotation where work or equipment is recommended.',
      ],
    },
    { id: 'faq-audit-cost', question: 'Is the security audit free or paid?', answer: auditPricingAnswer() },
    {
      id: 'faq-installation',
      question: 'Do you provide CCTV installation for homes and businesses?',
      answer: ['Yes. We plan and install CCTV and IP camera systems for homes, housing societies, offices, retail spaces, warehouses and industrial sites. Each installation is designed around the property rather than a fixed package.'],
    },
    {
      id: 'faq-upgrade',
      question: 'Can you upgrade an existing CCTV system?',
      answer: ['Often, yes. We first check what you already have — cameras, cabling, recorder and storage — and tell you what can be reused and what is limiting the system. Whether an upgrade or a replacement makes more sense depends on the condition and compatibility of the existing equipment.'],
    },
    {
      id: 'faq-cameras',
      question: 'How do I choose the right number and type of cameras?',
      answer: [
        'Start with what each camera needs to achieve: identifying faces at a gate needs a different camera and position from an overview of a car park. The right number depends on the layout, lighting, distances and the areas that matter most to you.',
        'That is exactly what the assessment works out, so you avoid both blind spots and unnecessary cameras.',
      ],
    },
    {
      id: 'faq-remote',
      question: 'Can I access my cameras remotely?',
      answer: ['Most modern systems support remote viewing on a phone or computer, provided the recorder and cameras support it and the site has a suitable internet connection. We set it up and show you how to use it securely.'],
    },
    {
      id: 'faq-ai',
      question: 'What is AI-enabled surveillance?',
      answer: [
        'It refers to cameras or recorders with video analytics that can recognise certain events — for example a person crossing a virtual line or entering a defined zone — and trigger an alert or tag the recording.',
        'Capabilities vary by equipment. Not every camera supports analytics, so we’ll explain what the proposed equipment can and can’t do.',
      ],
    },
    {
      id: 'faq-access',
      question: 'Do you provide access-control and video door phone installation?',
      answer: ['Yes. We install access-control systems for doors and gates, and video door phones for homes, villas and apartment entrances. Where compatible, these can be integrated with your camera system.'],
    },
    {
      id: 'faq-amc',
      question: 'Do you offer CCTV repair and AMC?',
      answer: [
        'Yes. We diagnose and repair faults, and offer Annual Maintenance Contracts that include preventive checks of cameras, recorders and storage.',
        'Each AMC is agreed in writing with its visit frequency, inclusions and exclusions. Tell us about your system in the enquiry form and we’ll share the options that suit it.',
      ],
    },
    { id: 'faq-locations', question: 'Which locations do you currently serve?', answer: locationsAnswer() },
    {
      id: 'faq-timeline',
      question: 'How long does installation take?',
      answer: ['It depends on the size of the property, the number of devices, cabling routes and site access. We’ll give you an estimated timeline in your proposal once the scope is agreed.'],
    },
    {
      id: 'faq-next',
      question: 'What happens after I submit an enquiry?',
      answer: ['A member of our team will contact you on the number you provided to understand your property and concerns. Together we’ll agree the most useful next step — a security audit, a proposal, or simply advice — with no obligation.'],
    },
  ];
}

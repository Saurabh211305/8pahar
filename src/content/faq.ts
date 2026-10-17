/**
 * FAQ content (Section 11). The same text feeds the FAQPage structured data,
 * keeping markup identical to visible content. Ids `faq-audit` and `faq-amc`
 * are linked from other sections and the header, so keep them stable.
 */
export interface Faq {
  id: string;
  question: string;
  /** Plain-text paragraphs. */
  answer: string[];
}

export function getFaqs(): Faq[] {
  return [
    {
      id: 'faq-solutions',
      question: 'What security solutions does 8PAHAR provide?',
      answer: ['8PAHAR provides CCTV and IP surveillance, intelligent surveillance, access control, video door phones and intercoms, system integration, and eligible maintenance services.'],
    },
    {
      id: 'faq-audit',
      question: 'Can you assess my property before installation?',
      answer: ['Contact 8PAHAR to discuss your property, security concerns, entry points, and installation requirements. The assessment scope can be confirmed based on your property and requirements.'],
    },
    {
      id: 'faq-installation',
      question: 'Do you install the complete camera system?',
      answer: ['8PAHAR can plan and install a complete camera system based on your property\'s requirements and the agreed installation scope.'],
    },
    {
      id: 'faq-amc',
      question: 'Who is eligible for an AMC?',
      answer: ['AMC is available only when 8PAHAR has installed the complete camera system at the property. Third-party installations and incomplete camera installations are not eligible.'],
    },
    {
      id: 'faq-upgrade',
      question: 'Can I upgrade my security system later?',
      answer: ['Yes. Compatible upgrades can be discussed based on your existing security setup, property requirements, and future needs.'],
    },
    {
      id: 'faq-consultation',
      question: 'How do I request a consultation or installation?',
      answer: ['Use the contact or enquiry option on the website to share your requirements. The 8PAHAR team can then discuss the appropriate next steps.'],
    },
  ];
}

/**
 * Section 12 — Insights & resources. Six article links, in display order.
 *
 * Set each `url` to the real article address (an internal path such as
 * '/insights/choosing-cctv' or a full https:// URL). While `url` is empty the
 * block renders as plain text, not a link, so no visitor reaches a dead page.
 * Titles are the proposed headlines; replace them with the published titles.
 */
export interface Insight {
  id: string;
  title: string;
  url: string;
}

export const insights: Insight[] = [
  { id: '01', title: 'How to Choose the Right CCTV System for Your Property', url: '' },
  { id: '02', title: '6 Common Security Blind Spots Property Owners Overlook', url: '' },
  { id: '03', title: 'What Is Intelligent Surveillance and How Does It Work?', url: '' },
  { id: '04', title: 'Access Control Systems: A Practical Guide for Businesses', url: '' },
  { id: '05', title: 'Why Regular CCTV Maintenance Matters for Long-Term Reliability', url: '' },
  { id: '06', title: 'How to Build a Smarter Security Plan for Your Property', url: '' },
];

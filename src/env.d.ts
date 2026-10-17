/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_LEAD_ENDPOINT?: string;
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_WHATSAPP?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_BUSINESS_HOURS?: string;
  readonly PUBLIC_EMAIL_NOTE?: string;
  readonly PUBLIC_LOCATION?: string;
  readonly PUBLIC_LOCATION_NOTE?: string;
  readonly PUBLIC_SOCIAL_LINKEDIN?: string;
  readonly PUBLIC_SOCIAL_INSTAGRAM?: string;
  readonly PUBLIC_SOCIAL_YOUTUBE?: string;
  readonly PUBLIC_SOCIAL_FACEBOOK?: string;
  readonly PUBLIC_SOCIAL_X?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_LEAD_ENDPOINT?: string;
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_WHATSAPP?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * External URLs for the app shell footer. Adjust for your deployment and social profiles.
 */

export function shellFooterLocaleSegment(locale: string): string {
  return locale?.split("-")[0]?.trim() || "en";
}

/** Public marketing site with locale path segment (e.g. `/en`, `/es`). */
export function shellFooterWebsiteUrl(locale: string): string {
  return `https://k-lab.ai/${shellFooterLocaleSegment(locale)}`;
}

/** Localized site root (legal / general landing). */
export function shellFooterLegalUrl(locale: string): string {
  return `https://k-lab.ai/${shellFooterLocaleSegment(locale)}/`;
}

/** Localized support contact page. */
export function shellFooterSupportUrl(locale: string): string {
  return `https://k-lab.ai/${shellFooterLocaleSegment(locale)}/contact/support`;
}

export const APP_SHELL_FOOTER_URLS = {
  linkedin: "https://www.linkedin.com/company/k-lab-ai/",
  x: "https://x.com/klab_inc_ai",
  instagram: "https://www.instagram.com/klab.inc.ai/",
  tiktok: "https://www.tiktok.com/@klab.inc.ai",
  youtube: "https://www.youtube.com/@Klab_inc_ai",
} as const;

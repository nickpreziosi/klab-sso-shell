/** True when `href` targets another origin (subdomain-native child app URLs). */
export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Client-side navigation: in-app router for shell paths, full load for child app URLs. */
export function navigateToHref(
  href: string,
  router: { push: (href: string) => void },
): void {
  if (isExternalHref(href)) {
    window.location.assign(href);
    return;
  }
  router.push(href);
}

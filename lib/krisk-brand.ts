export const KRISK_BRAND_COOKIE_NAME = "brand";

export const KRISK_BRAND_IDS = ["krisk", "keo-capital"] as const;

export type KriskBrandId = (typeof KRISK_BRAND_IDS)[number];

export const DEFAULT_KRISK_BRAND: KriskBrandId = "krisk";

/** CSS class applied to `<html>` when a K Risk brand theme is active. */
export const KRISK_BRAND_CSS_CLASS: Record<KriskBrandId, string> = {
  krisk: "",
  "keo-capital": "brand-keo-capital",
};

export const SHELL_KRISK_BRAND_CHANGE_EVENT = "shell:krisk-brand-change";
export const SHELL_RELOAD_IFRAME_EVENT = "shell:reload-iframe";

export function isValidKriskBrand(value: string): value is KriskBrandId {
  return KRISK_BRAND_IDS.includes(value as KriskBrandId);
}

export function readKriskBrandCookie(): KriskBrandId {
  if (typeof document === "undefined") return DEFAULT_KRISK_BRAND;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${KRISK_BRAND_COOKIE_NAME}=([^;]+)`),
  );
  const value = match?.[1];
  if (value && isValidKriskBrand(value)) return value;
  return DEFAULT_KRISK_BRAND;
}

export function setKriskBrandCookie(brandId: KriskBrandId): void {
  if (typeof document === "undefined") return;
  document.cookie = `${KRISK_BRAND_COOKIE_NAME}=${brandId}; path=/; max-age=31536000; samesite=lax`;
}

export function dispatchKriskBrandChange(brandId: KriskBrandId): void {
  window.dispatchEvent(
    new CustomEvent(SHELL_KRISK_BRAND_CHANGE_EVENT, { detail: brandId }),
  );
}

export function requestIframeReload(appId: string): void {
  window.dispatchEvent(new CustomEvent(SHELL_RELOAD_IFRAME_EVENT, { detail: appId }));
}

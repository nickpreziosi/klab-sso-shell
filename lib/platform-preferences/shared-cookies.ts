import {
  PLATFORM_PREFERENCE_MAX_AGE_SEC,
  PLATFORM_SIDEBAR_COLLAPSED_COOKIE,
  PLATFORM_THEME_COOKIE,
  PLATFORM_THEME_STORAGE_KEY,
  type PlatformTheme,
} from "@/lib/platform-preferences/constants";
import { getPlatformPreferenceCookieDomain } from "@/lib/platform-preferences/cookie-domain";

export function setPlatformPreferenceCookie(
  name: string,
  value: string,
  maxAge = PLATFORM_PREFERENCE_MAX_AGE_SEC,
): void {
  if (typeof document === "undefined") return;
  const domain = getPlatformPreferenceCookieDomain();
  const encoded = encodeURIComponent(value);
  // Drop legacy host-only cookies so reads don't pick a stale per-subdomain value.
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${name}=${encoded}; Domain=${domain}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function readPlatformPreferenceCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split(";");
  let last: string | null = null;
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      last = decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return last;
}

export function resolvePlatformSidebarCollapsedFromCookie(
  value: string | undefined,
): boolean {
  return value === "true";
}

export function persistPlatformSidebarCollapsed(collapsed: boolean): void {
  setPlatformPreferenceCookie(
    PLATFORM_SIDEBAR_COLLAPSED_COOKIE,
    collapsed ? "true" : "false",
  );
}

export function isValidPlatformTheme(value: string | null | undefined): value is PlatformTheme {
  return value === "light" || value === "dark" || value === "system";
}

export function persistPlatformTheme(theme: PlatformTheme): void {
  setPlatformPreferenceCookie(PLATFORM_THEME_COOKIE, theme);
  try {
    window.localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

export function readStoredPlatformTheme(): PlatformTheme {
  const fromCookie = readPlatformPreferenceCookie(PLATFORM_THEME_COOKIE);
  if (isValidPlatformTheme(fromCookie)) {
    try {
      window.localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, fromCookie);
    } catch {
      // ignore
    }
    return fromCookie;
  }

  try {
    const stored = window.localStorage.getItem(PLATFORM_THEME_STORAGE_KEY);
    if (isValidPlatformTheme(stored)) return stored;
  } catch {
    // ignore
  }

  return "system";
}

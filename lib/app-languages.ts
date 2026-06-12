/** Synced with `localStorage` and shared cookie (`klab-language`) for next-intl / server (`cookies()`). */
import {
  PLATFORM_LANGUAGE_COOKIE,
  PLATFORM_LANGUAGE_STORAGE_KEY,
} from "@/lib/platform-preferences/constants";
import { setPlatformPreferenceCookie, readPlatformPreferenceCookie } from "@/lib/platform-preferences/shared-cookies";

export const APP_LANGUAGE_COOKIE = PLATFORM_LANGUAGE_COOKIE;
export const APP_LANGUAGE_STORAGE_KEY = PLATFORM_LANGUAGE_STORAGE_KEY;

export const APP_LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "🇺🇸", aliases: [] as const },
  { code: "es", label: "Español", flag: "🇪🇸", aliases: ["Spanish"] as const },
  { code: "ar", label: "العربية", flag: "🇸🇦", aliases: ["Arabic"] as const },
  { code: "pt", label: "Português", flag: "🇧🇷", aliases: ["Portuguese"] as const },
] as const;

export type AppLanguageCode = (typeof APP_LANGUAGE_OPTIONS)[number]["code"];

export const RTL_LANGUAGE_CODES = new Set<string>(["ar"]);

export function getDirForAppLanguage(language: string): "rtl" | "ltr" {
  return RTL_LANGUAGE_CODES.has(language) ? "rtl" : "ltr";
}

const VALID_LANG = new Set<string>(APP_LANGUAGE_OPTIONS.map((l) => l.code));

export function resolveAppLocaleFromCookieValue(value: string | undefined): AppLanguageCode {
  if (value && VALID_LANG.has(value)) {
    return value as AppLanguageCode;
  }
  return "en";
}

function readAppLanguageCookie(): AppLanguageCode | null {
  const decoded = readPlatformPreferenceCookie(APP_LANGUAGE_COOKIE);
  if (!decoded || !VALID_LANG.has(decoded)) return null;
  return decoded as AppLanguageCode;
}

export function getStoredAppLanguage(): AppLanguageCode {
  if (typeof window === "undefined") return "en";

  const fromCookie = readAppLanguageCookie();
  if (fromCookie) {
    try {
      window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, fromCookie);
    } catch {
      // ignore
    }
    return fromCookie;
  }

  const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
  if (stored && APP_LANGUAGE_OPTIONS.some((l) => l.code === stored)) {
    return stored as AppLanguageCode;
  }

  const raw = window.navigator.language?.toLowerCase() ?? "";
  const primary = raw.slice(0, 2);
  const match = APP_LANGUAGE_OPTIONS.find((l) => l.code === primary);
  return match?.code ?? "en";
}

export function persistAppLanguage(language: AppLanguageCode): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const nextDir = getDirForAppLanguage(language);
  const prevDir = root.getAttribute("dir");
  const prevLang = root.getAttribute("lang") ?? "";
  const shouldDisableTransitions = prevDir !== nextDir || prevLang !== language;

  window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  setPlatformPreferenceCookie(APP_LANGUAGE_COOKIE, language);

  if (shouldDisableTransitions) {
    root.classList.add("no-transitions");
  }

  try {
    root.lang = language;
    root.setAttribute("dir", nextDir);
  } catch {
    // ignore
  }

  if (shouldDisableTransitions) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("no-transitions");
      });
    });
  }
}

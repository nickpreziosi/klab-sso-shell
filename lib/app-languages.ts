/** Synced with `localStorage` and cookie (`klab-language`) for next-intl / server (`cookies()`). */
export const APP_LANGUAGE_COOKIE = "klab-language";
export const APP_LANGUAGE_STORAGE_KEY = APP_LANGUAGE_COOKIE;

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

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
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${APP_LANGUAGE_COOKIE}=([^;]*)`),
  );
  const raw = match?.[1];
  if (!raw) return null;
  const decoded = decodeURIComponent(raw);
  if (!VALID_LANG.has(decoded)) return null;
  return decoded as AppLanguageCode;
}

export function getStoredAppLanguage(): AppLanguageCode {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
  if (stored && APP_LANGUAGE_OPTIONS.some((l) => l.code === stored)) {
    return stored as AppLanguageCode;
  }

  const fromCookie = readAppLanguageCookie();
  if (fromCookie) return fromCookie;

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
  try {
    document.cookie = `${APP_LANGUAGE_COOKIE}=${encodeURIComponent(language)};path=/;max-age=${COOKIE_MAX_AGE_SEC};SameSite=Lax`;
  } catch {
    // ignore
  }

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

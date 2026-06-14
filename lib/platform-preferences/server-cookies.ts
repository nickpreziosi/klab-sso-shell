import {
  PLATFORM_LANGUAGE_COOKIE,
  PLATFORM_THEME_COOKIE,
  type PlatformTheme,
} from "@/lib/platform-preferences/constants";
import { isValidPlatformTheme } from "@/lib/platform-preferences/shared-cookies";

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
  getAll: (name: string) => Array<{ value: string }>;
};

function readLastCookieValue(store: CookieReader, name: string): string | undefined {
  const all = store.getAll(name);
  if (all.length > 0) {
    return all[all.length - 1]?.value;
  }
  return store.get(name)?.value;
}

/** Prefer the last matching value when host-only and domain cookies both exist. */
export function readPlatformLanguageCookieFromStore(store: CookieReader): string | undefined {
  return readLastCookieValue(store, PLATFORM_LANGUAGE_COOKIE);
}

export function readPlatformThemeCookieFromStore(store: CookieReader): PlatformTheme {
  const value = readLastCookieValue(store, PLATFORM_THEME_COOKIE);
  return isValidPlatformTheme(value) ? value : "system";
}

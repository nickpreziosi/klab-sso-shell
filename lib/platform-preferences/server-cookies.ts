import { PLATFORM_LANGUAGE_COOKIE } from "@/lib/platform-preferences/constants";

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
  getAll: (name: string) => Array<{ value: string }>;
};

/** Prefer the last matching value when host-only and domain cookies both exist. */
export function readPlatformLanguageCookieFromStore(store: CookieReader): string | undefined {
  const all = store.getAll(PLATFORM_LANGUAGE_COOKIE);
  if (all.length > 0) {
    return all[all.length - 1]?.value;
  }
  return store.get(PLATFORM_LANGUAGE_COOKIE)?.value;
}

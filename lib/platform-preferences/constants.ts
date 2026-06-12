/** Shared across *.lvh.me / *.k-lab.ai — resolved before first paint via blocking init script. */
export const PLATFORM_LANGUAGE_COOKIE = "klab-language";
export const PLATFORM_LANGUAGE_STORAGE_KEY = PLATFORM_LANGUAGE_COOKIE;

export const PLATFORM_THEME_COOKIE = "k-lab-components-theme";
export const PLATFORM_THEME_STORAGE_KEY = PLATFORM_THEME_COOKIE;

export const PLATFORM_SIDEBAR_COLLAPSED_COOKIE = "k-lab-sidebar-collapsed";

export const PLATFORM_PREFERENCE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export const PLATFORM_THEME_VALUES = ["light", "dark", "system"] as const;
export type PlatformTheme = (typeof PLATFORM_THEME_VALUES)[number];

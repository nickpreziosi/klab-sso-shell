/** httpOnly cookie: signals "likely logged in" for middleware / SSR shell (presence only). */
export const PRESENCE_COOKIE_NAME = "KLabShellPresence";

/** Seconds. Refreshed on each successful session POST. */
export const PRESENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 5;

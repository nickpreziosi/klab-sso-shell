/** Shared across shell + child apps (keep in sync). */

export const PLATFORM_PRESENCE_COOKIE = "KLabPlatformPresence";

/** Firebase ID token shared across platform subdomains (set by shell on login). */
export const PLATFORM_TOKEN_COOKIE = "KLabPlatformToken";

/** Shell host-only presence during migration; prefer PLATFORM_PRESENCE_COOKIE. */
export const SHELL_PRESENCE_COOKIE = "KLabShellPresence";

/** Post-login destination (set by child middleware before redirecting to shell login). */
export const PLATFORM_RETURN_TO_COOKIE = "KLabReturnTo";

/** Set by child apps on logout so shell clears its session (not a return destination). */
export const PLATFORM_LOGOUT_PENDING_COOKIE = "KLabLogoutPending";

/** Seconds. Short-lived: only needs to survive the login round-trip. */
export const PLATFORM_RETURN_TO_MAX_AGE = 60 * 5;

/** Seconds. Short-lived: child logout → shell login handoff. */
export const PLATFORM_LOGOUT_PENDING_MAX_AGE = 60;

/** Seconds. Refreshed on each successful session POST. */
export const PLATFORM_SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export const HANDOFF_CODE_TTL_MS = 60_000;

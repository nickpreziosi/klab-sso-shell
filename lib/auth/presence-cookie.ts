import {
  PLATFORM_PRESENCE_COOKIE,
  PLATFORM_SESSION_MAX_AGE,
  SHELL_PRESENCE_COOKIE,
} from "@/lib/platform-auth/constants";

/** httpOnly cookie: signals "likely logged in" for middleware / SSR shell (presence only). */
export const PRESENCE_COOKIE_NAME = SHELL_PRESENCE_COOKIE;

export { PLATFORM_PRESENCE_COOKIE, PLATFORM_SESSION_MAX_AGE };

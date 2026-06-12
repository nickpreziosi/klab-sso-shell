import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { PLATFORM_SESSION_MAX_AGE } from "@/lib/platform-auth/constants";

export function getCookieDomain(): string | undefined {
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (domain) return domain;
  // Dev default: lvh.me (see config/platform/dev-hosts.ts for why not *.localhost).
  if (process.env.NODE_ENV === "development") return ".lvh.me";
  return undefined;
}

function baseCookieOptions(maxAge: number): Partial<ResponseCookie> {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    secure,
  };
}

/** Shared across *.localhost / *.k-lab.ai (child apps read this). */
export function platformPresenceCookieOptions(maxAge: number): Partial<ResponseCookie> {
  const domain = getCookieDomain();
  return {
    ...baseCookieOptions(maxAge),
    ...(domain ? { domain } : {}),
  };
}

/** Host-only fallback so shell middleware works even when Domain cookies are rejected. */
export function hostOnlyPresenceCookieOptions(maxAge: number): Partial<ResponseCookie> {
  return baseCookieOptions(maxAge);
}

export function setPlatformPresenceCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "1", platformPresenceCookieOptions(PLATFORM_SESSION_MAX_AGE));
}

export function setHostOnlyPresenceCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "1", hostOnlyPresenceCookieOptions(PLATFORM_SESSION_MAX_AGE));
}

export function clearPlatformPresenceCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "", platformPresenceCookieOptions(0));
}

export function clearHostOnlyPresenceCookie(
  res: { cookies: { set: (name: string, value: string, options: Partial<ResponseCookie>) => void } },
  cookieName: string,
): void {
  res.cookies.set(cookieName, "", hostOnlyPresenceCookieOptions(0));
}

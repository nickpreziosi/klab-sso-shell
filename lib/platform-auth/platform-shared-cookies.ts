"use client";

import {
  PLATFORM_LOGOUT_PENDING_COOKIE,
  PLATFORM_PRESENCE_COOKIE,
  PLATFORM_RETURN_TO_COOKIE,
  PLATFORM_SESSION_MAX_AGE,
  PLATFORM_TOKEN_COOKIE,
} from "@/lib/platform-auth/constants";

export function getSharedCookieDomain(): string {
  const fromEnv = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return ".lvh.me";
  return ".k-lab.ai";
}

function setSharedCookie(name: string, value: string, maxAge: number): void {
  const domain = getSharedCookieDomain();
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; Domain=${domain}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearSharedCookie(name: string): void {
  const domain = getSharedCookieDomain();
  document.cookie = `${name}=; Domain=${domain}; Path=/; Max-Age=0; SameSite=Lax`;
}

export function syncPlatformPresenceCookie(): void {
  setSharedCookie(PLATFORM_PRESENCE_COOKIE, "1", PLATFORM_SESSION_MAX_AGE);
}

export function syncPlatformTokenCookie(idToken: string): void {
  setSharedCookie(PLATFORM_TOKEN_COOKIE, idToken, 60 * 60);
}

// Clears shared session cookies on sign-out; does not touch return-to (handled on login page).
export function clearSharedPlatformCookies(): void {
  clearSharedCookie(PLATFORM_PRESENCE_COOKIE);
  clearSharedCookie(PLATFORM_TOKEN_COOKIE);
}

export function clearPlatformReturnToCookie(): void {
  if (typeof document === "undefined") return;
  clearSharedCookie(PLATFORM_RETURN_TO_COOKIE);
}

export function readLogoutPendingCookie(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|; )KLabLogoutPending=1(?:;|$)/.test(document.cookie);
}

export function clearLogoutPendingCookie(): void {
  if (typeof document === "undefined") return;
  clearSharedCookie(PLATFORM_LOGOUT_PENDING_COOKIE);
}

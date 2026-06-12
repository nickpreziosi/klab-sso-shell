import { CHILD_APPS } from "@/config/apps/registry";
import { getPlatformDevOrigin, getShellDevOrigin } from "@/config/platform/dev-hosts";
import { getShellOrigin } from "@/lib/platform-auth/deployment-profile";

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  origins.add(getShellOrigin());
  if (process.env.NODE_ENV === "development") {
    origins.add(getShellDevOrigin());
  }
  for (const app of CHILD_APPS) {
    const base = app.prodUrl?.replace(/\/$/, "");
    if (base) {
      try {
        origins.add(new URL(base).origin);
      } catch {
        // ignore invalid prodUrl
      }
    }
    if (process.env.NODE_ENV === "development" && app.devPort != null) {
      origins.add(getPlatformDevOrigin(app.id, app.devPort));
    }
  }
  return origins;
}

/** Same-origin absolute URLs → relative paths for Next.js router navigation. */
export function toClientNavigationTarget(
  returnTo: string,
  currentOrigin = typeof window !== "undefined" ? window.location.origin : getShellOrigin(),
): string {
  const safe = safeReturnTo(returnTo, "/");
  try {
    const url = new URL(safe);
    if (url.origin === currentOrigin) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
    return url.toString();
  } catch {
    return safe;
  }
}

/** Avoid open redirects: shell-internal paths or allowlisted child origins. */
export function safeReturnTo(raw: string | null | undefined, fallback = "/"): string {
  if (!raw?.trim()) return fallback;

  const value = raw.trim();

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (getAllowedOrigins().has(url.origin)) {
      return url.toString();
    }
  } catch {
    // not a valid URL
  }

  return fallback;
}

export function isAllowedReturnToUrl(raw: string): boolean {
  return safeReturnTo(raw, "") !== "" && safeReturnTo(raw) === raw.trim();
}

/** Parse returnTo and return child origin for handoff redirect. */
export function childOriginFromReturnTo(returnTo: string): string | null {
  try {
    const url = new URL(returnTo);
    if (!getAllowedOrigins().has(url.origin)) return null;
    if (url.origin === getShellOrigin()) return null;
    return url.origin;
  } catch {
    return null;
  }
}

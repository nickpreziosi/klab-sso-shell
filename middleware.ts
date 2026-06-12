import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PLATFORM_PRESENCE_COOKIE,
  PRESENCE_COOKIE_NAME,
} from "@/lib/auth/presence-cookie";
import { isAuthApiPath, isPublicPath } from "@/lib/auth/public-routes";
import { PROXIED_APPS } from "@/config/apps/proxy-config";

function hasPlatformPresence(request: NextRequest): boolean {
  return (
    request.cookies.get(PLATFORM_PRESENCE_COOKIE)?.value === "1" ||
    request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/scripts/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Dev proxy embeds: same-origin iframes must not bounce to /login (the parent shell already gates auth).
  for (const { proxyPrefix } of PROXIED_APPS) {
    if (pathname === proxyPrefix || pathname.startsWith(`${proxyPrefix}/`)) {
      return NextResponse.next();
    }
  }

  if (isAuthApiPath(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasPlatformPresence(request)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

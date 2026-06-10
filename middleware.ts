import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { isAuthApiPath, isPublicPath } from "@/lib/auth/public-routes";
import { ZONE_APPS } from "@/config/apps/zones";

/** Build/runtime assets of child zones (served via multi-zone rewrites). */
function isZoneAssetPath(pathname: string): boolean {
  return ZONE_APPS.some((zone) => pathname.startsWith(`/${zone.slug}/_next/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    isZoneAssetPath(pathname) ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|js|mjs|css|map|json|txt|webmanifest)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isAuthApiPath(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const hasPresence = request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1";
  if (!hasPresence) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

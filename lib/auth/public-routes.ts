const PUBLIC_PATHS = new Set<string>(["/login", "/forgot-password", "/reset-password"]);

export function isPublicPath(pathname: string): boolean {
  const p = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return PUBLIC_PATHS.has(p);
}

export function isAuthApiPath(pathname: string): boolean {
  return pathname === "/api/auth/session" || pathname.startsWith("/api/auth/session/");
}

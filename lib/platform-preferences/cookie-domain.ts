/** Parent domain for cross-subdomain preference cookies (mirrors platform auth). */
export function getPlatformPreferenceCookieDomain(): string {
  const fromEnv = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return ".lvh.me";
  return ".k-lab.ai";
}

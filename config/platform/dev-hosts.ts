/**
 * Local dev hostnames (subdomain-native).
 *
 * Why lvh.me and not *.localhost: `localhost` is a single-label domain, so
 * browsers treat it as an effective TLD and reject `Domain=localhost` cookies
 * (same rule that blocks `Domain=com`). Cross-subdomain SSO cookies therefore
 * can NOT be shared across *.localhost. `lvh.me` is public wildcard DNS that
 * resolves to 127.0.0.1 and is not a public suffix, so `Domain=.lvh.me`
 * cookies are shared across all app subdomains — no /etc/hosts setup needed.
 * (`.dev` is not an option: the whole TLD is HSTS-preloaded, browsers force
 * HTTPS and our dev servers are HTTP-only.)
 */

export const PLATFORM_DEV_BASE_DOMAIN = "lvh.me";

export const PLATFORM_SHELL_DEV_HOST = `app.${PLATFORM_DEV_BASE_DOMAIN}`;
export const PLATFORM_SHELL_DEV_PORT = 3000;

const APP_DEV_HOSTS: Record<string, string> = {
  krisk: `krisk.${PLATFORM_DEV_BASE_DOMAIN}`,
  kbpm: `kbpm.${PLATFORM_DEV_BASE_DOMAIN}`,
  kleads: `kleads.${PLATFORM_DEV_BASE_DOMAIN}`,
};

export function getPlatformDevHost(appId: string): string {
  return APP_DEV_HOSTS[appId] ?? `${appId}.${PLATFORM_DEV_BASE_DOMAIN}`;
}

export function getPlatformDevOrigin(appId: string, port: number): string {
  return `http://${getPlatformDevHost(appId)}:${port}`;
}

export function getShellDevOrigin(port = PLATFORM_SHELL_DEV_PORT): string {
  return `http://${PLATFORM_SHELL_DEV_HOST}:${port}`;
}

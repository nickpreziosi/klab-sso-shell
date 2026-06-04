import type { ShellAppConfig } from "@/config/apps/registry";
import { getProxiedApp } from "@/config/apps/proxy-config";

/**
 * Maps a shell pathname (`/{slug}/...`) to the same-origin proxy prefix
 * (`/{slug}-proxy/...`) that Next.js rewrites to the standalone dev server.
 */
export function shellPathToProxyPath(pathname: string, app: ShellAppConfig): string {
  const proxyConfig = getProxiedApp(app.id);
  if (!proxyConfig) return "/";
  const shellPrefix = `/${app.slug}`;
  const { proxyPrefix } = proxyConfig;
  if (pathname === shellPrefix || pathname === `${shellPrefix}/`) return proxyPrefix;
  if (pathname.startsWith(`${shellPrefix}/`)) {
    return `${proxyPrefix}${pathname.slice(shellPrefix.length)}`;
  }
  return proxyPrefix;
}

/** Builds the iframe `src` for a proxied app given the current shell pathname. */
export function proxyIframeSrc(pathname: string, app: ShellAppConfig): string {
  const proxyPath = shellPathToProxyPath(pathname, app);
  const url = new URL(proxyPath, "http://placeholder");
  url.searchParams.set("shell", "1");
  return `${url.pathname}${url.search}`;
}

/**
 * Inverse of `shellPathToProxyPath`.
 * Converts an app-relative path (as reported via postMessage) back to a
 * shell-rooted URL so the shell router can be kept in sync.
 *
 * "/buyers/123" → "/kbpm/buyers/123"
 * "/"           → "/kbpm"
 */
export function proxyPathToShellPath(appRelativePath: string, app: ShellAppConfig): string {
  const normalized = appRelativePath.startsWith("/") ? appRelativePath : `/${appRelativePath}`;
  return normalized === "/" ? `/${app.slug}` : `/${app.slug}${normalized}`;
}

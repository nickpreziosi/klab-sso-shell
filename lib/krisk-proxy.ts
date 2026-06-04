import type { ShellAppConfig } from "@/config/apps/registry";
import { getProxiedApp } from "@/config/apps/proxy-config";

const _krisk = getProxiedApp("krisk")!;

/** Same-origin prefix that Next rewrites to the standalone ux-krisk dev server. */
export const KRISK_PROXY_PREFIX = _krisk.proxyPrefix;

export function isProxiedMount(app: ShellAppConfig): boolean {
  return app.mount?.type === "proxy";
}

/** Maps shell routes (`/krisk/...`) to the rewrite prefix (`/krisk-proxy/...`). */
export function shellPathToKriskProxyPath(pathname: string): string {
  const shellPrefix = "/krisk";
  if (pathname === shellPrefix || pathname === `${shellPrefix}/`) {
    return KRISK_PROXY_PREFIX;
  }
  if (pathname.startsWith(`${shellPrefix}/`)) {
    return `${KRISK_PROXY_PREFIX}${pathname.slice(shellPrefix.length)}`;
  }
  return KRISK_PROXY_PREFIX;
}

export function kriskProxyIframeSrc(pathname: string): string {
  const proxyPath = shellPathToKriskProxyPath(pathname);
  const url = new URL(proxyPath, "http://placeholder");
  url.searchParams.set("shell", "1");
  return `${url.pathname}${url.search}`;
}

/**
 * Inverse of `shellPathToKriskProxyPath`.
 * Maps an app-relative path (as reported by the embedded app) to the
 * shell-rooted URL so the shell's router can be kept in sync.
 *
 * "/financial-summary/groups/edit" → "/krisk/financial-summary/groups/edit"
 * "/"                              → "/krisk"
 */
export function kriskProxyPathToShellPath(appRelativePath: string): string {
  const normalized = appRelativePath.startsWith("/") ? appRelativePath : `/${appRelativePath}`;
  return normalized === "/" ? "/krisk" : `/krisk${normalized}`;
}

import type { ShellAppConfig } from "@/config/apps/registry";

/** Same-origin prefix that Next rewrites to the standalone ux-krisk dev server. */
export const KRISK_PROXY_PREFIX = "/krisk-proxy";

export function isKriskProxyConfigured(): boolean {
  return Boolean(process.env.KRISK_DEV_ORIGIN?.trim());
}

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

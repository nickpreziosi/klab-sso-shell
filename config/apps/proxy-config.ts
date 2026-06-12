import { getPlatformDevOrigin } from "../platform/dev-hosts";

/**
 * Lightweight proxy configuration — no React or Lucide imports.
 * Safe to import from next.config.ts at build time.
 *
 * To add a new proxied app:
 *   1. Add an entry to PROXIED_APPS with its devPort and proxyPrefix.
 *   2. Register the full app in config/apps/registry.ts.
 *   No env-var changes needed.
 */

export type ProxiedAppConfig = {
  /** Matches ShellAppId. */
  appId: string;
  /** URL slug (same as registry slug). */
  slug: string;
  /** Port the standalone dev server listens on. */
  devPort: number;
  /**
   * Same-origin prefix Next.js rewrites to the dev server.
   * Convention: /{slug}-proxy
   */
  proxyPrefix: string;
};

export const PROXIED_APPS: ProxiedAppConfig[] = [
  {
    appId: "krisk",
    slug: "krisk",
    devPort: 3001,
    proxyPrefix: "/krisk-proxy",
  },
  {
    appId: "kbpm",
    slug: "kbpm",
    devPort: 3002,
    proxyPrefix: "/kbpm-proxy",
  },
  {
    appId: "kleads",
    slug: "kleads",
    devPort: 3003,
    proxyPrefix: "/kleads-proxy",
  },
];

export function getProxiedApp(appId: string): ProxiedAppConfig | undefined {
  return PROXIED_APPS.find((p) => p.appId === appId);
}

/** Base URL of a proxied app's local dev server (legacy iframe proxy rewrites). */
export function getDevOrigin(appId: string, devPort: number): string {
  return getPlatformDevOrigin(appId, devPort);
}

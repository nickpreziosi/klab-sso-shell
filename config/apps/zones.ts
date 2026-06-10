/**
 * Multi-zone configuration — no React or Lucide imports.
 * Safe to import from next.config.ts at build time.
 *
 * Each child app is an independent Next.js deployment ("zone") that serves its
 * pages under a basePath equal to `/{slug}`. The shell routes `/{slug}/*` to the
 * zone's origin via rewrites (see next.config.ts), so every app is served from
 * the single shell origin in both dev and prod.
 *
 * Reference: https://nextjs.org/docs/pages/guides/multi-zones
 *
 * To add a new zone:
 *   1. Add an entry to ZONE_APPS with its slug, devPort and origin env var.
 *   2. Register the full app in config/apps/registry.ts.
 *   3. Configure the child app with NEXT_PUBLIC_BASE_PATH=/{slug}.
 */

export type ZoneAppConfig = {
  /** Matches ShellAppId. */
  appId: string;
  /** URL slug — also the child app's basePath (`/{slug}`). */
  slug: string;
  /** Port the standalone dev server listens on. */
  devPort: number;
  /**
   * Env var holding the zone's origin (scheme + host). Set in production to the
   * deployed URL (e.g. https://krisk.klab.com). Falls back to the local dev port.
   */
  originEnvVar: string;
};

export const ZONE_APPS: ZoneAppConfig[] = [
  {
    appId: "krisk",
    slug: "krisk",
    devPort: 3001,
    originEnvVar: "KRISK_ZONE_ORIGIN",
  },
  {
    appId: "kbpm",
    slug: "kbpm",
    devPort: 3002,
    originEnvVar: "KBPM_ZONE_ORIGIN",
  },
  {
    appId: "kleads",
    slug: "kleads",
    devPort: 3003,
    originEnvVar: "KLEADS_ZONE_ORIGIN",
  },
];

export function getZoneApp(appId: string): ZoneAppConfig | undefined {
  return ZONE_APPS.find((z) => z.appId === appId);
}

/**
 * Resolved origin for a zone. Prefers the env var (production / overrides),
 * falling back to the local dev server.
 */
export function getZoneOrigin(zone: ZoneAppConfig): string {
  const fromEnv = process.env[zone.originEnvVar];
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return `http://127.0.0.1:${zone.devPort}`;
}

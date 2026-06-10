import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { ZONE_APPS, getZoneOrigin } from "./config/apps/zones";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  experimental: {
    // Zone rewrites proxy to the child apps. The default proxy timeout is 30s,
    // which dev cold-compiles in the children regularly exceed ("socket hang
    // up" / ECONNRESET → 500). Keep prod at a sane 60s.
    proxyTimeout: process.env.NODE_ENV === "development" ? 600_000 : 60_000,
  },
  async rewrites() {
    // Multi-zones: route each child app's path prefix to its own deployment.
    // Children run with basePath=/{slug}, so their pages, API routes and
    // static assets (/{slug}/_next/*) all fall under /{slug}/:path*.
    const rules = ZONE_APPS.flatMap((zone) => {
      const origin = getZoneOrigin(zone);
      return [
        {
          source: `/${zone.slug}`,
          destination: `${origin}/${zone.slug}`,
        },
        {
          source: `/${zone.slug}/:path*`,
          destination: `${origin}/${zone.slug}/:path*`,
        },
      ];
    });
    return { beforeFiles: rules };
  },
};

export default withNextIntl(nextConfig);

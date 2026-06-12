import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { PROXIED_APPS, getDevOrigin } from "./config/apps/proxy-config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Dev server binds 127.0.0.1 but is accessed via app.lvh.me (cross-subdomain SSO).
  allowedDevOrigins: ["app.lvh.me", "*.lvh.me"],
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    if (process.env.NEXT_PUBLIC_PLATFORM_LAYOUT !== "iframe-embed") return [];
    return PROXIED_APPS.flatMap(({ appId, proxyPrefix, devPort }) => {
      const devOrigin = getDevOrigin(appId, devPort);
      return [
        {
          source: proxyPrefix,
          destination: `${devOrigin}${proxyPrefix}`,
        },
        {
          source: `${proxyPrefix}/:path*`,
          destination: `${devOrigin}${proxyPrefix}/:path*`,
        },
      ];
    });
  },
};

export default withNextIntl(nextConfig);

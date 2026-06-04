import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { PROXIED_APPS, getDevOrigin } from "./config/apps/proxy-config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return PROXIED_APPS.flatMap(({ proxyPrefix, devPort }) => {
      const devOrigin = getDevOrigin(devPort);
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

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { KRISK_PROXY_PREFIX } from "./lib/krisk-proxy";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const kriskDevOrigin = process.env.KRISK_DEV_ORIGIN?.trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_KRISK_PROXY_ENABLED: kriskDevOrigin ? "1" : "",
  },
  async rewrites() {
    if (!kriskDevOrigin) return [];
    return [
      {
        source: "/krisk-proxy",
        destination: `${kriskDevOrigin}${KRISK_PROXY_PREFIX}`,
      },
      {
        source: "/krisk-proxy/:path*",
        destination: `${kriskDevOrigin}${KRISK_PROXY_PREFIX}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

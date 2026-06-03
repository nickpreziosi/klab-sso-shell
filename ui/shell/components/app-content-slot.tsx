"use client";

import * as React from "react";
import type { ShellAppConfig } from "@/config/apps/registry";
import { isProxiedMount } from "@/lib/krisk-proxy";
import { KriskProxyEmbed } from "@/ui/shell/components/krisk-proxy-embed";
import { KriskProxyUnavailable } from "@/ui/shell/components/krisk-proxy-unavailable";

interface AppContentSlotProps {
  app: ShellAppConfig;
  children: React.ReactNode;
}

const kriskProxyEnabled = process.env.NEXT_PUBLIC_KRISK_PROXY_ENABLED === "1";

/**
 * The single seam where app content is rendered into the shell.
 *
 * For apps with `mount.type === "proxy"`, embeds the standalone dev app via a
 * same-origin iframe (`/krisk-proxy/*` → `KRISK_DEV_ORIGIN`).
 */
export function AppContentSlot({ app, children }: AppContentSlotProps) {
  if (isProxiedMount(app)) {
    if (kriskProxyEnabled) {
      return <KriskProxyEmbed />;
    }
    return <KriskProxyUnavailable />;
  }

  return <>{children}</>;
}

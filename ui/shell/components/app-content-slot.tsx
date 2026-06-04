"use client";

import * as React from "react";
import type { ShellAppConfig } from "@/config/apps/registry";
import { isProxiedMount } from "@/lib/krisk-proxy";
import { ProxyEmbed } from "@/ui/shell/components/proxy-embed";
import { KriskProxyUnavailable } from "@/ui/shell/components/krisk-proxy-unavailable";

interface AppContentSlotProps {
  app: ShellAppConfig;
  children: React.ReactNode;
}

/**
 * The single seam where app content is rendered into the shell.
 *
 * For apps with `mount.type === "proxy"`, embeds the standalone dev app via a
 * same-origin iframe (`/{slug}-proxy/*` → dev server). Only active in development;
 * production shows a placeholder until Phase 2 mounting is implemented.
 */
export function AppContentSlot({ app, children }: AppContentSlotProps) {
  if (isProxiedMount(app)) {
    if (process.env.NODE_ENV === "development") {
      return <ProxyEmbed app={app} />;
    }
    return <KriskProxyUnavailable />;
  }

  return <>{children}</>;
}

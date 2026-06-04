"use client";

import { getAppById } from "@/config/apps/registry";
import { ProxyEmbed } from "@/ui/shell/components/proxy-embed";

/** Thin wrapper around ProxyEmbed scoped to the K Risk app. */
export function KriskProxyEmbed() {
  const kriskApp = getAppById("krisk")!;
  return <ProxyEmbed app={kriskApp} />;
}

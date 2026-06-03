"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { resolveActiveApp } from "@/lib/navigation/resolve-nav";
import type { ShellAppId } from "@/config/apps/registry";

interface ActiveAppContextValue {
  activeAppId: ShellAppId;
  /**
   * Optimistically sets the active app (e.g. from the switcher) so the sidebar can
   * update before navigation completes. The URL remains the source of truth and will
   * reconcile this value on the next render.
   */
  setActiveAppId: (id: ShellAppId) => void;
}

const ActiveAppContext = React.createContext<ActiveAppContextValue | null>(null);

export function ActiveAppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const appFromPath = resolveActiveApp(pathname).id;
  const [activeAppId, setActiveAppId] = React.useState<ShellAppId>(appFromPath);

  // The URL is authoritative: reconcile during render whenever the path resolves to a
  // different app (the "adjust state when a prop changes" pattern, no effect needed).
  const [prevAppFromPath, setPrevAppFromPath] = React.useState<ShellAppId>(appFromPath);
  if (appFromPath !== prevAppFromPath) {
    setPrevAppFromPath(appFromPath);
    setActiveAppId(appFromPath);
  }

  const value = React.useMemo(() => ({ activeAppId, setActiveAppId }), [activeAppId]);

  return <ActiveAppContext.Provider value={value}>{children}</ActiveAppContext.Provider>;
}

export function useActiveApp(): ActiveAppContextValue {
  const ctx = React.useContext(ActiveAppContext);
  if (!ctx) {
    throw new Error("useActiveApp must be used within ActiveAppProvider");
  }
  return ctx;
}

"use client";

import * as React from "react";

import { persistPlatformSidebarCollapsed } from "@/lib/platform-preferences/shared-cookies";

function setSidebarCookie(collapsed: boolean) {
  persistPlatformSidebarCollapsed(collapsed);
}

interface LiveViewSidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const LiveViewSidebarContext = React.createContext<LiveViewSidebarContextValue | null>(null);

export function useLiveViewSidebar() {
  return React.useContext(LiveViewSidebarContext);
}

export function LiveViewSidebarProvider({
  children,
  initialCollapsed,
}: {
  children: React.ReactNode;
  initialCollapsed: boolean;
}) {
  const [collapsed, setCollapsedState] = React.useState(initialCollapsed);

  React.useEffect(() => {
    setSidebarCookie(collapsed);
  }, [collapsed]);

  const setCollapsed = React.useCallback((value: boolean) => {
    setCollapsedState(value);
  }, []);

  const value = React.useMemo(() => ({ collapsed, setCollapsed }), [collapsed, setCollapsed]);

  return (
    <LiveViewSidebarContext.Provider value={value}>{children}</LiveViewSidebarContext.Provider>
  );
}

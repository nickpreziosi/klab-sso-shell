"use client";

import * as React from "react";

const COOKIE_NAME = "k-lab-sidebar-collapsed";

function setSidebarCookie(collapsed: boolean) {
  document.cookie = `${COOKIE_NAME}=${collapsed}; path=/; max-age=31536000; SameSite=Lax`;
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

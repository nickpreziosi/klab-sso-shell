"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, cn, Content } from "@k-lab/components";
import { PanelLeft } from "lucide-react";
import { useAuth } from "@/ui/user-management/providers/auth-provider";
import { clearPresenceSession } from "@/lib/auth/presence-session-client";
import {
  useLiveViewSidebar,
  LiveViewSidebarProvider,
} from "@/ui/shared/providers/live-view-sidebar-provider";
import { ActiveAppProvider, useActiveApp } from "@/ui/shell/providers/active-app-provider";
import { ShellSessionProvider } from "@/ui/shell/providers/shell-session-provider";
import { PreferencesBar } from "@/ui/shared/components/preferences-bar";
import { ShellPreferencesBar } from "@/ui/shell/components/shell-preferences-bar";
import { AppMobileNavbar } from "@/ui/shared/components/app-mobile-navbar";
import { ShellSidebar } from "@/ui/shell/components/shell-sidebar";
import { ProxyIframePool } from "@/ui/shell/components/proxy-iframe-pool";
import { AppShellFooter } from "@/ui/shared/components/app-shell-footer";
import { MOBILE_SIDEBAR_WIDTH_PERCENT } from "@/ui/shared/components/mobile-sidebar-panel";
import { useScrollDirection } from "@/ui/shared/hooks/use-scroll-direction";
import { useCloseOnFocusIn } from "@/ui/shared/hooks/use-close-on-focus-in";
import { useSwipeGesture } from "@/ui/shared/hooks/use-swipe-gesture";
import { getAppById } from "@/config/apps/registry";
import { isProxiedMount } from "@/lib/krisk-proxy";
import { getPrimaryNav, getAccordions } from "@/lib/navigation/resolve-nav";
import { isPublicPath } from "@/lib/auth/public-routes";

interface ShellLayoutClientProps {
  children: React.ReactNode;
  initialSidebarCollapsed?: boolean;
}

const SLIDE_DURATION_MS = 300;

const NOOP = () => {};

function ShellLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const sidebar = useLiveViewSidebar();
  const sidebarCollapsed = sidebar?.collapsed ?? false;
  const setSidebarCollapsed = sidebar?.setCollapsed ?? NOOP;
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeAppId } = useActiveApp();
  const { scrollRef, navbarVisible } = useScrollDirection();
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  useCloseOnFocusIn(mainContentRef, isMobile && sidebarOpen, () => setSidebarOpen(false));

  const swipe = useSwipeGesture({
    enabled: isMobile,
    onSwipeRight: () => setSidebarOpen(true),
    onSwipeLeft: () => sidebarOpen && setSidebarOpen(false),
  });

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Client-side auth guard: middleware gates the cookie, but if the Firebase session
  // is gone we clear presence and bounce to login.
  React.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      clearPresenceSession().finally(() => router.replace("/login"));
    }
  }, [authLoading, user, router]);

  const activeApp = getAppById(activeAppId) ?? getAppById("shell")!;
  const proxiedContent = isProxiedMount(activeApp);
  const primaryNav = React.useMemo(() => getPrimaryNav(activeApp), [activeApp]);
  const accordions = React.useMemo(() => getAccordions(activeApp), [activeApp]);

  const shellUser = React.useMemo(
    () => ({
      name: user?.displayName ?? user?.email ?? "User",
      email: user?.email ?? undefined,
      avatar: user?.photoUrl ?? undefined,
    }),
    [user]
  );

  // Stable callbacks so the memoized sidebar isn't re-rendered by parent
  // re-renders (e.g. when `children` changes on navigation).
  const handleProfileClick = React.useCallback(() => setSidebarOpen(false), []);
  const handleSettingsClick = React.useCallback(() => setSidebarOpen(false), []);
  const handleLogoutClick = React.useCallback(async () => {
    setSidebarOpen(false);
    await signOut();
    router.replace("/login");
  }, [signOut, router]);

  if (!user) {
    // Avoid flashing the shell chrome before the guard redirect completes.
    return null;
  }

  return (
    <div className="flex h-screen-dvh overflow-hidden bg-background relative">
      <ShellPreferencesBar />
      <ShellSidebar
        appId={activeAppId}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileTitle={`${activeApp.name} Navigation Menu`}
        primaryNav={primaryNav}
        accordions={accordions}
        user={shellUser}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 z-50 hidden md:flex bg-background border border-border shadow-sm hover:bg-accent ml-2 transition-all duration-150 ease-in-out"
        style={{ left: sidebarCollapsed ? "69px" : "256px" }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0 overflow-x-hidden">
        <div
          ref={mainContentRef}
          onTouchStart={swipe.handleTouchStart}
          onTouchEnd={swipe.handleTouchEnd}
          className="flex-1 flex flex-col min-h-0 min-w-0 will-change-transform"
          style={{
            transform:
              isMobile && sidebarOpen
                ? `translateX(${MOBILE_SIDEBAR_WIDTH_PERCENT}%)`
                : "translateX(0)",
            transition: `transform ${SLIDE_DURATION_MS}ms ease-out`,
          }}
        >
          <AppMobileNavbar
            appId={activeAppId}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            navbarVisible={navbarVisible}
            user={shellUser}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
            onLogoutClick={handleLogoutClick}
          />
          <main
            ref={scrollRef}
            data-shell-main
            className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background pt-20 md:pt-0"
          >
            {!proxiedContent && (
              <div className="@container flex min-h-screen-dvh w-full min-w-0 grow shrink-0 flex-col">
                <Content
                  className="mx-auto w-full max-w-7xl 2xl:max-w-[1800px]"
                  maxWidth=""
                  padding="px-4 @md:px-8 py-8 @md:py-8 @lg:px-12 @lg:py-12"
                >
                  {children}
                </Content>
                <AppShellFooter />
              </div>
            )}
            {/* Iframe pool — always mounted so apps survive app-switching.
                Inactive iframes are hidden with display:none, keeping them alive. */}
            <ProxyIframePool />
            {proxiedContent && <AppShellFooter />}
          </main>
        </div>
      </div>
    </div>
  );
}

export function ShellLayoutClient({ children, initialSidebarCollapsed }: ShellLayoutClientProps) {
  const pathname = usePathname() ?? "/";

  // Auth pages render their own full-screen UI without shell chrome.
  if (isPublicPath(pathname)) {
    return (
      <>
        <PreferencesBar variant="auth" />
        {children}
      </>
    );
  }

  return (
    <LiveViewSidebarProvider initialCollapsed={!!initialSidebarCollapsed}>
      <ActiveAppProvider>
        <ShellSessionProvider>
          <ShellLayoutContent>{children}</ShellLayoutContent>
        </ShellSessionProvider>
      </ActiveAppProvider>
    </LiveViewSidebarProvider>
  );
}

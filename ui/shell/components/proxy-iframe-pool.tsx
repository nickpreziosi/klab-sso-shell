"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@k-lab/components";
import { RefreshCw, WifiOff } from "lucide-react";
import { PROXIED_APPS } from "@/config/apps/proxy-config";
import { getAppById, type ShellAppId } from "@/config/apps/registry";
import { isProxiedMount } from "@/lib/krisk-proxy";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";
import { useShellSession } from "@/ui/shell/providers/shell-session-provider";
import {
  isShellEmbedHeightMessage,
  isShellEmbedNavigateMessage,
  SHELL_EMBED_WHEEL_MESSAGE,
  SHELL_SEND_NAVIGATE_MESSAGE,
  SHELL_SEND_TOKEN_MESSAGE,
} from "@/lib/krisk-iframe-height";
import { proxyIframeSrc, proxyPathToShellPath } from "@/lib/proxy-routing";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractAppRelativePath(shellPath: string, slug: string): string {
  const prefix = `/${slug}`;
  if (shellPath === prefix || shellPath === `${prefix}/`) return "/";
  if (shellPath.startsWith(`${prefix}/`)) return shellPath.slice(prefix.length);
  return "/";
}

function buildInitialSrc(shellPath: string, appId: string): string | null {
  const app = getAppById(appId as ShellAppId);
  if (!app) return null;

  if (process.env.NODE_ENV === "development") {
    const currentAppPath = shellPath.startsWith(`/${app.slug}`)
      ? shellPath
      : `/${app.slug}`;
    return proxyIframeSrc(currentAppPath, app);
  }

  const baseUrl = app.prodUrl;
  if (!baseUrl) return null;

  const relPath = shellPath.startsWith(`/${app.slug}`)
    ? extractAppRelativePath(shellPath, app.slug)
    : "/";

  const url = new URL(relPath === "/" ? baseUrl : `${baseUrl.replace(/\/$/, "")}${relPath}`);
  url.searchParams.set("shell", "1");
  return url.toString();
}

function getTargetOrigin(appId: string): string {
  if (process.env.NODE_ENV === "development") return window.location.origin;
  const app = getAppById(appId as ShellAppId);
  if (app?.prodUrl) {
    try {
      return new URL(app.prodUrl).origin;
    } catch {
      // fall through
    }
  }
  return window.location.origin;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders one persistent iframe per proxied app and shows/hides them as the
 * user switches between apps — so each embedded app survives navigation without
 * being destroyed and re-bootstrapped.
 *
 * Within-app navigation is driven by postMessage (SHELL_SEND_NAVIGATE_MESSAGE)
 * rather than by changing the iframe `src`, which would cause a full reload.
 *
 * On load, each iframe receives the current Firebase ID token so it can
 * authenticate its own API calls independently of the shell's cookies.
 */
export function ProxyIframePool() {
  const { activeAppId } = useActiveApp();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { getIdToken } = useShellSession();

  // Computed once at mount. We never change the iframe `src` after mount;
  // all subsequent navigation is driven by postMessage.
  const [initialSrcs] = React.useState<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    for (const cfg of PROXIED_APPS) {
      const app = getAppById(cfg.appId as ShellAppId);
      if (!app || !isProxiedMount(app)) continue;
      const src = buildInitialSrc(pathname, cfg.appId);
      if (src) result[cfg.appId] = src;
    }
    return result;
  });

  const iframeRefs = React.useRef<Record<string, HTMLIFrameElement | null>>({});
  // Tracks which iframes have fired their onLoad event.
  const readyAppsRef = React.useRef<Set<string>>(new Set());
  // When an iframe posts a navigate message we push the shell router, but we
  // must not echo the navigate back to the iframe. This ref holds the path we
  // should skip on the next effect run.
  const skipSendForPathRef = React.useRef<string | null>(null);

  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const [minHeight, setMinHeight] = React.useState(
    () => (typeof window !== "undefined" ? window.innerHeight : 600),
  );
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  // Incrementing this for a given appId causes React to remount that iframe,
  // which re-triggers the src load — the only way to retry without changing src.
  const [retryCounts, setRetryCounts] = React.useState<Record<string, number>>({});

  // Stable refs so callbacks that close over these values don't go stale.
  const activeAppIdRef = React.useRef(activeAppId);
  const pathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    activeAppIdRef.current = activeAppId;
  }, [activeAppId]);
  React.useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // ------------------------------------------------------------------
  // Auth token delivery
  // ------------------------------------------------------------------

  const sendTokenTo = React.useCallback(
    async (iframe: HTMLIFrameElement, appId: string) => {
      try {
        const token = await getIdToken();
        iframe.contentWindow?.postMessage(
          { type: SHELL_SEND_TOKEN_MESSAGE, token },
          getTargetOrigin(appId),
        );
      } catch {
        // Non-fatal: the embedded app handles an absent token gracefully.
      }
    },
    [getIdToken],
  );

  // ------------------------------------------------------------------
  // iframe onLoad
  // ------------------------------------------------------------------

  const handleIframeLoad = React.useCallback(
    (appId: string) => {
      const iframe = iframeRefs.current[appId];
      if (!iframe?.contentWindow) return;

      readyAppsRef.current.add(appId);
      void sendTokenTo(iframe, appId);

      // Sync to current shell path in case the initial src was stale
      // (e.g. the user navigated before the iframe finished loading).
      if (appId === activeAppIdRef.current) {
        const app = getAppById(appId as ShellAppId);
        if (app && pathnameRef.current.startsWith(`/${app.slug}`)) {
          const relPath = extractAppRelativePath(pathnameRef.current, app.slug);
          iframe.contentWindow.postMessage(
            { type: SHELL_SEND_NAVIGATE_MESSAGE, path: relPath },
            getTargetOrigin(appId),
          );
        }
      }
    },
    [sendTokenTo],
  );

  const handleIframeError = React.useCallback((appId: string) => {
    readyAppsRef.current.delete(appId);
    setErrors((prev) => ({ ...prev, [appId]: true }));
  }, []);

  const handleRetry = React.useCallback((appId: string) => {
    setErrors((prev) => ({ ...prev, [appId]: false }));
    setRetryCounts((prev) => ({ ...prev, [appId]: (prev[appId] ?? 0) + 1 }));
  }, []);

  // ------------------------------------------------------------------
  // Drive the active iframe from the shell URL
  // ------------------------------------------------------------------

  React.useEffect(() => {
    const app = getAppById(activeAppId);
    if (!app || !isProxiedMount(app)) return;

    const iframe = iframeRefs.current[activeAppId];
    if (!iframe?.contentWindow) return;
    // Wait until the iframe has loaded before sending messages.
    if (!readyAppsRef.current.has(activeAppId)) return;

    // Skip echo: this pathname change originated from an iframe navigate message.
    if (skipSendForPathRef.current === pathname) {
      skipSendForPathRef.current = null;
      return;
    }

    const relPath = pathname.startsWith(`/${app.slug}`)
      ? extractAppRelativePath(pathname, app.slug)
      : "/";

    iframe.contentWindow.postMessage(
      { type: SHELL_SEND_NAVIGATE_MESSAGE, path: relPath },
      getTargetOrigin(activeAppId),
    );
  }, [pathname, activeAppId]);

  // ------------------------------------------------------------------
  // Receive messages from embedded apps
  // ------------------------------------------------------------------

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      const isKnownOrigin =
        event.origin === window.location.origin ||
        PROXIED_APPS.some((cfg) => {
          const app = getAppById(cfg.appId as ShellAppId);
          if (!app?.prodUrl) return false;
          try {
            return new URL(app.prodUrl).origin === event.origin;
          } catch {
            return false;
          }
        });
      if (!isKnownOrigin) return;

      // Identify which embedded app sent this message.
      const sendingEntry = Object.entries(iframeRefs.current).find(
        ([, ref]) => ref?.contentWindow === event.source,
      );
      if (!sendingEntry) return;
      const [appId] = sendingEntry;

      if (isShellEmbedHeightMessage(event.data)) {
        setHeights((prev) => ({ ...prev, [appId]: event.data.height }));
        return;
      }

      if (isShellEmbedNavigateMessage(event.data)) {
        // Only honour navigation from the currently visible app — inactive iframes
        // (e.g. responding to a language-change broadcast) must not hijack the URL.
        if (appId !== activeAppIdRef.current) return;
        const app = getAppById(appId as ShellAppId);
        if (!app) return;
        const shellPath = proxyPathToShellPath(event.data.path, app);
        skipSendForPathRef.current = shellPath;
        router.push(shellPath, { scroll: false });
        return;
      }

      if (
        typeof event.data === "object" &&
        event.data !== null &&
        (event.data as { type?: unknown }).type === SHELL_EMBED_WHEEL_MESSAGE
      ) {
        const { deltaX, deltaY } = event.data as { deltaX: number; deltaY: number };
        document
          .querySelector<HTMLElement>("[data-shell-main]")
          ?.scrollBy({ left: deltaX, top: deltaY });
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  // ------------------------------------------------------------------
  // Track minimum height (viewport minus footer)
  // ------------------------------------------------------------------

  React.useEffect(() => {
    const main = document.querySelector<HTMLElement>("[data-shell-main]");
    if (!main) return;
    const update = () => {
      const footer = main.querySelector<HTMLElement>("[data-shell-footer]");
      setMinHeight(Math.max(main.clientHeight - (footer?.offsetHeight ?? 0), 0));
    };
    const ro = new ResizeObserver(update);
    ro.observe(main);
    const footer = main.querySelector<HTMLElement>("[data-shell-footer]");
    if (footer) ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const proxiedConfigs = PROXIED_APPS.filter((cfg) => {
    const app = getAppById(cfg.appId as ShellAppId);
    return app && isProxiedMount(app) && initialSrcs[cfg.appId];
  });

  return (
    <>
      {proxiedConfigs.map((cfg) => {
        const app = getAppById(cfg.appId as ShellAppId);
        const isActive = activeAppId === cfg.appId;
        const hasError = errors[cfg.appId] ?? false;
        const reportedHeight = heights[cfg.appId] ?? 0;
        const height = isActive ? Math.max(Math.ceil(reportedHeight), minHeight) : 0;

        return (
          <React.Fragment key={cfg.appId}>
            {isActive && hasError && (
              <div
                className="flex flex-col items-center justify-center gap-4 text-center"
                style={{ minHeight: minHeight ? `${minHeight}px` : "100dvh" }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <WifiOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      {app?.name ?? cfg.appId} couldn&apos;t be reached
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check that the app server is running, then try again.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetry(cfg.appId)}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Retry
                  </Button>
                </div>
              </div>
            )}
            <iframe
              key={`${cfg.appId}-${retryCounts[cfg.appId] ?? 0}`}
              ref={(el) => {
                iframeRefs.current[cfg.appId] = el;
              }}
              title={app?.name ?? cfg.appId}
              src={initialSrcs[cfg.appId]}
              scrolling="no"
              className="block w-full border-0 bg-background"
              style={{
                display: isActive && !hasError ? "block" : "none",
                height: isActive && !hasError ? (height ? `${height}px` : "100dvh") : 0,
              }}
              onLoad={() => handleIframeLoad(cfg.appId)}
              onError={() => handleIframeError(cfg.appId)}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

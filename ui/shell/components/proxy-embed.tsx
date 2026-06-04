"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ShellAppConfig } from "@/config/apps/registry";
import {
  isShellEmbedHeightMessage,
  isShellEmbedNavigateMessage,
  SHELL_EMBED_WHEEL_MESSAGE,
} from "@/lib/krisk-iframe-height";
import { proxyIframeSrc, proxyPathToShellPath } from "@/lib/proxy-routing";

interface ProxyEmbedProps {
  app: ShellAppConfig;
}

/**
 * Generic iframe embed for any proxied app.
 *
 * Sizes the iframe to the child's reported scrollHeight so the shell `main`
 * scrolls through the iframe and then any content below it.
 * Keeps the shell URL in sync when the embedded app navigates internally.
 */
export function ProxyEmbed({ app }: ProxyEmbedProps) {
  const shellPathname = usePathname() ?? `/${app.slug}`;
  const router = useRouter();

  const [src, setSrc] = React.useState(() => proxyIframeSrc(shellPathname, app));
  const [contentHeight, setContentHeight] = React.useState(0);
  const [minHeight, setMinHeight] = React.useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 0,
  );

  // When the iframe posts a navigate message we push to the shell router AND
  // record the resulting shell path here so the effect below can skip the
  // redundant src update (avoids reloading an iframe for its own navigation).
  const skipSrcForPathRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (skipSrcForPathRef.current === shellPathname) {
      skipSrcForPathRef.current = null;
      return;
    }
    skipSrcForPathRef.current = null;
    setContentHeight(0);
    setSrc(proxyIframeSrc(shellPathname, app));
  }, [shellPathname, app]);

  React.useEffect(() => {
    const main = document.querySelector<HTMLElement>("[data-shell-main]");
    if (!main) return;
    const update = () => {
      const footer = main.querySelector<HTMLElement>("[data-shell-footer]");
      const footerHeight = footer?.offsetHeight ?? 0;
      setMinHeight(Math.max(main.clientHeight - footerHeight, 0));
    };
    const ro = new ResizeObserver(update);
    ro.observe(main);
    const footer = main.querySelector<HTMLElement>("[data-shell-footer]");
    if (footer) ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (isShellEmbedHeightMessage(event.data)) {
        setContentHeight(event.data.height);
        return;
      }

      if (isShellEmbedNavigateMessage(event.data)) {
        const shellPath = proxyPathToShellPath(event.data.path, app);
        skipSrcForPathRef.current = shellPath;
        router.push(shellPath, { scroll: false });
        return;
      }

      if (
        typeof event.data === "object" &&
        event.data !== null &&
        (event.data as { type?: unknown }).type === SHELL_EMBED_WHEEL_MESSAGE
      ) {
        const { deltaX, deltaY } = event.data as { deltaX: number; deltaY: number };
        const main = document.querySelector<HTMLElement>("[data-shell-main]");
        main?.scrollBy({ left: deltaX, top: deltaY });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router, app]);

  const height = Math.max(Math.ceil(contentHeight), minHeight);

  return (
    <iframe
      title={app.name}
      src={src}
      scrolling="no"
      className="block w-full border-0 bg-background"
      style={{ height: height ? `${height}px` : "100dvh" }}
    />
  );
}

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isShellEmbedHeightMessage, SHELL_EMBED_WHEEL_MESSAGE } from "@/lib/krisk-iframe-height";
import { kriskProxyIframeSrc } from "@/lib/krisk-proxy";

/**
 * Embeds the proxied K Risk app and sizes the iframe to its content so the
 * shell `main` scrolls through the iframe and then the footer below it.
 *
 * Single source of truth for the content height: the child posts its own
 * scrollHeight (`shell-embed-height-reporter`). The shell never resizes the
 * iframe to measure it (that previously caused a 99999px feedback loop). We
 * just clamp to at least the visible shell viewport so short pages still fill
 * the screen and keep the footer pinned to the bottom.
 */
export function KriskProxyEmbed() {
  const pathname = usePathname() ?? "/krisk";
  const src = React.useMemo(() => kriskProxyIframeSrc(pathname), [pathname]);

  const [contentHeight, setContentHeight] = React.useState(0);
  const [minHeight, setMinHeight] = React.useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 0,
  );

  // Navigating (sidebar link) swaps the iframe `src`, which reloads it. Drop the
  // previous page's reported height immediately so the iframe collapses to the
  // viewport floor while the new page loads, instead of lingering at the old
  // (possibly much taller) height until the child reports back.
  React.useEffect(() => {
    setContentHeight(0);
  }, [src]);

  // Minimum iframe height = the visible shell scrollport minus the footer, so a
  // short page fills exactly to the bottom of the viewport with the footer
  // pinned beneath it (instead of the footer being pushed below the fold).
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

  // Content height + wheel forwarding come from the embedded app via postMessage.
  // Wheel events over the iframe never reach the shell scrollport on their own
  // (the iframe has no internal scroll), so the child forwards wheel deltas and
  // we apply them to `[data-shell-main]`.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (isShellEmbedHeightMessage(event.data)) {
        setContentHeight(event.data.height);
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
  }, []);

  const height = Math.max(Math.ceil(contentHeight), minHeight);

  return (
    <iframe
      title="K Risk"
      src={src}
      scrolling="no"
      className="block w-full border-0 bg-background"
      style={{ height: height ? `${height}px` : "100dvh" }}
    />
  );
}

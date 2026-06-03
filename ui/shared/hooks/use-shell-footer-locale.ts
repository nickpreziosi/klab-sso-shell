"use client";

import * as React from "react";
import { shellFooterLocaleSegment } from "@/lib/app-shell-footer-config";

/**
 * Tracks the `<html lang>` value so footer links stay aligned with locale preference.
 */
export function useShellFooterLocaleSegment(): string {
  const getSnapshot = React.useCallback((): string => {
    if (typeof document === "undefined") return "en";
    return shellFooterLocaleSegment(document.documentElement.lang);
  }, []);

  const subscribe = React.useCallback((onChange: () => void) => {
    if (typeof document === "undefined") return () => {};

    const el = document.documentElement;
    const mo = new MutationObserver(onChange);
    mo.observe(el, { attributes: true, attributeFilter: ["lang"] });
    return () => mo.disconnect();
  }, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => "en");
}

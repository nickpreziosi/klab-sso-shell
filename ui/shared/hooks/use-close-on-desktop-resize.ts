"use client";

import { useEffect } from "react";

/** Breakpoint (px) below which is considered "mobile". Above = desktop. Default 768 (md). */
const MOBILE_BREAKPOINT_PX = 768;

/**
 * Closes the open state when the viewport is resized to desktop (>= breakpoint).
 * Use for mobile-only drawers, sheets, and modals.
 */
export function useCloseOnDesktopResize(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  breakpointPx = MOBILE_BREAKPOINT_PX
) {
  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      if (window.innerWidth >= breakpointPx) {
        onOpenChange(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, onOpenChange, breakpointPx]);
}

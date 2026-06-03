"use client";

import * as React from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-hidden") === "true" || el.closest("[aria-hidden='true']")) return false;

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;

    return el.getClientRects().length > 0;
  });
}

interface UseScopedTabNavigationOptions {
  enabled: boolean;
  containers: Array<React.RefObject<HTMLElement | null>>;
}

/**
 * Keeps tab navigation inside the provided focus scope containers.
 * Useful for mobile pane-style UIs where the current section should own tab order.
 */
export function useScopedTabNavigation({ enabled, containers }: UseScopedTabNavigationOptions) {
  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusables = containers
        .map((ref) => ref.current)
        .filter((el): el is HTMLElement => !!el)
        .flatMap((container) => getFocusableElements(container));
      const uniqueFocusables = Array.from(new Set(focusables));

      if (!uniqueFocusables.length) return;

      const activeElement = document.activeElement as HTMLElement | null;
      const activeIndex = activeElement ? uniqueFocusables.indexOf(activeElement) : -1;
      const lastIndex = uniqueFocusables.length - 1;

      if (event.shiftKey) {
        if (activeIndex <= 0) {
          event.preventDefault();
          uniqueFocusables[lastIndex]?.focus();
        }
        return;
      }

      if (activeIndex === -1 || activeIndex >= lastIndex) {
        event.preventDefault();
        uniqueFocusables[0]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [containers, enabled]);
}

"use client";

import { useCallback, useRef } from "react";

const DEFAULT_SWIPE_THRESHOLD = 60;

/**
 * Returns true if we should NOT trigger a swipe (i.e. the user is interacting with
 * an element that has its own horizontal drag/swipe behavior).
 */
function shouldSkipSwipe(element: Element | null): boolean {
  if (!element) return false;
  if (
    element.closest?.(
      '[data-swipe-ignore], [class*="recharts"], [class*="embla"], [class*="carousel"], [role="slider"], input[type="range"]'
    )
  )
    return true;
  let el: Element | null = element;
  while (el) {
    const role = el.getAttribute?.("role");
    const tagName = el.tagName?.toUpperCase?.();
    if (
      role === "table" ||
      role === "grid" ||
      tagName === "TABLE" ||
      tagName === "TBODY" ||
      tagName === "THEAD" ||
      tagName === "TFOOT"
    ) {
      return true;
    }
    const style = window.getComputedStyle(el);
    const overflowX = style.overflowX;
    const overflow = style.overflow;
    const hasHorizontalScroll =
      overflowX === "auto" ||
      overflowX === "scroll" ||
      overflowX === "overlay" ||
      overflow === "auto" ||
      overflow === "scroll" ||
      overflow === "overlay";
    if (hasHorizontalScroll && el.scrollWidth > el.clientWidth) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

export interface UseSwipeGestureOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  enabled?: boolean;
  /** Minimum horizontal distance (px) to trigger a swipe. Default 60. */
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeRight,
  onSwipeLeft,
  enabled = true,
  threshold = DEFAULT_SWIPE_THRESHOLD,
}: UseSwipeGestureOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      if (shouldSkipSwipe(e.target as Element)) return;
      const touch = e.touches[0];
      if (touch) {
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStart.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }

      touchStart.current = null;
    },
    [enabled, threshold, onSwipeRight, onSwipeLeft]
  );

  return { handleTouchStart, handleTouchEnd };
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/** Pixels to scroll before hiding (down) or showing (up) the navbar. Reduces flicker. */
const SCROLL_THRESHOLD_PX = 64;

/**
 * Returns ref and visibility state for mobile navbar that hides on scroll down, shows on scroll up.
 * Attach ref to the scroll container (element with overflow-y-auto).
 */
export function useScrollDirection<T extends HTMLElement = HTMLElement>() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDelta = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null);
  const [scrollEl, setScrollEl] = useState<T | null>(null);

  const scrollRef = useCallback((el: T | null) => {
    setScrollEl(el);
  }, []);

  useEffect(() => {
    if (!scrollEl) return;

    const handleScroll = () => {
      const scrollTop = scrollEl.scrollTop;
      const delta = scrollTop - lastScrollY.current;

      if (scrollTop <= 10) {
        setNavbarVisible(true);
        scrollDelta.current = 0;
        lastDirection.current = null;
      } else if (delta > 0) {
        if (lastDirection.current !== "down") {
          lastDirection.current = "down";
          scrollDelta.current = 0;
        }
        scrollDelta.current += delta;
        if (scrollDelta.current >= SCROLL_THRESHOLD_PX) {
          setNavbarVisible(false);
          scrollDelta.current = 0;
        }
      } else if (delta < 0) {
        if (lastDirection.current !== "up") {
          lastDirection.current = "up";
          scrollDelta.current = 0;
        }
        scrollDelta.current += Math.abs(delta);
        if (scrollDelta.current >= SCROLL_THRESHOLD_PX) {
          setNavbarVisible(true);
          scrollDelta.current = 0;
        }
      }

      lastScrollY.current = scrollTop;
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [scrollEl]);

  return { scrollRef, navbarVisible };
}

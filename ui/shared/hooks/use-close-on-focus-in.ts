"use client";

import { useEffect, useRef } from "react";

/**
 * Closes an overlay (sidebar, modal, etc.) when focus moves INTO a target container
 * FROM OUTSIDE of it (e.g. from the overlay). Ignores focus that was already inside
 * the container.
 *
 * @param containerRef - Ref to the container that receives focus (main content area)
 * @param isActive - Whether the close-on-focus logic should run (e.g. overlay open on mobile)
 * @param onClose - Callback to close the overlay
 */
export function useCloseOnFocusIn(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleFocusIn = (e: FocusEvent) => {
      if (!isActive) return;
      const relatedTarget = e.relatedTarget as Node | null;
      if (!relatedTarget) return;
      if (el.contains(relatedTarget)) return;
      onCloseRef.current();
    };

    el.addEventListener("focusin", handleFocusIn);
    return () => el.removeEventListener("focusin", handleFocusIn);
  }, [containerRef, isActive]);
}

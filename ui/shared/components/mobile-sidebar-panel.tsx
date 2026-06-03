"use client";

import * as React from "react";
import { Button, cn } from "@k-lab/components";
import { X } from "lucide-react";
import { useCloseOnDesktopResize } from "@/ui/shared/hooks/use-close-on-desktop-resize";
import { useCloseOnEscape } from "@/ui/shared/hooks/use-close-on-escape";
import { useSwipeGesture } from "@/ui/shared/hooks/use-swipe-gesture";

export { ProfileBottomDrawer } from "./profile-bottom-drawer";

const SLIDE_DURATION_MS = 300;
/** Sidebar width as percentage of viewport (partial overlay). Export for layout sync. */
export const MOBILE_SIDEBAR_WIDTH_PERCENT = 75;
/** Breakpoint (px): below = mobile (sidebar panel), above = tablet/desktop (normal sidebar). */
export const MOBILE_BREAKPOINT_PX = 768;

export interface MobileSidebarPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  title?: string;
  topOffset?: number;
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  pushContent?: boolean;
}

/**
 * Full-width mobile sidebar panel that slides in from the left.
 */
export function MobileSidebarPanel({
  open,
  onOpenChange,
  children,
  panelRef,
  title = "Navigation Menu",
  topOffset = 0,
  className,
  footer,
  header,
  pushContent = false,
}: MobileSidebarPanelProps) {
  useCloseOnDesktopResize(open, onOpenChange, MOBILE_BREAKPOINT_PX);
  useCloseOnEscape(open, () => onOpenChange(false));

  const swipe = useSwipeGesture({
    enabled: open,
    onSwipeLeft: () => onOpenChange(false),
  });

  React.useEffect(() => {
    if (open) {
      document.body.setAttribute("data-mobile-sidebar-open", "true");
      return () => document.body.removeAttribute("data-mobile-sidebar-open");
    }
  }, [open]);

  return (
    <>
      <div
        ref={panelRef}
        className={cn(
          "fixed left-0 bottom-0 z-40 flex flex-col bg-background border-r border-border md:hidden",
          "will-change-transform",
          open ? "translate-x-0" : "-translate-x-full pointer-events-none",
          className
        )}
        onTouchStart={swipe.handleTouchStart}
        onTouchEnd={swipe.handleTouchEnd}
        style={{
          top: topOffset,
          width: `${MOBILE_SIDEBAR_WIDTH_PERCENT}vw`,
          maxWidth: "100%",
          transition: `transform ${SLIDE_DURATION_MS}ms ease-out`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="relative flex flex-col h-full p-0">
          <div className="shrink-0 flex items-center gap-2 h-20 px-4 border-b border-border">
            {header && <div className="flex-1 min-w-0 flex items-center">{header}</div>}
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => onOpenChange(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">{children}</div>
          {footer && <div className="shrink-0 border-t border-border">{footer}</div>}
        </div>
      </div>
      <div
        className={cn(
          "fixed z-30 bg-black/50 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          transition: `opacity ${SLIDE_DURATION_MS}ms ease-out`,
          ...(pushContent
            ? {
                left: 0,
                top: topOffset,
                bottom: 0,
                width: `${MOBILE_SIDEBAR_WIDTH_PERCENT}vw`,
                maxWidth: "100%",
              }
            : { inset: 0 }),
        }}
        onClick={() => onOpenChange(false)}
        onTouchStart={swipe.handleTouchStart}
        onTouchEnd={swipe.handleTouchEnd}
        aria-hidden
      />
    </>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCloseOnDesktopResize } from "@/ui/shared/hooks/use-close-on-desktop-resize";
import { MOBILE_BREAKPOINT_PX } from "@/ui/shared/components/mobile-sidebar-panel";
import { useScopedTabNavigation } from "@/ui/shared/hooks/use-scoped-tab-navigation";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  cn,
} from "@k-lab/components";
import { Check, ChevronDown, X } from "lucide-react";
import { ThemeAwareLogo } from "@/ui/shared/components/theme-aware-logo";
import { SWITCHER_APPS, appShowsBrandLogo, type ShellAppId } from "@/config/apps/registry";
import { appDefaultHref } from "@/lib/navigation/resolve-nav";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";

export interface TechNavDrawerProps {
  currentAppId: ShellAppId;
  trigger?: React.ReactNode;
  className?: string;
  /** Optional - called when the user selects an app (e.g. to close the sidebar). */
  onAppSelect?: () => void;
}

/**
 * Mobile app switcher. Opens a top drawer with all apps from the registry as links.
 */
export function TechNavDrawer({ currentAppId, trigger, className, onAppSelect }: TechNavDrawerProps) {
  const router = useRouter();
  const { setActiveAppId } = useActiveApp();
  const [open, setOpen] = React.useState(false);
  const drawerContentRef = React.useRef<HTMLDivElement>(null);
  useCloseOnDesktopResize(open, setOpen, MOBILE_BREAKPOINT_PX);
  useScopedTabNavigation({ enabled: open, containers: [drawerContentRef] });

  const currentApp = SWITCHER_APPS.find((a) => a.id === currentAppId) ?? SWITCHER_APPS[0];
  const CurrentLogo = currentApp.logo;
  const currentShowsLogo = appShowsBrandLogo(currentApp);

  const handleSelect = (id: ShellAppId, href: string, isCurrent: boolean) => {
    setOpen(false);
    onAppSelect?.();
    if (isCurrent) return;
    setActiveAppId(id);
    router.push(href);
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      className={cn("h-11 w-fit gap-2 pl-2 pr-2 font-medium justify-between", className)}
      aria-label="Switch app - Open application menu"
      aria-expanded={open}
    >
      <span className="inline-flex h-7 shrink-0 items-center">
        {currentShowsLogo ? (
          <ThemeAwareLogo
            Logo={CurrentLogo}
            className="h-5 w-auto"
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <span className="truncate text-sm font-semibold tracking-tight">{currentApp.name}</span>
        )}
      </span>
      <ChevronDown
        className={cn("h-5 w-5 shrink-0 transition-transform duration-200", open && "rotate-180")}
        aria-hidden
      />
    </Button>
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="top">
      <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
      <DrawerContent
        ref={drawerContentRef}
        side="top"
        className="rounded-b-app-radius p-0 pb-safe max-h-[85dvh] shadow-2xl [&>div:first-child]:hidden [&>button:last-child]:hidden"
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Switch app</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col max-h-[85dvh] overflow-hidden rounded-b-app-radius border-b border-border">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border/80 px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight">Choose Application</h2>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Close">
                <X className="h-5 w-5" aria-hidden />
              </Button>
            </DrawerClose>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-2 gap-2 p-3">
              {SWITCHER_APPS.map((app) => {
                const AppLogo = app.logo;
                const isCurrent = app.id === currentAppId;
                const showsLogo = appShowsBrandLogo(app);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelect(app.id, appDefaultHref(app), isCurrent)}
                    className={cn(
                      "active:scale-95 flex items-center gap-3 px-4 py-3 border-l-2 transition-colors rounded-r-app-radius !rounded-l-none text-left",
                      isCurrent
                        ? "bg-accent border-l-accent-brand"
                        : "border-l-accent-brand active:bg-accent hover:bg-accent"
                    )}
                    aria-label={app.name}
                  >
                    {showsLogo ? (
                      <div className="flex h-7 items-center max-[480px]:h-5">
                        <ThemeAwareLogo
                          Logo={AppLogo}
                          wrapperClassName="h-7 max-[480px]:h-5"
                          preserveAspectRatio="xMidYMid meet"
                          className="h-7 w-auto shrink-0 max-[480px]:h-5"
                          aria-hidden
                        />
                      </div>
                    ) : (
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">
                        {app.name}
                      </span>
                    )}
                    {isCurrent && (
                      <Check className="ml-auto h-5 w-5 shrink-0 text-accent-brand" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            className="relative shrink-0 h-8 pb-6 cursor-grab active:cursor-grabbing touch-none select-none"
            aria-hidden
          >
            <div className="absolute rounded-app-radius bg-muted-foreground/30 left-1/2 h-2 w-40 -translate-x-1/2 bottom-3" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

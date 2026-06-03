"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  KLabLogo,
  Separator,
} from "@k-lab/components";
import { ChevronDown, Check } from "lucide-react";
import { ThemeAwareLogo } from "@/ui/shared/components/theme-aware-logo";
import { SWITCHER_APPS, appShowsBrandLogo, type ShellAppId } from "@/config/apps/registry";
import { appDefaultHref } from "@/lib/navigation/resolve-nav";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";

export interface GlobalNavLogoProps {
  currentAppId: ShellAppId;
  collapsed: boolean;
  logoContainerCollapsed: boolean;
  alt: string;
}

/**
 * App switcher rendered in the sidebar header. Reads the app list from the registry,
 * shows the current app's logo, and navigates to the selected app while optimistically
 * updating the active app so the sidebar swaps immediately.
 */
export function GlobalNavLogo({ currentAppId, collapsed, alt }: GlobalNavLogoProps) {
  const router = useRouter();
  const { setActiveAppId } = useActiveApp();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const currentApp = SWITCHER_APPS.find((a) => a.id === currentAppId) ?? SWITCHER_APPS[0];
  const CurrentLogo = currentApp.logo;
  const currentShowsLogo = appShowsBrandLogo(currentApp);

  const handleSelect = (id: ShellAppId, href: string, isCurrent: boolean) => {
    setDropdownOpen(false);
    if (isCurrent) return;
    setActiveAppId(id);
    router.push(href);
  };

  const triggerButton = (
    <button
      type="button"
      className={cn(
        "flex w-full items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar rounded-app-radius transition-colors",
        collapsed
          ? "h-14 justify-center px-0"
          : "h-11 px-3 justify-between gap-2 bg-background hover:bg-accent hover:text-accent-foreground"
      )}
      aria-label={`${alt} - Switch app`}
      aria-haspopup="listbox"
      aria-expanded={dropdownOpen}
    >
      {collapsed ? (
        <KLabLogo variant="icon" className="h-9 w-9 shrink-0" />
      ) : (
        <>
          {currentShowsLogo ? (
            <ThemeAwareLogo
              Logo={CurrentLogo}
              className="h-6 w-auto"
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <span className="truncate text-sm font-semibold tracking-tight">{currentApp.name}</span>
          )}
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
              dropdownOpen && "rotate-180"
            )}
            aria-hidden
          />
        </>
      )}
    </button>
  );

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Switch app</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align={collapsed ? "start" : "center"}
        side={collapsed ? "right" : "bottom"}
        className="w-56 !px-1"
      >
        <div className="flex flex-col">
          {SWITCHER_APPS.map((app) => {
            const AppLogo = app.logo;
            const isCurrent = app.id === currentAppId;
            const isShell = app.id === "shell";
            const showsLogo = appShowsBrandLogo(app);
            return (
              <React.Fragment key={app.id}>
                <DropdownMenuItem
                  onSelect={() => handleSelect(app.id, appDefaultHref(app), isCurrent)}
                  className={cn(
                    "h-11 gap-3 my-1 px-4 py-0 mx-2 border-l-2 border-l-accent-brand rounded-r-app-radius rounded-l-none group",
                    isCurrent && "bg-accent/50"
                  )}
                >
                  {showsLogo ? (
                    <div className="grid h-9 w-auto place-items-center">
                      <ThemeAwareLogo
                        Logo={AppLogo}
                        wrapperClassName="flex h-7 w-auto items-center justify-center py-1.5 transition group-hover:translate-x-1"
                        preserveAspectRatio="xMidYMid meet"
                        className="h-7 w-auto"
                      />
                    </div>
                  ) : (
                    <span className={cn("min-w-0 flex-1 truncate text-sm font-semibold tracking-tight transition-transform duration-200 group-hover:translate-x-1", isCurrent && "!translate-x-1")}>
                      {app.name}
                    </span>
                  )}
                  {isCurrent && (
                    <Check className="ml-auto h-5 w-5 shrink-0 text-accent-brand" aria-hidden />
                  )}
                </DropdownMenuItem>
                {isShell && <Separator className="my-1" />}
              </React.Fragment>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

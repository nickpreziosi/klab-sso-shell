"use client";

import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeToggle,
  useTheme,
  cn,
} from "@k-lab/components";
import { PanelLeft, User, Settings, LogOut } from "lucide-react";
import { TechNavDrawer } from "@/ui/shared/components/tech-nav-drawer";
import type { ShellAppId } from "@/config/apps/registry";

export interface AppMobileNavbarProps {
  appId: ShellAppId;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  sidebarToggleRef?: React.RefObject<HTMLButtonElement | null>;
  navbarVisible: boolean;
  user: { name?: string; email?: string; avatar?: string | undefined };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export function AppMobileNavbar({
  appId,
  sidebarOpen,
  onToggleSidebar,
  sidebarToggleRef,
  navbarVisible,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}: AppMobileNavbarProps) {
  const { theme } = useTheme();

  const themeDisplayName =
    (theme === "light" && "Light") ||
    (theme === "dark" && "Dark") ||
    (theme === "system" && "System") ||
    "System";

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <div className="md:hidden absolute top-0 left-0 right-0 h-20 overflow-hidden z-50">
      <div
        className={cn(
          "w-full h-20 border-b glass-navbar transition-transform duration-300 ease-out",
          !navbarVisible && "!-translate-y-full"
        )}
      >
        <div className="flex justify-between items-center h-20 px-4 gap-2 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <Button
              ref={sidebarToggleRef}
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={onToggleSidebar}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeft className="h-6 w-6" />
            </Button>
            <TechNavDrawer currentAppId={appId} />
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <ThemeToggle
              tooltipContent={<p>Theme: {themeDisplayName}</p>}
              tooltipSide="bottom"
              className="h-11 w-11"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full avatar-trigger-btn"
                  aria-label="Account"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-accent">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="!w-56 !p-2 glass-morphism">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs">My Account</DropdownMenuLabel>
                <Separator className="my-1" />
                <DropdownMenuItem
                  onClick={onProfileClick}
                  className="min-h-11 px-3 py-2.5 cursor-pointer"
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onSettingsClick}
                  className="min-h-11 px-3 py-2.5 cursor-pointer"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem
                  onClick={onLogoutClick}
                  className="min-h-11 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

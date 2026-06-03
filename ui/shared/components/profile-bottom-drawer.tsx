"use client";

import * as React from "react";
import { useCloseOnDesktopResize } from "@/ui/shared/hooks/use-close-on-desktop-resize";
import { MOBILE_BREAKPOINT_PX } from "@/ui/shared/components/mobile-sidebar-panel";
import { useScopedTabNavigation } from "@/ui/shared/hooks/use-scoped-tab-navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@k-lab/components";
import { User, Settings, LogOut } from "lucide-react";

export interface ProfileBottomDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Profile/account menu as a bottom drawer (slides up from bottom).
 * Use on mobile inside MobileSidebarPanel instead of a popover.
 */
export function ProfileBottomDrawer({
  open,
  onOpenChange,
  trigger,
  user = { name: "User", email: "user@example.com" },
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}: ProfileBottomDrawerProps) {
  const drawerContentRef = React.useRef<HTMLDivElement>(null);

  useCloseOnDesktopResize(open, onOpenChange, MOBILE_BREAKPOINT_PX);
  useScopedTabNavigation({ enabled: open, containers: [drawerContentRef] });

  const handleProfileClick = () => {
    onProfileClick?.();
    onOpenChange(false);
  };
  const handleSettingsClick = () => {
    onSettingsClick?.();
    onOpenChange(false);
  };
  const handleLogoutClick = () => {
    onLogoutClick?.();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        ref={drawerContentRef}
        className="rounded-t-app-radius p-0 pb-safe shadow-2xl border-none [&>div.absolute]:cursor-grab [&>div.absolute]:active:cursor-grabbing [&>div.absolute]:touch-none [&>div.absolute]:select-none"
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>My Account</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 p-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="text-sm font-medium truncate w-full">{user.name || "User"}</span>
              <span className="text-xs text-muted-foreground truncate w-full">
                {user.email || "user@example.com"}
              </span>
            </div>
          </div>
          <nav className="flex flex-col p-2">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start gap-3 h-12"
              onClick={handleProfileClick}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start gap-3 h-12"
              onClick={handleSettingsClick}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

import * as React from "react";
import {
  ApplicationMenuDropdown,
  ApplicationMenuDrawer,
  cn,
  type AppSwitcherItem,
} from "@k-lab/components";
import { buildShellApplicationMenuItems, type ShellAppId } from "@/config/platform/application-menu";
import { filterAppsByRole } from "@/lib/roles/shell-roles";
import { buildKLabCollapsedMenuIcon } from "@/ui/shared/components/platform-app-menu-icon";
import { useShellRole } from "@/ui/shell/providers/shell-role-provider";

type PlatformApplicationMenuProps = {
  currentAppId: ShellAppId;
  collapsed?: boolean;
  logoContainerCollapsed?: boolean;
  onAppSelect?: () => void;
  className?: string;
  fallback?: React.ReactNode;
};

const compactTriggerFocusClassName =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar focus-visible:!rounded-app-radius";

/** Collapsed sidebar trigger only — dropdown items keep product logos. */
const PlatformApplicationMenuKLabTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PlatformApplicationMenuKLabTrigger({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center justify-start rounded-app-radius transition-colors",
        compactTriggerFocusClassName,
        "h-14 ps-0 pe-0",
        className,
      )}
      {...props}
    >
      <div className="relative flex w-full min-w-0 items-center justify-start">
        <div className="relative flex h-14 w-9 shrink-0 items-center overflow-hidden">
          {buildKLabCollapsedMenuIcon()}
        </div>
      </div>
    </button>
  );
});

function resolveMenuCurrentAppId(
  apps: AppSwitcherItem[],
  currentAppId: ShellAppId,
): ShellAppId {
  if (apps.some((app) => app.id === currentAppId)) {
    return currentAppId;
  }
  return (apps[0]?.id as ShellAppId | undefined) ?? currentAppId;
}

function useAccessibleApplicationMenuItems(): AppSwitcherItem[] {
  const { activeRole, initialized } = useShellRole();
  const allItems = React.useMemo(() => buildShellApplicationMenuItems(), []);

  return React.useMemo(() => {
    if (!initialized) return allItems;
    const allowedIds = new Set(
      filterAppsByRole(
        allItems.map((item) => ({ id: item.id as ShellAppId })),
        activeRole,
      ).map((item) => item.id),
    );
    return allItems.filter((item) => allowedIds.has(item.id as ShellAppId));
  }, [activeRole, allItems, initialized]);
}

export function PlatformApplicationMenuDropdown({
  currentAppId,
  collapsed = false,
  logoContainerCollapsed = false,
  onAppSelect,
  fallback = null,
}: PlatformApplicationMenuProps) {
  const apps = useAccessibleApplicationMenuItems();

  if (apps.length === 0) {
    return <>{fallback}</>;
  }

  const resolvedCurrentAppId = resolveMenuCurrentAppId(apps, currentAppId);
  const currentApp = apps.find((app) => app.id === resolvedCurrentAppId);
  const useKLabCompactTrigger = collapsed && logoContainerCollapsed;

  return (
    <ApplicationMenuDropdown
      apps={apps}
      currentAppId={resolvedCurrentAppId}
      collapsed={collapsed}
      compact={logoContainerCollapsed}
      useAnchorLinks
      triggerLabel="Switch app"
      onAppSelect={onAppSelect}
      contentSide={logoContainerCollapsed ? "right" : "bottom"}
      contentAlign={logoContainerCollapsed ? "start" : "center"}
      trigger={
        useKLabCompactTrigger ? (
          <PlatformApplicationMenuKLabTrigger
            aria-label={`${currentApp?.label ?? "App"} - Switch app`}
          />
        ) : undefined
      }
    />
  );
}

export function PlatformApplicationMenuDrawer({
  currentAppId,
  onAppSelect,
  className,
  fallback = null,
}: PlatformApplicationMenuProps) {
  const apps = useAccessibleApplicationMenuItems();

  if (apps.length === 0) {
    return <>{fallback}</>;
  }

  const resolvedCurrentAppId = resolveMenuCurrentAppId(apps, currentAppId);

  return (
    <ApplicationMenuDrawer
      apps={apps}
      currentAppId={resolvedCurrentAppId}
      useAnchorLinks
      triggerLabel="Switch app"
      drawerTitle="Choose Application"
      onAppSelect={onAppSelect}
      className={className}
    />
  );
}

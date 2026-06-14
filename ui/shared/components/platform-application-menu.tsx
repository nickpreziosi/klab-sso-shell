"use client";

import * as React from "react";
import {
  ApplicationMenuDropdown,
  ApplicationMenuDrawer,
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

function resolveMenuCurrentAppId(
  apps: AppSwitcherItem[],
  currentAppId: ShellAppId,
): ShellAppId {
  if (apps.some((app) => app.id === currentAppId)) {
    return currentAppId;
  }
  return (apps[0]?.id as ShellAppId | undefined) ?? currentAppId;
}

/** ApplicationMenu uses `icon` at 9×9 in collapsed+compact mode — swap to K Lab icon. */
function resolveMenuAppsForDisplay(
  apps: AppSwitcherItem[],
  currentAppId: string,
  collapsed: boolean,
  logoContainerCollapsed: boolean,
  compactIcon: React.ReactNode,
): AppSwitcherItem[] {
  if (!collapsed || !logoContainerCollapsed) return apps;
  return apps.map((app) =>
    app.id === currentAppId ? { ...app, icon: compactIcon } : app,
  );
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
  const compactIcon = React.useMemo(() => buildKLabCollapsedMenuIcon(), []);

  if (apps.length === 0) {
    return <>{fallback}</>;
  }

  const resolvedCurrentAppId = resolveMenuCurrentAppId(apps, currentAppId);
  const displayApps = resolveMenuAppsForDisplay(
    apps,
    resolvedCurrentAppId,
    collapsed,
    logoContainerCollapsed,
    compactIcon,
  );

  return (
    <ApplicationMenuDropdown
      apps={displayApps}
      currentAppId={resolvedCurrentAppId}
      collapsed={collapsed}
      compact={logoContainerCollapsed}
      useAnchorLinks
      triggerLabel="Switch app"
      onAppSelect={onAppSelect}
      contentSide={logoContainerCollapsed ? "right" : "bottom"}
      contentAlign={logoContainerCollapsed ? "start" : "center"}
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

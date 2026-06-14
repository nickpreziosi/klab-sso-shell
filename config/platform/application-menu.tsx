"use client";

import * as React from "react";
import type { AppSwitcherItem } from "@k-lab/components";
import {
  SWITCHER_APPS,
  appShowsBrandLogo,
  type LogoComponent,
  type ShellAppId,
} from "@/config/apps/registry";
import { appDefaultHref } from "@/lib/navigation/resolve-nav";
import { KHubLogo } from "@/ui/shared/components/k-hub-logo";
import {
  buildPlatformAppMenuIcon,
  buildThemedMenuIcon,
} from "@/ui/shared/components/platform-app-menu-icon";

/** App switcher items for the SSO platform (shell + child apps). */
export function buildShellApplicationMenuItems(): AppSwitcherItem[] {
  return SWITCHER_APPS.map((app) => {
    const item: AppSwitcherItem = {
      id: app.id,
      label: app.name,
      href: appDefaultHref(app),
      description: app.description,
      separatorAfter: app.id === "shell",
    };

    if (app.id === "shell") {
      item.icon = buildThemedMenuIcon(
        KHubLogo as LogoComponent,
        "h-6 w-auto",
      );
      return item;
    }

    if (appShowsBrandLogo(app)) {
      item.icon = buildPlatformAppMenuIcon(app.id, undefined, app.logoSizeClass);
    }

    return item;
  });
}

export type { ShellAppId };

"use client";

import { TooltipProvider } from "@k-lab/components";
import { PreferencesBar } from "@/ui/shared/components/preferences-bar";
import { getAppById } from "@/config/apps/registry";
import { isProxiedMount } from "@/lib/krisk-proxy";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";
import { ShellRoleSelector } from "@/ui/shell/components/preferences/shell-role-selector";
import { KriskRoleSelector } from "@/ui/shell/components/preferences/krisk-role-selector";
import { KriskBrandSelector } from "@/ui/shell/components/preferences/krisk-brand-selector";

export function ShellPreferencesBar() {
  const { activeAppId } = useActiveApp();
  const activeApp = getAppById(activeAppId) ?? getAppById("shell")!;
  const proxiedContent = isProxiedMount(activeApp);

  const showKriskDevTools = activeAppId === "shell" || activeAppId === "krisk";

  return (
    <PreferencesBar>
      <TooltipProvider>
        {!proxiedContent && <ShellRoleSelector />}
        {showKriskDevTools && <KriskBrandSelector />}
        {activeAppId === "krisk" && <KriskRoleSelector />}
      </TooltipProvider>
    </PreferencesBar>
  );
}

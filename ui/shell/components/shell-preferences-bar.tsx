"use client";

import { TooltipProvider } from "@k-lab/components";
import { PreferencesBar } from "@/ui/shared/components/preferences-bar";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";
import { KriskRoleSelector } from "@/ui/shell/components/preferences/krisk-role-selector";
import { KriskBrandSelector } from "@/ui/shell/components/preferences/krisk-brand-selector";

export function ShellPreferencesBar() {
  const { activeAppId } = useActiveApp();

  return (
    <PreferencesBar>
      {activeAppId === "krisk" && (
        <TooltipProvider>
          <KriskRoleSelector />
          <KriskBrandSelector />
        </TooltipProvider>
      )}
    </PreferencesBar>
  );
}

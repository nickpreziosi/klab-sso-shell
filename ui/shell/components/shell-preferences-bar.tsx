"use client";

import { TooltipProvider } from "@k-lab/components";
import { PreferencesBar } from "@/ui/shared/components/preferences-bar";
import { ShellRoleSelector } from "@/ui/shell/components/preferences/shell-role-selector";
import { KriskBrandSelector } from "@/ui/shell/components/preferences/krisk-brand-selector";

/**
 * Shell pages only — child zones render their own preferences bar. The K Risk
 * brand selector stays here because its cookie is shared with the zone.
 */
export function ShellPreferencesBar() {
  return (
    <PreferencesBar>
      <TooltipProvider>
        <ShellRoleSelector />
        <KriskBrandSelector />
      </TooltipProvider>
    </PreferencesBar>
  );
}

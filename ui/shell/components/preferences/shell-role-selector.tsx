"use client";

import * as React from "react";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@k-lab/components";
import { ShieldCheck, Check } from "lucide-react";
import { SHELL_ROLE_OPTIONS } from "@/lib/roles/shell-roles";
import { useShellRole } from "@/ui/shell/providers/shell-role-provider";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

export function ShellRoleSelector() {
  const { t } = useInternationalizationContext();
  const { activeRole, setActiveRole } = useShellRole();

  const activeOption = SHELL_ROLE_OPTIONS.find((role) => role.id === activeRole);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9")}
              aria-label={t("shellDevRoleAria", "preferences")}
            >
              <ShieldCheck className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          <p>
            {t("shellDevRoleTooltipWithValue", "preferences", {
              role: activeOption
                ? t(activeOption.labelKey, "preferences")
                : activeRole,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="left" align="start" className="w-44">
        <DropdownMenuLabel>{t("shellDevRoleMenuTitle", "preferences")}</DropdownMenuLabel>
        {SHELL_ROLE_OPTIONS.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className="flex items-center justify-between"
          >
            {t(role.labelKey, "preferences")}
            {activeRole === role.id && (
              <Check className="size-3.5 text-muted-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

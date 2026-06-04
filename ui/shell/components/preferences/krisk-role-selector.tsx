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
import { UserCog, Check } from "lucide-react";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

const KRISK_ROLE_STORAGE_KEY = "krisk-dev-role-session";

const KRISK_ROLES = [
  { id: "ADMIN", labelKey: "roleAdmin" },
  { id: "UW", labelKey: "roleUw" },
  { id: "EXECUTIVE", labelKey: "roleExecutive" },
  { id: "EXECUTIVE_BRAZIL", labelKey: "roleExecutiveBrazil" },
  { id: "OPERATIONS", labelKey: "roleOperations" },
  { id: "COMMITTE_GTC", labelKey: "roleCommitteeGtc" },
] as const;

type KriskRole = (typeof KRISK_ROLES)[number]["id"];

function readStoredRole(): KriskRole {
  if (typeof window === "undefined") return "ADMIN";
  try {
    const stored = window.localStorage.getItem(KRISK_ROLE_STORAGE_KEY);
    if (stored && KRISK_ROLES.some((r) => r.id === stored)) return stored as KriskRole;
  } catch {
    // ignore
  }
  return "ADMIN";
}

function notifyIframes(role: KriskRole) {
  const iframes = document.querySelectorAll<HTMLIFrameElement>("iframe");
  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        { type: "shell:preference-change", key: "role", value: role },
        window.location.origin,
      );
    } catch {
      // cross-origin iframe — skip
    }
  });
}

export function KriskRoleSelector() {
  const { t } = useInternationalizationContext();
  const [activeRole, setActiveRole] = React.useState<KriskRole>("ADMIN");

  React.useEffect(() => {
    setActiveRole(readStoredRole());
  }, []);

  const handleSelect = React.useCallback((role: KriskRole) => {
    setActiveRole(role);
    try {
      window.localStorage.setItem(KRISK_ROLE_STORAGE_KEY, role);
    } catch {
      // ignore
    }
    notifyIframes(role);
  }, []);

  const activeLabel = KRISK_ROLES.find((r) => r.id === activeRole);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9")}
              aria-label={t("roleTooltip", "preferences")}
            >
              <UserCog className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          <p>
            {t("roleTooltipWithValue", "preferences", {
              role: activeLabel ? t(activeLabel.labelKey, "preferences") : activeRole,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="left" align="start" className="w-48">
        <DropdownMenuLabel>{t("roleLabel", "preferences")}</DropdownMenuLabel>
        {KRISK_ROLES.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className="flex items-center justify-between"
          >
            {t(role.labelKey, "preferences")}
            {activeRole === role.id && <Check className="size-3.5 text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

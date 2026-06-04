"use client";

import * as React from "react";
import { ThemeToggle, cn, useTheme } from "@k-lab/components";
import { AppLanguageDropdown } from "@/ui/shared/components/app-language-dropdown";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

type PreferencesBarVariant = "default" | "auth";

interface PreferencesBarProps {
  variant?: PreferencesBarVariant;
  children?: React.ReactNode;
}

export function PreferencesBar({ variant = "default", children }: PreferencesBarProps) {
  const { theme } = useTheme();
  const { t } = useInternationalizationContext();
  const isAuth = variant === "auth";

  const themeDisplayName = t(theme ?? "system", "theme");

  return (
    <div
      className={cn(
        "fixed top-4 end-0 z-40 flex flex-col gap-1 rounded-app-radius border border-border glass-morphism shadow-sm p-1",
        isAuth ? "flex" : "hidden md:flex",
      )}
      role="toolbar"
      aria-label={t("toolbarAria", "preferences")}
    >
      {!isAuth && (
        <ThemeToggle
          tooltipContent={
            <p>{t("themeTooltipWithValue", "preferences", { theme: themeDisplayName })}</p>
          }
          tooltipSide="left"
          className="h-9 w-9"
        />
      )}
      <AppLanguageDropdown
        side="left"
        align="start"
        className="h-9 w-9"
        tooltipText={t("languageTooltip", "preferences")}
      />
      {!isAuth && children}
    </div>
  );
}

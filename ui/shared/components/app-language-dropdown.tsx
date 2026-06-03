"use client";

import * as React from "react";
import {
  LanguageCommand,
  type ExtendedPopperSide,
  type LanguageCommandProps,
  type LanguageOption,
} from "@k-lab/components";
import { APP_LANGUAGE_OPTIONS } from "@/lib/app-languages";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

interface AppLanguageDropdownProps {
  className?: string;
  tooltipText?: string | null;
  side?: Side;
  align?: Align;
  tooltipSide?: ExtendedPopperSide;
}

const APP_LANGUAGES: LanguageOption[] = APP_LANGUAGE_OPTIONS.map(
  ({ code, label, flag, aliases }) => ({
    code,
    label,
    flag,
    aliases: [...aliases],
  }),
);

export function AppLanguageDropdown({
  className,
  tooltipText,
  side = "right",
  align = "end",
  tooltipSide = "start",
}: AppLanguageDropdownProps) {
  const { currentLanguage, changeLanguage, t } = useInternationalizationContext();

  const messages = React.useMemo(
    () => ({
      searchPlaceholder: t("searchLanguagesPlaceholder", "i18n"),
      noResults: t("noLanguageFound", "i18n"),
      keyboardHint: t("keyboardHint", "i18n"),
      commandLabel: "Languages",
    }),
    [t],
  );

  const effectiveTooltipText =
    tooltipText === undefined ? t("languageLabel", "nav") : tooltipText;

  return (
    <LanguageCommand
      className={className}
      tooltipText={effectiveTooltipText}
      side={side}
      align={align}
      tooltipSide={tooltipSide as LanguageCommandProps["tooltipSide"]}
      value={currentLanguage}
      languages={APP_LANGUAGES}
      onLanguageChange={changeLanguage}
      messages={messages}
    />
  );
}

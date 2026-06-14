"use client";

import * as React from "react";
import { ThemeAwareLogo } from "@/ui/shared/components/theme-aware-logo";

/** Wide wordmarks (taller viewBox) — match HomeDashboard sizing. */
export const WIDE_MENU_LOGO_CLASS = "h-[2.125rem] w-auto max-w-[155px]";

/** @deprecated Use WIDE_MENU_LOGO_CLASS */
export const KBPM_MENU_LOGO_CLASS = WIDE_MENU_LOGO_CLASS;

type ThemeLogo = React.ComponentType<
  { variant?: "dark" | "light" | "white"; className?: string } & Record<string, unknown>
>;

/** Static SVG assets — reliable inside portaled ApplicationMenu surfaces. */
const PRODUCT_MENU_LOGO_SRC: Record<string, { dark: string; white: string }> = {
  kbpm: {
    dark: "/logos/kbpm-logo-dark.svg",
    white: "/logos/kbpm-logo-white.svg",
  },
  kleads: {
    dark: "/logos/kleads-logo-dark.svg",
    white: "/logos/kleads-logo-white.svg",
  },
  krisk: {
    dark: "/logos/krisk-logo-dark.svg",
    white: "/logos/krisk-logo-white.svg",
  },
  shell: {
    dark: "/logos/klab-logo-full-dark.svg",
    white: "/logos/klab-logo-full-white.svg",
  },
};

const STATIC_MENU_LOGO_APP_IDS = new Set(["shell", "kbpm", "kleads", "krisk"]);

const WIDE_MENU_LOGO_APP_IDS: Record<string, string> = {
  kbpm: WIDE_MENU_LOGO_CLASS,
  kleads: WIDE_MENU_LOGO_CLASS,
};

function buildStaticProductMenuIcon(appId: string, className: string) {
  const sources = PRODUCT_MENU_LOGO_SRC[appId];
  if (!sources) return null;

  return (
    <span className="inline-flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources.dark}
        alt=""
        className={`${className} object-contain dark:hidden`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources.white}
        alt=""
        className={`${className} hidden object-contain dark:inline`}
      />
    </span>
  );
}

export function buildKLabCollapsedMenuIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logos/klab-logo-icon.svg"
      alt=""
      className="h-9 w-9 shrink-0 object-contain"
    />
  );
}

export function buildThemedMenuIcon(Logo: ThemeLogo, className = "h-7 w-auto") {
  return (
    <ThemeAwareLogo
      Logo={Logo}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    />
  );
}

export function buildPlatformAppMenuIcon(
  appId: string,
  Logo?: ThemeLogo,
  className?: string,
) {
  const resolvedClass =
    className ?? WIDE_MENU_LOGO_APP_IDS[appId] ?? "h-7 w-auto";

  if (STATIC_MENU_LOGO_APP_IDS.has(appId)) {
    return buildStaticProductMenuIcon(appId, resolvedClass);
  }

  if (!Logo) return null;
  return buildThemedMenuIcon(Logo, resolvedClass);
}

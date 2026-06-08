"use client";

import * as React from "react";
import {
  KRISK_BRAND_CSS_CLASS,
  KRISK_BRAND_IDS,
  readKriskBrandCookie,
  SHELL_KRISK_BRAND_CHANGE_EVENT,
  type KriskBrandId,
} from "@/lib/krisk-brand";
import { useActiveApp } from "@/ui/shell/providers/active-app-provider";

function applyKriskBrandToDocument(brandId: KriskBrandId, active: boolean) {
  const root = document.documentElement;
  for (const id of KRISK_BRAND_IDS) {
    const cssClass = KRISK_BRAND_CSS_CLASS[id];
    if (cssClass) root.classList.remove(cssClass);
  }
  if (!active) return;
  const cssClass = KRISK_BRAND_CSS_CLASS[brandId];
  if (cssClass) root.classList.add(cssClass);
}

/**
 * Applies the K Risk dev brand theme to the shell chrome on the home dashboard
 * and while K Risk is active. Other products keep the default shell palette.
 */
export function KriskBrandSync() {
  const { activeAppId } = useActiveApp();
  const applyBrandTheme = activeAppId === "shell" || activeAppId === "krisk";

  const syncBrand = React.useCallback(
    (brandId?: KriskBrandId) => {
      applyKriskBrandToDocument(brandId ?? readKriskBrandCookie(), applyBrandTheme);
    },
    [applyBrandTheme],
  );

  React.useEffect(() => {
    syncBrand();
  }, [syncBrand]);

  React.useEffect(() => {
    const onBrandChange = (event: Event) => {
      syncBrand((event as CustomEvent<KriskBrandId>).detail);
    };
    window.addEventListener(SHELL_KRISK_BRAND_CHANGE_EVENT, onBrandChange);
    return () => window.removeEventListener(SHELL_KRISK_BRAND_CHANGE_EVENT, onBrandChange);
  }, [syncBrand]);

  return null;
}

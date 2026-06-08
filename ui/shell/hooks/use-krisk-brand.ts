"use client";

import * as React from "react";
import {
  DEFAULT_KRISK_BRAND,
  readKriskBrandCookie,
  SHELL_KRISK_BRAND_CHANGE_EVENT,
  type KriskBrandId,
} from "@/lib/krisk-brand";

export function useKriskBrand(): KriskBrandId {
  const [brand, setBrand] = React.useState<KriskBrandId>(DEFAULT_KRISK_BRAND);

  React.useEffect(() => {
    setBrand(readKriskBrandCookie());

    const onBrandChange = (event: Event) => {
      setBrand((event as CustomEvent<KriskBrandId>).detail);
    };

    window.addEventListener(SHELL_KRISK_BRAND_CHANGE_EVENT, onBrandChange);
    return () => window.removeEventListener(SHELL_KRISK_BRAND_CHANGE_EVENT, onBrandChange);
  }, []);

  return brand;
}

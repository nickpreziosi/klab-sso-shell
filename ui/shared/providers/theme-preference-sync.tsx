"use client";

import * as React from "react";
import { useTheme } from "@k-lab/components";
import {
  isValidPlatformTheme,
  persistPlatformTheme,
} from "@/lib/platform-preferences/shared-cookies";

/** Writes theme changes to the shared platform cookie (init script handles read before paint). */
export function ThemePreferenceSync() {
  const { theme } = useTheme();
  const skipInitialPersist = React.useRef(true);

  React.useEffect(() => {
    if (!isValidPlatformTheme(theme)) return;
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    persistPlatformTheme(theme);
  }, [theme]);

  return null;
}

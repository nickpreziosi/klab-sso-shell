"use client";

import * as React from "react";
import { cn } from "@k-lab/components";

/**
 * Renders a theme-aware logo (dark variant on light bg, light variant on dark bg)
 * without flashing the wrong variant. Uses CSS + the .dark class set by the root
 * layout script (before React), so the correct logo is visible on first paint.
 */
type ThemeAwareLogoProps = {
  /** Variant union matches the logos exported by `@k-lab/components`; we only ever pass "dark" | "light". */
  Logo: React.ComponentType<
    { variant?: "dark" | "light" | "color" | "white" | "black"; className?: string } & Record<
      string,
      unknown
    >
  >;
  className?: string;
  wrapperClassName?: string;
} & Record<string, unknown>;

export function ThemeAwareLogo({
  Logo,
  className,
  wrapperClassName,
  ...logoProps
}: ThemeAwareLogoProps) {
  return (
    <span className={cn("inline-flex", wrapperClassName)}>
      <span className="block dark:hidden" aria-hidden>
        <Logo variant="dark" className={className} {...logoProps} />
      </span>
      <span className="hidden dark:block" aria-hidden>
        <Logo variant="light" className={className} {...logoProps} />
      </span>
    </span>
  );
}

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebarShell, type AppSidebarShellProps } from "@/ui/shared/components/app-sidebar-shell";

export type ShellSidebarProps = Omit<AppSidebarShellProps, "currentPath">;

/**
 * Memoized sidebar wrapper that subscribes to the pathname *internally*.
 *
 * This keeps the sidebar from re-rendering when the rest of the shell layout
 * does (e.g. when `children` changes on navigation): as long as the props below
 * are referentially stable, `React.memo` skips parent-driven re-renders. A route
 * change still updates the active highlight, because `usePathname()` re-renders
 * only this component — not the whole layout.
 */
function ShellSidebarImpl(props: ShellSidebarProps) {
  const pathname = usePathname() ?? "/";
  return <AppSidebarShell {...props} currentPath={pathname} />;
}

export const ShellSidebar = React.memo(ShellSidebarImpl);

"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { resolveActiveApp } from "@/lib/navigation/resolve-nav";
import { useShellRole } from "@/ui/shell/providers/shell-role-provider";

const UNAUTHORIZED_PATH = "/unauthorized";

export function ShellAppGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { canAccessApp, initialized } = useShellRole();

  const activeApp = resolveActiveApp(pathname);
  const isUnauthorizedPage = pathname === UNAUTHORIZED_PATH;
  const isShellHome = activeApp.id === "shell";
  const authorized = isUnauthorizedPage || isShellHome || canAccessApp(activeApp.id);

  React.useEffect(() => {
    if (!initialized || isUnauthorizedPage) return;
    if (!authorized) {
      router.replace(UNAUTHORIZED_PATH);
    }
  }, [authorized, initialized, isUnauthorizedPage, router]);

  if (initialized && !authorized && !isUnauthorizedPage) return null;

  return <>{children}</>;
}

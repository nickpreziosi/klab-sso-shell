"use client";

import * as React from "react";
import {
  ALL_SHELL_ROLES,
  DEFAULT_SHELL_ROLE,
  SHELL_ROLE_STORAGE_KEY,
  canRoleAccessApp,
  isShellRole,
  type ShellRole,
} from "@/lib/roles/shell-roles";
import type { ShellAppId } from "@/config/apps/registry";

type ShellRoleContextValue = {
  activeRole: ShellRole;
  /** False until localStorage has been read. Guards must wait before enforcing access. */
  initialized: boolean;
  setActiveRole: (role: ShellRole) => void;
  canAccessApp: (appId: ShellAppId) => boolean;
};

const ShellRoleContext = React.createContext<ShellRoleContextValue | null>(null);

function readStoredRole(): ShellRole {
  if (typeof window === "undefined") return DEFAULT_SHELL_ROLE;
  try {
    const stored = window.localStorage.getItem(SHELL_ROLE_STORAGE_KEY);
    if (stored && isShellRole(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_SHELL_ROLE;
}

export function ShellRoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = React.useState<ShellRole>(DEFAULT_SHELL_ROLE);
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setActiveRoleState(readStoredRole());
    setInitialized(true);
  }, []);

  React.useEffect(() => {
    if (!initialized || typeof window === "undefined") return;
    window.localStorage.setItem(SHELL_ROLE_STORAGE_KEY, activeRole);
  }, [activeRole, initialized]);

  const setActiveRole = React.useCallback((role: ShellRole) => {
    if (!ALL_SHELL_ROLES.includes(role)) return;
    setActiveRoleState(role);
  }, []);

  const canAccessApp = React.useCallback(
    (appId: ShellAppId) => canRoleAccessApp(activeRole, appId),
    [activeRole],
  );

  return (
    <ShellRoleContext.Provider
      value={{ activeRole, initialized, setActiveRole, canAccessApp }}
    >
      {children}
    </ShellRoleContext.Provider>
  );
}

export function useShellRole(): ShellRoleContextValue {
  const ctx = React.useContext(ShellRoleContext);
  if (!ctx) {
    throw new Error("useShellRole must be used within a ShellRoleProvider");
  }
  return ctx;
}

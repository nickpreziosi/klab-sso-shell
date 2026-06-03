"use client";

import * as React from "react";
import { useAuth } from "@/ui/user-management/providers/auth-provider";
import type { AuthenticatedUser } from "@/contexts/user-management/auth/domain/auth-gateway.port";
import type { AuthTokenClaims } from "@/contexts/user-management/auth/domain/token-claims";

/**
 * Shared session surface intended to be handed to child applications. In Phase 1 this
 * simply re-exposes the authenticated user/claims and a token accessor. In a later phase
 * the same shape can be serialized across an iframe/postMessage boundary or injected into
 * a Module Federation remote without changing consumers.
 */
export interface ShellSession {
  user: AuthenticatedUser | null;
  claims: AuthTokenClaims | null;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
}

const ShellSessionContext = React.createContext<ShellSession | null>(null);

export function ShellSessionProvider({ children }: { children: React.ReactNode }) {
  const { user, claims, loading, getIdToken } = useAuth();

  const value = React.useMemo<ShellSession>(
    () => ({ user, claims, loading, getIdToken }),
    [user, claims, loading, getIdToken]
  );

  return <ShellSessionContext.Provider value={value}>{children}</ShellSessionContext.Provider>;
}

export function useShellSession(): ShellSession {
  const ctx = React.useContext(ShellSessionContext);
  if (!ctx) {
    throw new Error("useShellSession must be used within ShellSessionProvider");
  }
  return ctx;
}

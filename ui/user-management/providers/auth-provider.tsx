"use client";

import * as React from "react";
import type { AuthenticatedUser } from "@/contexts/user-management/auth/domain/auth-gateway.port";
import type { AuthTokenClaims } from "@/contexts/user-management/auth/domain/token-claims";
import { authSessionService } from "@/contexts/user-management/auth/application/auth-client.facade";
import {
  clearSharedPlatformCookies,
  syncPlatformTokenCookie,
} from "@/lib/platform-auth/platform-shared-cookies";

type AuthContextValue = {
  user: AuthenticatedUser | null;
  claims: AuthTokenClaims | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
  const [claims, setClaims] = React.useState<AuthTokenClaims | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsub = authSessionService.subscribe((state) => {
      setUser(state.user);
      setClaims(state.claims);
      setLoading(false);

      if (state.user) {
        void authSessionService.getIdToken().then((token) => {
          if (token) syncPlatformTokenCookie(token);
        });
      } else {
        clearSharedPlatformCookies();
      }
    });
    return unsub;
  }, []);

  const signOut = React.useCallback(async () => {
    await authSessionService.signOutAndClearPresence();
    setUser(null);
    setClaims(null);
  }, []);

  const refreshClaims = React.useCallback(async () => {
    const state = await authSessionService.refreshSessionClaims();
    setUser(state.user);
    setClaims(state.claims);
    const token = await authSessionService.getIdToken();
    if (token) syncPlatformTokenCookie(token);
  }, []);

  const getIdToken = React.useCallback(() => authSessionService.getIdToken(), []);

  const value = React.useMemo(
    () => ({
      user,
      claims,
      loading,
      signOut,
      refreshClaims,
      getIdToken,
    }),
    [user, claims, loading, signOut, refreshClaims, getIdToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  ProductLoginView,
  type ProductLoginConfig,
} from "@/ui/user-management/views/ProductLogin/ProductLoginView";
import { signInWithEmailPasswordService } from "@/contexts/user-management/auth/application/auth-client.facade";
import { setPresenceSession } from "@/lib/auth/presence-session-client";
import {
  clearLogoutPendingCookie,
  clearPlatformReturnToCookie,
  readLogoutPendingCookie,
  syncPlatformTokenCookie,
} from "@/lib/platform-auth/platform-shared-cookies";
import { useAuth } from "@/ui/user-management/providers/auth-provider";
import { SHELL_AUTH_BRAND_BASE } from "@/config/auth/shell-auth-brand";

export function LoginView() {
  const router = useRouter();
  const { user, loading, getIdToken, signOut } = useAuth();
  const [bootstrapped, setBootstrapped] = React.useState(false);

  // Child logout sets a short-lived cookie; clear shell session before login UI.
  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      clearPlatformReturnToCookie();
      if (readLogoutPendingCookie()) {
        clearLogoutPendingCookie();
        await signOut();
      }
      if (!cancelled) setBootstrapped(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  const completeLogin = React.useCallback(async () => {
    await setPresenceSession();
    const token = await getIdToken();
    if (token) syncPlatformTokenCookie(token);
    clearPlatformReturnToCookie();
    router.replace("/");
  }, [getIdToken, router]);

  React.useEffect(() => {
    if (!bootstrapped || loading || !user) return;
    void completeLogin();
  }, [bootstrapped, loading, user, completeLogin]);

  const config: ProductLoginConfig = React.useMemo(
    () => ({
      ...SHELL_AUTH_BRAND_BASE,
      welcomeText: "Welcome back. Please sign in to continue.",
      signInWithEmailAndPassword: async (email, password) => {
        await signInWithEmailPasswordService.signInWithPresenceSession(email, password);
        await completeLogin();
      },
    }),
    [completeLogin],
  );

  return <ProductLoginView config={config} />;
}

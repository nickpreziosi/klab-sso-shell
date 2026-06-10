"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ProductLoginView,
  type ProductLoginConfig,
} from "@/ui/user-management/views/ProductLogin/ProductLoginView";
import { createSignInService } from "@/contexts/user-management/auth/application/auth-client.facade";
import { setPresenceSession } from "@/lib/auth/presence-session-client";
import { useAuth } from "@/ui/user-management/providers/auth-provider";
import { SHELL_AUTH_BRAND_BASE } from "@/config/auth/shell-auth-brand";

const POST_LOGIN_PATH = "/";

/**
 * Only allow root-relative destinations (e.g. `/krisk/cases`) so `?next=` can't
 * redirect off-origin. Zone apps send users here with their in-app path.
 */
function sanitizeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const signInService = React.useMemo(() => createSignInService(), []);
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  const navigateAfterLogin = React.useCallback(() => {
    if (nextPath) {
      // Destination may belong to another zone — always hard navigate.
      window.location.assign(nextPath);
    } else {
      router.replace(POST_LOGIN_PATH);
    }
  }, [nextPath, router]);

  React.useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    // The Firebase user can exist while the httpOnly presence cookie doesn't
    // (auth state updates before POST /api/auth/session finishes, and our hard
    // navigation would abort it). Re-establish the cookie (idempotent) before
    // leaving, otherwise middleware bounces straight back here in a loop.
    void setPresenceSession()
      .then(() => {
        if (!cancelled) navigateAfterLogin();
      })
      .catch((e) => {
        console.error("Failed to establish presence session", e);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user, navigateAfterLogin]);

  const config: ProductLoginConfig = React.useMemo(
    () => ({
      ...SHELL_AUTH_BRAND_BASE,
      welcomeText: "Welcome back. Please sign in to continue.",
      signInWithEmailAndPassword: async (email, password) => {
        const result = await signInService.signInWithPresenceSession(email, password);
        if (result.statusCode >= 200 && result.statusCode < 300) {
          navigateAfterLogin();
        } else {
          throw new Error(result.errors[0] ?? "Sign in failed.");
        }
      },
    }),
    [navigateAfterLogin, signInService]
  );

  return <ProductLoginView config={config} />;
}

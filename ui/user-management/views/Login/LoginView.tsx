"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  ProductLoginView,
  type ProductLoginConfig,
} from "@/ui/user-management/views/ProductLogin/ProductLoginView";
import { signInWithEmailPasswordService } from "@/contexts/user-management/auth/application/auth-client.facade";
import { useAuth } from "@/ui/user-management/providers/auth-provider";
import { SHELL_AUTH_BRAND_BASE } from "@/config/auth/shell-auth-brand";

const POST_LOGIN_PATH = "/";

export function LoginView() {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(POST_LOGIN_PATH);
    }
  }, [loading, user, router]);

  const config: ProductLoginConfig = React.useMemo(
    () => ({
      ...SHELL_AUTH_BRAND_BASE,
      welcomeText: "Welcome back. Please sign in to continue.",
      signInWithEmailAndPassword: async (email, password) => {
        await signInWithEmailPasswordService.signInWithPresenceSession(email, password);
        router.replace(POST_LOGIN_PATH);
      },
    }),
    [router]
  );

  return <ProductLoginView config={config} />;
}

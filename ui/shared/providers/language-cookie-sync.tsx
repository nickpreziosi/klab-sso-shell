"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  APP_LANGUAGE_COOKIE,
  getStoredAppLanguage,
  persistAppLanguage,
} from "@/lib/app-languages";

function readLanguageCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${APP_LANGUAGE_COOKIE}=([^;]*)`));
  const raw = match?.[1];
  return raw ? decodeURIComponent(raw) : null;
}

/**
 * Aligns the `klab-language` cookie with localStorage so server-rendered next-intl matches
 * the language chosen on this device.
 */
export function LanguageCookieSync() {
  const router = useRouter();

  React.useEffect(() => {
    const stored = getStoredAppLanguage();
    const cookie = readLanguageCookie();
    if (cookie !== stored) {
      persistAppLanguage(stored);
      router.refresh();
    }
  }, [router]);

  return null;
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  APP_LANGUAGE_COOKIE,
  APP_LANGUAGE_STORAGE_KEY,
  persistAppLanguage,
  resolveAppLocaleFromCookieValue,
} from "@/lib/app-languages";
import { readPlatformPreferenceCookie } from "@/lib/platform-preferences/shared-cookies";

/** Aligns server locale with the shared platform cookie when they diverge. */
export function LanguageCookieSync({ serverLocale }: { serverLocale: string }) {
  const router = useRouter();

  React.useLayoutEffect(() => {
    const cookieLang = resolveAppLocaleFromCookieValue(
      readPlatformPreferenceCookie(APP_LANGUAGE_COOKIE) ?? undefined,
    );

    try {
      window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, cookieLang);
    } catch {
      // ignore
    }

    if (cookieLang !== resolveAppLocaleFromCookieValue(serverLocale)) {
      persistAppLanguage(cookieLang);
      router.refresh();
    }
  }, [router, serverLocale]);

  return null;
}

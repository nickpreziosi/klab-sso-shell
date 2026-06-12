"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  APP_LANGUAGE_COOKIE,
  persistAppLanguage,
  resolveAppLocaleFromCookieValue,
} from "@/lib/app-languages";
import { readPlatformPreferenceCookie } from "@/lib/platform-preferences/shared-cookies";

export function LanguageCookieSync({ serverLocale }: { serverLocale: string }) {
  const router = useRouter();

  React.useEffect(() => {
    const cookieLang = resolveAppLocaleFromCookieValue(
      readPlatformPreferenceCookie(APP_LANGUAGE_COOKIE) ?? undefined,
    );
    if (cookieLang !== resolveAppLocaleFromCookieValue(serverLocale)) {
      persistAppLanguage(cookieLang);
      router.refresh();
    }
  }, [router, serverLocale]);

  return null;
}

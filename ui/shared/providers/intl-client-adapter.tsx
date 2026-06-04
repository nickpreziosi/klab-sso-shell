"use client";

import * as React from "react";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { useAppLanguage } from "@/ui/shared/contexts/app-language-context";
import type { AppLanguageCode } from "@/lib/app-languages";

interface IntlClientAdapterProps {
  initialLocale: string;
  initialMessages: AbstractIntlMessages;
  /**
   * Optional post-processing step applied to raw messages after fetch
   * (e.g. brand-token substitution). Must be a stable reference (module-level
   * function or memoised callback) to avoid spurious reloads.
   */
  processMessages?: (locale: AppLanguageCode, raw: AbstractIntlMessages) => AbstractIntlMessages;
  children: React.ReactNode;
}

/**
 * Sits inside AppLanguageProvider and owns the NextIntlClientProvider.
 * When the user picks a new language, it fetches the locale JSON from
 * /locales/{lang}.json (Next.js static serving from public/) and swaps
 * the provider's messages without a server round-trip.
 */
export function IntlClientAdapter({
  initialLocale,
  initialMessages,
  processMessages,
  children,
}: IntlClientAdapterProps) {
  const { language } = useAppLanguage();
  const [locale, setLocale] = React.useState(initialLocale);
  const [messages, setMessages] = React.useState(initialMessages);
  // Tracks the locale whose messages are currently loaded so we only fetch on real changes.
  const loadedLocaleRef = React.useRef(initialLocale);

  React.useEffect(() => {
    if (language === loadedLocaleRef.current) return;

    fetch(`/locales/${language}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load locale ${language}`);
        return res.json() as Promise<AbstractIntlMessages>;
      })
      .then((raw) => {
        const processed = processMessages
          ? processMessages(language as AppLanguageCode, raw)
          : raw;
        loadedLocaleRef.current = language;
        setLocale(language);
        setMessages(processed);
      })
      .catch(() => {
        // Keep the current messages on network/parse failure.
      });
  }, [language, processMessages]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

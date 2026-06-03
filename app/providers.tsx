"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { AuthProvider } from "@/ui/user-management/providers/auth-provider";
import { AppLanguageProvider } from "@/ui/shared/contexts/app-language-context";
import { DocumentDirectionProvider, ThemeProvider } from "@k-lab/components";

export interface AppProvidersProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}

export function AppProviders({ locale, messages, children }: AppProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider defaultTheme="system" storageKey="k-lab-components-theme">
        <AppLanguageProvider>
          <DocumentDirectionProvider>
            <AuthProvider>{children}</AuthProvider>
          </DocumentDirectionProvider>
        </AppLanguageProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

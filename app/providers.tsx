"use client";

import type { AbstractIntlMessages } from "next-intl";
import { AuthProvider } from "@/ui/user-management/providers/auth-provider";
import { ShellRoleProvider } from "@/ui/shell/providers/shell-role-provider";
import { AppLanguageProvider } from "@/ui/shared/contexts/app-language-context";
import { DocumentDirectionProvider, ThemeProvider } from "@k-lab/components";
import { IntlClientAdapter } from "@/ui/shared/providers/intl-client-adapter";
import { substituteBrandInMessages } from "@/lib/i18n/brand-substitution";
import { SHELL_I18N_BRAND } from "@/config/i18n/shell-brand";
import type { AppLanguageCode } from "@/lib/app-languages";

// Stable module-level callback — passed to IntlClientAdapter so it never
// triggers a spurious re-fetch due to a changed function reference.
function processShellMessages(
  _locale: AppLanguageCode,
  raw: AbstractIntlMessages,
): AbstractIntlMessages {
  return substituteBrandInMessages(
    structuredClone(raw),
    SHELL_I18N_BRAND,
  ) as AbstractIntlMessages;
}

export interface AppProvidersProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}

export function AppProviders({ locale, messages, children }: AppProvidersProps) {
  return (
    <AppLanguageProvider initialLanguage={locale as AppLanguageCode}>
      <IntlClientAdapter
        initialLocale={locale}
        initialMessages={messages}
        processMessages={processShellMessages}
      >
        <ThemeProvider defaultTheme="system" storageKey="k-lab-components-theme">
          <DocumentDirectionProvider>
            <AuthProvider>
              <ShellRoleProvider>{children}</ShellRoleProvider>
            </AuthProvider>
          </DocumentDirectionProvider>
        </ThemeProvider>
      </IntlClientAdapter>
    </AppLanguageProvider>
  );
}

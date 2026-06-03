import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@k-lab/components";
import { Sora } from "next/font/google";
import { AppProviders } from "./providers";
import { ShellLayoutClient } from "@/ui/shell/containers/ShellLayout/ShellLayoutClient";
import { LanguageCookieSync } from "@/ui/shared/providers/language-cookie-sync";
import { getDirForAppLanguage } from "@/lib/app-languages";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "K-Lab Shell",
  description: "Single sign-on application shell for the K-Lab suite.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = getDirForAppLanguage(locale);
  const messages = await getMessages();
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("k-lab-sidebar-collapsed");
  const initialSidebarCollapsed = sidebarCookie?.value === "true";

  return (
    <html lang={locale} dir={dir} className={sora.variable} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- intentional blocking document init to prevent theme flicker */}
        <script src="/scripts/shell-document-init.js" />
      </head>
      <body className="font-sans antialiased">
        <AppProviders locale={locale} messages={messages}>
          <LanguageCookieSync />
          <ShellLayoutClient initialSidebarCollapsed={initialSidebarCollapsed}>
            {children}
          </ShellLayoutClient>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

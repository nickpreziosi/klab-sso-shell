"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  APP_LANGUAGE_STORAGE_KEY,
  type AppLanguageCode,
  getStoredAppLanguage,
  persistAppLanguage,
} from "@/lib/app-languages";

type AppLanguageContextValue = {
  language: AppLanguageCode;
  setLanguage: (code: AppLanguageCode) => void;
};

const AppLanguageContext = React.createContext<AppLanguageContextValue | null>(null);

export function AppLanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: React.ReactNode;
  initialLanguage?: AppLanguageCode;
}) {
  const router = useRouter();
  const [language, setLanguageState] = React.useState<AppLanguageCode>(initialLanguage);

  React.useEffect(() => {
    const stored = getStoredAppLanguage();
    if (stored !== language) setLanguageState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === APP_LANGUAGE_STORAGE_KEY) {
        setLanguageState(getStoredAppLanguage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLanguage = React.useCallback(
    (code: AppLanguageCode) => {
      // Persists to the shared `klab-language` cookie + localStorage; child
      // zones read the same keys (same origin) on their next document load.
      setLanguageState(code);
      persistAppLanguage(code);
      router.refresh();
    },
    [router],
  );

  const value = React.useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage(): AppLanguageContextValue {
  const ctx = React.useContext(AppLanguageContext);
  if (!ctx) {
    throw new Error("useAppLanguage must be used within AppLanguageProvider");
  }
  return ctx;
}

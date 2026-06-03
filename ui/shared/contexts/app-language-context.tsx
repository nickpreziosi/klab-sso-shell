"use client";

import * as React from "react";
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

export function AppLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<AppLanguageCode>("en");

  React.useEffect(() => {
    setLanguageState(getStoredAppLanguage());
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

  const setLanguage = React.useCallback((code: AppLanguageCode) => {
    setLanguageState(code);
    persistAppLanguage(code);
  }, []);

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

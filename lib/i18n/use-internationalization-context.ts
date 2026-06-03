"use client";

import * as React from "react";
import { useLocale, useMessages } from "next-intl";
import { useRouter } from "next/navigation";
import {
  APP_LANGUAGE_OPTIONS,
  persistAppLanguage,
  type AppLanguageCode,
} from "@/lib/app-languages";

function getNestedString(messages: Record<string, unknown>, path: string[]): string | undefined {
  let cur: unknown = messages;
  for (const segment of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[segment];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolateParams(text: string, params?: Record<string, unknown>): string {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    params[key] !== undefined ? String(params[key]) : match,
  );
}

/** e.g. `("companyNameHeader", "dataEntry.tableColumns")` → `dataEntry.tableColumns.companyNameHeader` */
function buildTranslationPath(key: string, namespace?: string): string[] {
  const keyPath = key.split(".").filter(Boolean);
  if (!namespace) return keyPath;
  return [...namespace.split(".").filter(Boolean), ...keyPath];
}

/**
 * Drop-in replacement for `@k-lab/components` `useInternationalizationContext`.
 * Backed by next-intl messages loaded in `i18n/request.ts`.
 */
export function useInternationalizationContext() {
  const locale = useLocale();
  const messages = useMessages() as Record<string, unknown>;
  const router = useRouter();

  const t = React.useCallback(
    (key: string, namespace?: string, params?: Record<string, unknown>): string => {
      const path = buildTranslationPath(key, namespace);
      const value = getNestedString(messages, path);
      if (!value) return key;
      return interpolateParams(value, params);
    },
    [messages],
  );

  const supportedLanguages = React.useMemo(
    () =>
      APP_LANGUAGE_OPTIONS.map((lang) => ({
        code: lang.code,
        name: lang.label,
        flag: lang.flag,
      })),
    [],
  );

  const changeLanguage = React.useCallback(
    async (language: string) => {
      persistAppLanguage(language as AppLanguageCode);
      router.refresh();
    },
    [router],
  );

  return {
    currentLanguage: locale,
    supportedLanguages,
    t,
    changeLanguage,
    isLoading: false,
    error: null,
    mounted: true,
    config: null,
    translations: {},
    translationsReady: true,
    translate: async (key: string, namespace?: string, params?: Record<string, unknown>) =>
      t(key, namespace, params),
    translateWithFallback: async (
      key: string,
      fallback: string,
      namespace?: string,
      params?: Record<string, unknown>,
    ) => {
      const value = t(key, namespace, params);
      return value === key ? fallback : value;
    },
    hasTranslation: async (key: string, namespace?: string) => {
      const path = buildTranslationPath(key, namespace);
      return getNestedString(messages, path) !== undefined;
    },
    getTranslationResult: async (key: string, namespace?: string, params?: Record<string, unknown>) => {
      const value = t(key, namespace, params);
      return { value, exists: value !== key, key };
    },
    batchTranslate: async (keys: string[], namespace?: string, params?: Record<string, unknown>) => {
      const results: Record<string, string> = {};
      for (const key of keys) {
        results[key] = t(key, namespace, params);
      }
      return results;
    },
    repository: null as unknown,
  };
}

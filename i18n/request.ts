import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  APP_LANGUAGE_COOKIE,
  resolveAppLocaleFromCookieValue,
  type AppLanguageCode,
} from "@/lib/app-languages";
import { SHELL_I18N_BRAND } from "@/config/i18n/shell-brand";
import { substituteBrandInMessages } from "@/lib/i18n/brand-substitution";

async function loadMessages(locale: AppLanguageCode) {
  switch (locale) {
    case "es":
      return (await import("../public/locales/es.json")).default;
    case "pt":
      return (await import("../public/locales/pt.json")).default;
    case "ar":
      return (await import("../public/locales/ar.json")).default;
    default:
      return (await import("../public/locales/en.json")).default;
  }
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveAppLocaleFromCookieValue(store.get(APP_LANGUAGE_COOKIE)?.value);
  const { brand, brandShort, product } = SHELL_I18N_BRAND;

  const raw = await loadMessages(locale);
  const messages = substituteBrandInMessages(structuredClone(raw), {
    brand,
    brandShort,
    product,
  });

  return {
    locale,
    messages: messages as Record<string, unknown>,
  };
});

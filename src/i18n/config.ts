import type { Locale } from "@/content/post-types";

export const locales = ["id", "en"] as const satisfies readonly Locale[];
export const defaultLocale: Locale = "id";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}

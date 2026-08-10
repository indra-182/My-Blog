import type { Locale } from "@/content/post-types";
import en from "./messages/en.json";
import id from "./messages/id.json";

export const dictionaries = { id, en } as const;
export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

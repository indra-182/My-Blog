"use client";

import Link from "next/link";
import { LuLanguages } from "react-icons/lu";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";
import { otherLocale } from "@/i18n/config";

export function LocaleSwitcher({
  locale,
  targetPath,
}: {
  locale: Locale;
  dictionary: Dictionary;
  targetPath?: string | null;
}) {
  const pathname = usePathname();
  const targetLocale = otherLocale(locale);
  if (pathname && /^\/(id|en)\/blog(?:\/|$)/.test(pathname)) return null;

  const href =
    targetPath === null
      ? `/${targetLocale}?translation=unavailable`
      : (targetPath ?? `/${targetLocale}`);
  const label = targetLocale === "id" ? "Bahasa Indonesia" : "English";

  return (
    <Link
      className="locale-button"
      href={href}
      aria-label={`Switch language to ${label}`}
    >
      <LuLanguages size={16} aria-hidden="true" />
      <span>{targetLocale.toUpperCase()}</span>
    </Link>
  );
}

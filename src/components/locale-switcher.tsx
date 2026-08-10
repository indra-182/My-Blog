"use client";

import Link from "next/link";
import { ChevronDown, Languages } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

export function LocaleSwitcher({ locale, dictionary, targetPath }: { locale: Locale; dictionary: Dictionary; targetPath?: string | null }) {
  const [open, setOpen] = useState(false);
  const targetLocale = locale === "id" ? "en" : "id";
  const href = targetPath === null ? `/${targetLocale}?translation=unavailable` : targetPath ?? `/${targetLocale}`;
  return (
    <div className="locale-switcher">
      <button type="button" className="locale-button" aria-label={dictionary.navigation.language} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <Languages size={16} aria-hidden="true" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open ? (
        <Link className="locale-menu" href={href} onClick={() => setOpen(false)}>
          {targetLocale === "en" ? "English" : "Bahasa Indonesia"}
        </Link>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";
import { useState } from "react";
import type { Locale } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ??
  "https://portfolio-indradev.vercel.app/";

export function MobileNavigation({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="icon-button"
        aria-label={
          open ? dictionary.navigation.close : dictionary.navigation.menu
        }
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <LuX size={20} aria-hidden="true" />
        ) : (
          <LuMenu size={20} aria-hidden="true" />
        )}
      </button>
      {open ? (
        <nav className="mobile-nav-panel" aria-label="Mobile navigation">
          <Link href={portfolioUrl} onClick={() => setOpen(false)}>
            {dictionary.navigation.portfolio}
          </Link>
          <Link href={`/${locale}`} onClick={() => setOpen(false)}>
            {dictionary.navigation.blog}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}

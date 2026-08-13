"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "@/components/icons";
import type { Dictionary } from "@/i18n/dictionaries";

const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ??
  "https://portfolio-indradev.vercel.app/";

export function MobileNavigation({ dictionary }: { dictionary: Dictionary }) {
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
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
      </button>
      {open ? (
        <nav className="mobile-nav-panel" aria-label="Navigasi seluler">
          <Link href={portfolioUrl} onClick={() => setOpen(false)}>
            {dictionary.navigation.portfolio}
          </Link>
          <Link href="/" onClick={() => setOpen(false)}>
            {dictionary.navigation.blog}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { Menu, X } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";

export function MobileNavigation({ portfolioUrl }: { portfolioUrl: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function closeDialog() {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }

  function restoreFocus() {
    triggerRef.current?.focus();
  }

  return (
    <div className="mobile-navigation">
      <button
        ref={triggerRef}
        type="button"
        className="icon-button"
        aria-label={dictionary.navigation.menu}
        aria-haspopup="dialog"
        aria-controls="mobile-navigation-dialog"
        onClick={openDialog}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        id="mobile-navigation-dialog"
        className="mobile-navigation-dialog"
        aria-labelledby="mobile-navigation-title"
        onClose={restoreFocus}
      >
        <div className="mobile-navigation-heading">
          <div id="mobile-navigation-title" className="site-wordmark">
            INDRA<span>.</span>DEV
          </div>
          <p>Navigasi INDRA.DEV</p>
        </div>
        <button
          type="button"
          className="icon-button mobile-navigation-close"
          aria-label={dictionary.navigation.close}
          title={dictionary.navigation.close}
          onClick={closeDialog}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <nav className="mobile-navigation-links" aria-label="Navigasi seluler">
          <Link href={portfolioUrl} onClick={closeDialog}>
            {dictionary.navigation.portfolio}
          </Link>
          <Link href="/" aria-current="page" onClick={closeDialog}>
            {dictionary.navigation.blog}
          </Link>
        </nav>
      </dialog>
    </div>
  );
}

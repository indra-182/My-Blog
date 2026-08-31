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
    <div className="md:hidden">
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
        <div className="grid gap-[0.65rem] border-b border-border pb-5">
          <div id="mobile-navigation-title" className="site-wordmark">
            INDRA<span>.</span>DEV
          </div>
          <p className="m-0 text-[0.85rem] leading-[1.5] text-muted-foreground">
            Menu INDRA.DEV
          </p>
        </div>
        <button
          type="button"
          className="icon-button absolute top-4 right-4"
          aria-label={dictionary.navigation.close}
          title={dictionary.navigation.close}
          onClick={closeDialog}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <nav className="flex flex-col" aria-label="Menu seluler">
          <a
            className="flex min-h-14 items-center border-b border-border py-4 text-[1.1rem] font-[750] text-foreground hover:text-cue-rose focus-visible:text-cue-rose aria-[current=page]:text-cue-rose"
            href={portfolioUrl}
            onClick={closeDialog}
          >
            {dictionary.navigation.portfolio}
          </a>
          <Link
            className="flex min-h-14 items-center border-b border-border py-4 text-[1.1rem] font-[750] text-foreground hover:text-cue-rose focus-visible:text-cue-rose aria-[current=page]:text-cue-rose"
            href="/"
            aria-current="page"
            onClick={closeDialog}
          >
            {dictionary.navigation.blog}
          </Link>
        </nav>
      </dialog>
    </div>
  );
}

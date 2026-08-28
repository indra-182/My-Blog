"use client";

import { useEffect, useRef, useState } from "react";
import dictionary from "@/i18n/messages/id.json";
import { Check, Copy, Share2 } from "@/components/icons";

const copiedResetMs = 1800;

export function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(copiedTimeoutRef.current);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, copiedResetMs);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, url: window.location.href });
    } catch (error) {
      // Cancelling the native share sheet is not a failure.
      if ((error as { name?: string })?.name === "AbortError") return;
      await copyLink();
    }
  }

  function shareToLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section
      className="mt-16 flex items-center justify-between gap-5 border-t border-border pt-7 max-[639px]:flex-col max-[639px]:items-start"
      aria-labelledby="share-title"
    >
      <h2
        id="share-title"
        className="m-0 mb-[1.1rem] text-[clamp(1.4rem,2.5vw,2.25rem)] font-[750] leading-[1.05] tracking-[-0.04em]"
      >
        {dictionary.article.share}
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex min-h-11 items-center gap-[0.4rem] rounded-[var(--radius-sm)] border border-border bg-transparent px-[0.8rem] text-[0.75rem] text-muted-foreground transition-[border-color,color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:bg-surface hover:text-foreground focus-visible:border-cue-rose focus-visible:bg-surface focus-visible:text-foreground"
          type="button"
          onClick={share}
        >
          <Share2 size={15} aria-hidden="true" />{" "}
          {dictionary.article.shareAction}
        </button>
        <button
          className="inline-flex min-h-11 items-center gap-[0.4rem] rounded-[var(--radius-sm)] border border-border bg-transparent px-[0.8rem] text-[0.75rem] text-muted-foreground transition-[border-color,color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:bg-surface hover:text-foreground focus-visible:border-cue-rose focus-visible:bg-surface focus-visible:text-foreground"
          type="button"
          onClick={shareToLinkedIn}
        >
          LinkedIn
        </button>
        <button
          className="inline-flex min-h-11 items-center gap-[0.4rem] rounded-[var(--radius-sm)] border border-border bg-transparent px-[0.8rem] text-[0.75rem] text-muted-foreground transition-[border-color,color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:bg-surface hover:text-foreground focus-visible:border-cue-rose focus-visible:bg-surface focus-visible:text-foreground"
          type="button"
          onClick={copyLink}
        >
          {copied ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Copy size={15} aria-hidden="true" />
          )}{" "}
          {copied ? dictionary.article.copied : dictionary.article.copyLink}
        </button>
      </div>
    </section>
  );
}

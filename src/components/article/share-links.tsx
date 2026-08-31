"use client";

import { Check, Copy, Share2 } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

const copiedResetMs = 1800;
const shareButtonClassName =
  "inline-flex min-h-11 items-center gap-[0.4rem] rounded-[var(--radius-sm)] border border-border bg-transparent px-[0.8rem] text-[0.75rem] text-muted-foreground transition-[border-color,color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:bg-surface hover:text-foreground focus-visible:border-cue-rose focus-visible:bg-surface focus-visible:text-foreground";

export function ShareLinks({ title }: { title: string }) {
  const { status, copy } = useCopyToClipboard(
    () => window.location.href,
    copiedResetMs,
  );

  async function share() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title, url: window.location.href });
    } catch (error) {
      // Cancelling the native share sheet is not a failure.
      if ((error as { name?: string })?.name === "AbortError") return;
      await copy();
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
        <button className={shareButtonClassName} type="button" onClick={share}>
          <Share2 size={15} aria-hidden="true" />{" "}
          {dictionary.article.shareAction}
        </button>
        <button
          className={shareButtonClassName}
          type="button"
          onClick={shareToLinkedIn}
        >
          LinkedIn
        </button>
        <button className={shareButtonClassName} type="button" onClick={copy}>
          {status === "copied" ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Copy size={15} aria-hidden="true" />
          )}{" "}
          {status === "copied"
            ? dictionary.article.copied
            : dictionary.article.copyLink}
        </button>
      </div>
    </section>
  );
}

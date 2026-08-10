"use client";

import { LuCheck, LuCopy, LuShare2 } from "react-icons/lu";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function ShareLinks({
  title,
  dictionary,
}: {
  title: string;
  dictionary: Dictionary;
}) {
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }
    await copyLink();
  }
  function shareToLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <section className="share-section" aria-labelledby="share-title">
      <h2 id="share-title">{dictionary.article.share}</h2>
      <div className="share-actions">
        <button type="button" onClick={share}>
          <LuShare2 size={15} aria-hidden="true" /> Share
        </button>
        <button type="button" onClick={shareToLinkedIn}>
          LinkedIn
        </button>
        <button type="button" onClick={copyLink}>
          {copied ? (
            <LuCheck size={15} aria-hidden="true" />
          ) : (
            <LuCopy size={15} aria-hidden="true" />
          )}{" "}
          {copied ? dictionary.article.copied : "Copy link"}
        </button>
      </div>
    </section>
  );
}

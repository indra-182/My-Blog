"use client";

import { LuCheck, LuCopy } from "react-icons/lu";
import { useState } from "react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function CodeBlock({
  code,
  highlightedCode,
  language,
  dictionary,
}: {
  code: string;
  highlightedCode?: ReactNode;
  language?: string;
  dictionary: Dictionary;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  }

  const label =
    status === "copied"
      ? dictionary.article.copied
      : dictionary.article.copyCode;
  return (
    <div className="code-block">
      {language ? <span className="code-label">{language}</span> : null}
      <pre>
        <code>{highlightedCode ?? code}</code>
      </pre>
      <button
        className="copy-code"
        type="button"
        onClick={copyCode}
        aria-label={label}
      >
        {status === "copied" ? (
          <LuCheck size={15} aria-hidden="true" />
        ) : (
          <LuCopy size={15} aria-hidden="true" />
        )}{" "}
        {label}
      </button>
      <div className="sr-only" aria-live="polite">
        {status === "failed"
          ? dictionary.article.copyFailed
          : status === "copied"
            ? dictionary.article.copied
            : ""}
      </div>
    </div>
  );
}

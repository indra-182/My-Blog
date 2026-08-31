"use client";

import type { ReactNode } from "react";
import { Check, Copy } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

const copiedResetMs = 2000;

export function CodeBlock({
  code,
  highlightedCode,
  language,
}: {
  code: string;
  highlightedCode?: ReactNode;
  language?: string;
}) {
  const { status, copy } = useCopyToClipboard(() => code, copiedResetMs);

  const label =
    status === "copied"
      ? dictionary.article.copied
      : dictionary.article.copyCode;
  return (
    <div className="relative my-[1.5em] overflow-hidden border border-[#44475a] bg-[#282a36] text-[#f8f8f2]">
      {language ? (
        <span className="absolute top-3 left-4 font-mono text-[0.65rem] font-[700] tracking-[0.12em] text-[#a6adb8] uppercase">
          {language}
        </span>
      ) : null}
      <pre className="m-0 overflow-x-auto border-0 bg-transparent p-[3rem_1.1rem_1.1rem] font-mono text-[0.82rem] leading-[1.7] text-inherit">
        <code className="grid min-w-max text-inherit">
          {highlightedCode ?? code}
        </code>
      </pre>
      <button
        className="absolute top-2 right-2 min-h-11 rounded-[var(--radius-sm)] border border-[#6272a4] bg-[#44475a] px-3 text-[0.72rem] text-[#f8f8f2] hover:border-[#ff79c6] hover:bg-[#6272a4] hover:text-white focus-visible:border-[#ff79c6] focus-visible:bg-[#6272a4] focus-visible:text-white"
        type="button"
        onClick={copy}
        aria-label={label}
      >
        {status === "copied" ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <Copy size={15} aria-hidden="true" />
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

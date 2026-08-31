"use client";

import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

export function useCopyToClipboard(getText: () => string, resetMs: number) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText());
      setStatus("copied");
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), resetMs);
    } catch {
      setStatus("failed");
    }
  }

  return { status, copy };
}

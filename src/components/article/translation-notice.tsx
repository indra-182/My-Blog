"use client";

import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function TranslationNotice({ dictionary }: { dictionary: Dictionary }) {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(searchParams.get("translation") === "unavailable");
  if (!visible) return null;
  return <div className="shell notice" role="status"><span>{dictionary.errors.translation}</span><button type="button" aria-label={dictionary.errors.dismiss} onClick={() => setVisible(false)}><X size={17} aria-hidden="true" /></button></div>;
}

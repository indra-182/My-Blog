"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getDictionary } from "@/i18n/dictionaries";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  const dictionary = getDictionary("id");
  return <main className="page-main"><div className="shell not-found"><div><div className="eyebrow">500</div><h1>Something went wrong</h1><p>{dictionary.errors.notFoundDescription}</p><button className="load-more" type="button" onClick={() => reset()}>{dictionary.errors.tryAgain}</button><br /><Link href="/id">{dictionary.errors.home}</Link></div></div></main>;
}

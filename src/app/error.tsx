"use client";

import Link from "next/link";
import { useEffect } from "react";
import dictionary from "@/i18n/messages/id.json";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <div className="shell route-state">
        <div>
          <div className="cue-label">500</div>
          <h1>{dictionary.errors.errorTitle}</h1>
          <p>{dictionary.errors.errorDescription}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button className="outline-button" type="button" onClick={reset}>
              {dictionary.errors.tryAgain}
            </button>
            <Link href="/">{dictionary.errors.home}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

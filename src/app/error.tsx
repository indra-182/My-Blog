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
    <main id="main-content" className="page-main">
      <div className="shell not-found">
        <div>
          <div className="eyebrow">500</div>
          <h1>{dictionary.errors.errorTitle}</h1>
          <p>{dictionary.errors.errorDescription}</p>
          <div className="error-actions">
            <button className="load-more" type="button" onClick={() => reset()}>
              {dictionary.errors.tryAgain}
            </button>
            <Link href="/">{dictionary.errors.home}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

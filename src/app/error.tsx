"use client";

import { useEffect } from "react";
import dictionary from "@/i18n/messages/id.json";
import { RouteState } from "@/components/route-state";

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
    <RouteState
      code="500"
      title={dictionary.errors.errorTitle}
      description={dictionary.errors.errorDescription}
      linkLabel={dictionary.errors.home}
    >
      <button className="outline-button" type="button" onClick={reset}>
        {dictionary.errors.tryAgain}
      </button>
    </RouteState>
  );
}

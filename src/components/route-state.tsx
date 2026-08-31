import type { ReactNode } from "react";
import Link from "next/link";

type RouteStateProps = {
  code: "404" | "500";
  title: string;
  description: string;
  linkLabel: string;
  children?: ReactNode;
};

export function RouteState({
  code,
  title,
  description,
  linkLabel,
  children,
}: RouteStateProps) {
  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <div className="shell route-state">
        <div>
          <div className="cue-label">{code}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {children}
            <Link href="/">{linkLabel}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

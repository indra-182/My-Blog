import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";

export default function NotFound() {
  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <div className="shell route-state">
        <div>
          <div className="cue-label">404</div>
          <h1>{dictionary.errors.pageNotFoundTitle}</h1>
          <p>{dictionary.errors.pageNotFoundDescription}</p>
          <Link href="/">{dictionary.errors.home}</Link>
        </div>
      </div>
    </main>
  );
}

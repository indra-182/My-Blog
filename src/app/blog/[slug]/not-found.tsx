import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";

export default function ArticleNotFound() {
  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <div className="shell route-state">
        <div>
          <div className="cue-label">404</div>
          <h1>{dictionary.errors.notFoundTitle}</h1>
          <p>{dictionary.errors.notFoundDescription}</p>
          <Link href="/">{dictionary.article.backToBlog}</Link>
        </div>
      </div>
    </main>
  );
}

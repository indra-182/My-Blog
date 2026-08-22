import Link from "next/link";
import dictionary from "@/i18n/messages/id.json";

export default function ArticleNotFound() {
  return (
    <main id="main-content" className="page-main">
      <div className="shell not-found">
        <div>
          <div className="eyebrow">404</div>
          <h1>{dictionary.errors.notFoundTitle}</h1>
          <p>{dictionary.errors.notFoundDescription}</p>
          <Link href="/">{dictionary.article.backToBlog}</Link>
        </div>
      </div>
    </main>
  );
}

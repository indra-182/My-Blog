import Link from "next/link";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";

export function SeriesNavigation({
  previous,
  next,
}: {
  previous: PostSummary | null;
  next: PostSummary | null;
}) {
  if (!previous && !next) return null;
  return (
    <nav className="series-nav" aria-label="Navigasi seri">
      {previous ? (
        <Link className="series-link" href={`/blog/${previous.slug}`}>
          <span>← {dictionary.article.previous}</span>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="series-link next" href={`/blog/${next.slug}`}>
          <span>{dictionary.article.next} →</span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

import Link from "next/link";
import type { PostSummary } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

export function SeriesNavigation({ previous, next, dictionary }: { previous: PostSummary | null; next: PostSummary | null; dictionary: Dictionary }) {
  if (!previous && !next) return null;
  return <nav className="series-nav" aria-label="Series navigation">
    {previous ? <Link className="series-link" href={`/${previous.locale}/blog/${previous.slug}`}><span>← {dictionary.article.previous}</span><strong>{previous.title}</strong></Link> : <span />}
    {next ? <Link className="series-link next" href={`/${next.locale}/blog/${next.slug}`}><span>{dictionary.article.next} →</span><strong>{next.title}</strong></Link> : <span />}
  </nav>;
}

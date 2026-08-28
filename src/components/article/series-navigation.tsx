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
    <nav
      className="grid grid-cols-2 gap-4 max-[639px]:grid-cols-1"
      aria-label="Pindah antar tulisan dalam seri"
    >
      {previous ? (
        <Link
          className="grid min-h-28 content-start gap-2 border border-border p-4 transition-[border-color,color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:text-cue-rose focus-visible:border-cue-rose focus-visible:text-cue-rose"
          href={`/blog/${previous.slug}`}
        >
          <span className="font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase">
            ← {dictionary.article.previous}
          </span>
          <strong className="text-[0.95rem] font-[750] text-foreground">
            {previous.title}
          </strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          className="grid min-h-28 content-start gap-2 border border-border p-4 text-right transition-[border-color,color] duration-[var(--motion-fast)] ease hover:border-cue-rose hover:text-cue-rose focus-visible:border-cue-rose focus-visible:text-cue-rose max-[639px]:text-left"
          href={`/blog/${next.slug}`}
        >
          <span className="font-mono text-[0.68rem] tracking-[0.08em] text-muted-foreground uppercase">
            {dictionary.article.next} →
          </span>
          <strong className="text-[0.95rem] font-[750] text-foreground">
            {next.title}
          </strong>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

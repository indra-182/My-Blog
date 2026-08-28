import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { formatDate } from "@/lib/format-date";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group grid grid-cols-[minmax(0,1fr)_auto] gap-8 border-t border-border py-7 first:border-t-0 max-[639px]:gap-4">
      <div>
        <div className="metadata-row">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span>·</span>
          <span>
            {post.readingTimeMinutes} {dictionary.article.readingTime}
          </span>
          {post.series ? (
            <>
              <span>·</span>
              <span>{post.series}</span>
            </>
          ) : null}
        </div>
        <h2 className="m-0 mt-2 mb-[0.65rem] max-w-[26ch] text-[clamp(1.4rem,2.5vw,2.25rem)] font-[750] leading-[1.05] tracking-[-0.04em]">
          <Link
            className="underline decoration-transparent decoration-[0.08em] transition-[color,text-decoration-color] duration-[var(--motion-fast)] ease hover:text-cue-rose hover:decoration-current focus-visible:text-cue-rose focus-visible:decoration-current"
            href={`/blog/${post.slug}`}
          >
            {post.title}
          </Link>
        </h2>
        <p className="m-0 max-w-[64ch] leading-[1.65] text-muted-foreground">
          {post.description}
        </p>
        <div className="topic-list">
          {post.topics.map((topic) => (
            <span className="topic" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center text-muted-foreground">
        <ArrowUpRight
          className="transition-[transform,color] duration-[var(--motion-fast)] ease group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cue-rose group-focus-within:translate-x-1 group-focus-within:-translate-y-1 group-focus-within:text-cue-rose"
          size={20}
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

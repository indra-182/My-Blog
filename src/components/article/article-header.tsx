import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { formatDate } from "@/lib/format-date";

export function ArticleHeader({ post }: { post: PostSummary }) {
  return (
    <header
      id="article-header"
      className="max-w-5xl pt-[clamp(4rem,8vw,7rem)] pb-[clamp(3rem,6vw,5rem)]"
    >
      <div className="topic-list">
        {post.topics.map((topic) => (
          <span className="topic" key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <h1
        id="article-title"
        className="m-0 mt-5 mb-5 max-w-[18ch] scroll-mt-[calc(4.75rem+1rem)] text-[clamp(2.3rem,6vw,4.75rem)] font-[800] leading-[0.95] tracking-[-0.04em] text-balance"
        tabIndex={-1}
      >
        {post.title}
      </h1>
      <p className="m-0 max-w-[62ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.65] text-muted-foreground">
        {post.description}
      </p>
      <div className="metadata-row mt-7">
        <span>
          {dictionary.article.published}{" "}
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, "long")}
          </time>
        </span>
        <span>·</span>
        <span>
          {post.readingTimeMinutes} {dictionary.article.readingTime}
        </span>
        {post.updatedAt ? (
          <>
            <span>·</span>
            <span>
              {dictionary.article.updated}{" "}
              <time dateTime={post.updatedAt}>
                {formatDate(post.updatedAt, "long")}
              </time>
            </span>
          </>
        ) : null}
      </div>
      {post.series ? (
        <div className="mt-6 flex flex-wrap gap-2 border-y border-border py-[0.85rem] text-[0.88rem] text-muted-foreground">
          <span className="cue-label">{dictionary.article.partOf}</span>{" "}
          <span>
            {post.series} · {post.seriesOrder}
          </span>
        </div>
      ) : null}
    </header>
  );
}

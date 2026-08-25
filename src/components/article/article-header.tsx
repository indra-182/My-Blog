import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { formatDate } from "@/lib/format-date";

export function ArticleHeader({ post }: { post: PostSummary }) {
  return (
    <header id="article-header" className="article-header">
      <div className="topic-list">
        {post.topics.map((topic) => (
          <span className="topic" key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <h1 id="article-title" tabIndex={-1}>
        {post.title}
      </h1>
      <p className="article-description">{post.description}</p>
      <div className="article-metadata">
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
        <div className="article-series">
          <span className="meta-label">{dictionary.article.partOf}</span>{" "}
          <span>
            {post.series} · {post.seriesOrder}
          </span>
        </div>
      ) : null}
    </header>
  );
}

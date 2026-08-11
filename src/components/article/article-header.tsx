import type { PostSummary } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function ArticleHeader({
  post,
  dictionary,
}: {
  post: PostSummary;
  dictionary: Dictionary;
}) {
  return (
    <header className="article-header">
      <div className="topic-list">
        {post.topics.map((topic) => (
          <span className="topic" key={topic}>
            {topic}
          </span>
        ))}
      </div>
      <h1>{post.title}</h1>
      <p className="article-description">{post.description}</p>
      <div className="article-metadata">
        <span>
          {dictionary.article.published} {formatDate(post.publishedAt)}
        </span>
        <span>·</span>
        <span>
          {post.readingTimeMinutes} {dictionary.article.readingTime}
        </span>
        {post.updatedAt ? (
          <>
            <span>·</span>
            <span>
              {dictionary.article.updated} {formatDate(post.updatedAt)}
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

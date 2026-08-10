import Link from "next/link";
import type { Locale, PostSummary } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function ArticleHeader({
  post,
  dictionary,
  translationPath,
}: {
  post: PostSummary;
  dictionary: Dictionary;
  translationPath: string | null;
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
          {dictionary.article.published}{" "}
          {formatDate(post.publishedAt, post.locale)}
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
              {formatDate(post.updatedAt, post.locale)}
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
      {translationPath ? (
        <p className="translation-link">
          <Link href={translationPath}>
            {post.locale === "id"
              ? "Read in English"
              : "Baca dalam Bahasa Indonesia"}{" "}
            →
          </Link>
        </p>
      ) : null}
    </header>
  );
}

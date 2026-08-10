import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import type { Locale, PostSummary } from "@/content/post-types";

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="post-card">
      <div>
        <div className="post-meta">
          <span>{formatDate(post.publishedAt, post.locale)}</span>
          <span>·</span>
          <span>{post.readingTimeMinutes} min read</span>
          {post.series ? (
            <>
              <span>·</span>
              <span>{post.series}</span>
            </>
          ) : null}
        </div>
        <h2>
          <Link href={`/${post.locale}/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.description}</p>
        <div className="topic-list">
          {post.topics.map((topic) => (
            <span className="topic" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="post-card-aside">
        <LuArrowUpRight
          className="post-card-arrow"
          size={20}
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { formatDate } from "@/lib/format-date";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="post-card">
      <div>
        <div className="post-meta">
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
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
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
        <ArrowUpRight
          className="post-card-arrow"
          size={20}
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

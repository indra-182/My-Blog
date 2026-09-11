import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { AtlasRoutePath } from "@/components/blog/atlas-route-path";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { formatDate } from "@/lib/format-date";

export function FeaturedRoute({ post }: { post: PostSummary }) {
  return (
    <section
      className="shell atlas-featured-route"
      aria-labelledby="featured-route-title"
      data-featured-route
    >
      <div className="atlas-featured-route__inner">
        <div className="atlas-featured-route__copy">
          <div className="atlas-label">{dictionary.blog.featuredLabel}</div>
          <h2 id="featured-route-title">{post.title}</h2>
          <p>{post.description}</p>
          <div className="metadata-row">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>
              {post.readingTimeMinutes} {dictionary.article.readingTime}
            </span>
          </div>
          <Link
            className="atlas-featured-route__link"
            href={`/blog/${post.slug}`}
          >
            {dictionary.blog.featuredAction}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="atlas-featured-route__map">
          <AtlasRoutePath />
        </div>
      </div>
    </section>
  );
}

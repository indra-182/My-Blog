import Link from "next/link";
import type { PostSummary } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";

export function RelatedPosts({ posts, dictionary }: { posts: PostSummary[]; dictionary: Dictionary }) {
  if (posts.length === 0) return null;
  return <section className="related-section" aria-labelledby="related-title"><h2 id="related-title">{dictionary.article.related}</h2><div className="related-grid">{posts.map((post) => <Link className="related-card" href={`/${post.locale}/blog/${post.slug}`} key={post.slug}><h3>{post.title}</h3><p>{post.topics.join(" · ")} · {post.readingTimeMinutes} {dictionary.article.readingTime}</p></Link>)}</div></section>;
}

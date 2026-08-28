import Link from "next/link";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";

export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-16" aria-labelledby="related-title">
      <h2
        id="related-title"
        className="m-0 mb-[1.1rem] text-[clamp(1.4rem,2.5vw,2.25rem)] font-[750] leading-[1.05] tracking-[-0.04em]"
      >
        {dictionary.article.related}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-px bg-border max-[767px]:grid-cols-1">
        {posts.map((post) => (
          <Link
            className="grid min-h-36 content-start gap-3 bg-background p-4 transition-colors duration-[var(--motion-fast)] ease hover:text-cue-rose focus-visible:text-cue-rose"
            href={`/blog/${post.slug}`}
            key={post.slug}
          >
            <h3 className="m-0 text-[0.98rem] font-[750] leading-[1.25] text-inherit">
              {post.title}
            </h3>
            <p className="m-0 text-[0.8rem] leading-[1.5] text-muted-foreground">
              {post.topics.join(" · ")} · {post.readingTimeMinutes}{" "}
              {dictionary.article.readingTime}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

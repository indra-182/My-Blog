import dictionary from "@/i18n/messages/id.json";
import { PostBrowser } from "@/components/blog/post-browser";
import { postRepository } from "@/content/post-repository";
import { parsePostFilters } from "@/lib/post-discovery";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, posts] = await Promise.all([
    searchParams,
    postRepository.getAllPosts(),
  ]);
  const initialFilters = parsePostFilters(params);

  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <section
        className="blog-hero relative isolate overflow-hidden pt-[clamp(4.5rem,10vw,8rem)] pb-[clamp(7rem,14vw,12rem)]"
        aria-labelledby="blog-hero-title"
      >
        <div className="shell">
          <div className="relative z-10 max-w-[52rem] animate-cue-rise">
            <h1
              id="blog-hero-title"
              className="m-0 max-w-[14ch] text-[clamp(2.75rem,6.8vw,5.25rem)] font-[800] leading-[0.92] tracking-[-0.04em] text-foreground text-balance hero:text-[clamp(3rem,4.3vw,4.25rem)] max-[639px]:max-w-none max-[639px]:text-[clamp(2.3rem,10vw,3rem)] max-[639px]:[overflow-wrap:normal] max-[639px]:[word-break:normal]"
            >
              {dictionary.blog.title}
            </h1>
            <div className="cue-label mt-6">{dictionary.blog.eyebrow}</div>
            <p className="mt-5 mb-0 max-w-[42rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.65] text-muted-foreground">
              {dictionary.blog.description}
            </p>
          </div>
        </div>
      </section>
      <PostBrowser posts={posts} initialFilters={initialFilters} />
    </main>
  );
}

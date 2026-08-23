import { BlogHero } from "@/components/blog/blog-hero";
import { PostBrowser } from "@/components/blog/post-browser";
import { postRepository } from "@/content/post-repository";

function firstSearchParam(
  value: string | string[] | undefined,
  fallback: string,
) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, posts] = await Promise.all([
    searchParams,
    postRepository.getAllPosts(),
  ]);
  const initialFilters = {
    query: firstSearchParam(params.q, ""),
    topic: firstSearchParam(params.topic, "all"),
    series: firstSearchParam(params.series, "all"),
  };

  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <BlogHero />
      <PostBrowser posts={posts} initialFilters={initialFilters} />
    </main>
  );
}

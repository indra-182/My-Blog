import { BlogHero } from "@/components/blog/blog-hero";
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
      <BlogHero />
      <PostBrowser posts={posts} initialFilters={initialFilters} />
    </main>
  );
}

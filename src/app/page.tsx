import { Suspense } from "react";
import { BlogHero } from "@/components/blog/blog-hero";
import { PostBrowser } from "@/components/blog/post-browser";
import { postRepository } from "@/content/post-repository";

export default async function BlogPage() {
  const posts = await postRepository.getAllPosts();
  return (
    <main id="main-content" className="page-main">
      <BlogHero />
      <Suspense fallback={null}>
        <PostBrowser posts={posts} />
      </Suspense>
    </main>
  );
}

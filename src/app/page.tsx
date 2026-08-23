import { Suspense } from "react";
import { BlogHero } from "@/components/blog/blog-hero";
import { PostBrowser } from "@/components/blog/post-browser";
import { postRepository } from "@/content/post-repository";

function PostBrowserFallback() {
  return (
    <div className="shell browser" aria-hidden="true">
      <div className="loading-block" />
      <div className="loading-block" style={{ marginTop: 24 }} />
    </div>
  );
}

export default async function BlogPage() {
  const posts = await postRepository.getAllPosts();
  return (
    <main id="main-content" className="page-main" tabIndex={-1}>
      <BlogHero />
      <Suspense fallback={<PostBrowserFallback />}>
        <PostBrowser posts={posts} />
      </Suspense>
    </main>
  );
}

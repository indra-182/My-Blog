import { Suspense } from "react";
import { BlogHero } from "@/components/blog/blog-hero";
import { PostBrowser } from "@/components/blog/post-browser";
import { postRepository } from "@/content/post-repository";
import { getDictionary } from "@/i18n/dictionaries";

export default async function BlogPage() {
  const posts = await postRepository.getAllPosts();
  const dictionary = getDictionary();
  return (
    <main id="main-content" className="page-main">
      <BlogHero dictionary={dictionary} />
      <Suspense
        fallback={
          <div className="shell browser">
            <div className="loading-block" aria-label="Memuat tulisan" />
          </div>
        }
      >
        <PostBrowser posts={posts} dictionary={dictionary} />
      </Suspense>
    </main>
  );
}

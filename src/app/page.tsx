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
      <PostBrowser posts={posts} dictionary={dictionary} />
    </main>
  );
}

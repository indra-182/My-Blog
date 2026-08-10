import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BlogHero } from "@/components/blog/blog-hero";
import { PostBrowser } from "@/components/blog/post-browser";
import { TranslationNotice } from "@/components/article/translation-notice";
import { postRepository } from "@/content/post-repository";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LocaleBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const posts = await postRepository.getAllPosts(value);
  const dictionary = getDictionary(value);
  return (
    <main id="main-content" className="page-main">
      <BlogHero dictionary={dictionary} />
      <Suspense fallback={null}>
        <TranslationNotice dictionary={dictionary} />
      </Suspense>
      <Suspense
        fallback={
          <div className="shell browser">
            <div className="loading-block" aria-label="Loading posts" />
          </div>
        }
      >
        <PostBrowser posts={posts} locale={value} dictionary={dictionary} />
      </Suspense>
    </main>
  );
}

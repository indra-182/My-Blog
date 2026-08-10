import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBreadcrumbs } from "@/components/article/article-breadcrumbs";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleProse } from "@/components/article/article-prose";
import { RelatedPosts } from "@/components/article/related-posts";
import { SeriesNavigation } from "@/components/article/series-navigation";
import { ShareLinks } from "@/components/article/share-links";
import { TableOfContents } from "@/components/article/table-of-contents";
import { postRepository } from "@/content/post-repository";
import { extractTableOfContents } from "@/content/toc";
import { isLocale, locales, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateStaticParams() {
  const entries = await Promise.all(locales.map(async (locale) => (await postRepository.getAllPosts(locale)).map((post) => ({ locale, slug: post.slug }))));
  return entries.flat();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) return {};
  const post = await postRepository.getPostBySlug(value, slug);
  if (!post) return {};
  const baseUrl = process.env.NEXT_PUBLIC_BLOG_URL ?? "http://localhost:3000";
  return { title: post.socialTitle ?? post.title, description: post.socialDescription ?? post.description, alternates: { canonical: post.canonical ?? `${baseUrl}/${value}/blog/${post.slug}`, languages: { id: `${baseUrl}/id/blog/${post.slug}`, en: `${baseUrl}/en/blog/${post.slug}` } }, openGraph: { title: post.socialTitle ?? post.title, description: post.socialDescription ?? post.description, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt } };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const post = await postRepository.getPostBySlug(value, slug);
  if (!post) notFound();
  const dictionary = getDictionary(value);
  const [translationPath, neighbors, related] = await Promise.all([
    postRepository.getTranslationPath(post.translationKey, otherLocale(value)),
    postRepository.getSeriesNeighbors(post),
    postRepository.getRelatedPosts(post, 3),
  ]);
  const toc = extractTableOfContents(post.source);
  return <main id="main-content" className="page-main"><div className="shell article-layout"><ArticleBreadcrumbs locale={value} title={post.title} dictionary={dictionary} /><ArticleHeader post={post} dictionary={dictionary} translationPath={translationPath} /><div className="article-body-grid"><ArticleProse post={post} dictionary={dictionary} /><TableOfContents items={toc} dictionary={dictionary} /></div><footer className="article-footer"><SeriesNavigation previous={neighbors.previous} next={neighbors.next} dictionary={dictionary} /><RelatedPosts posts={related} dictionary={dictionary} /><ShareLinks title={post.title} dictionary={dictionary} /></footer></div></main>;
}

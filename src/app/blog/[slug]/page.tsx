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
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const posts = await postRepository.getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await postRepository.getPostBySlug(slug);
  if (!post) return {};
  const baseUrl = siteConfig.blogUrl;
  return {
    title: post.socialTitle ?? post.title,
    description: post.socialDescription ?? post.description,
    alternates: {
      canonical: post.canonical ?? `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.socialTitle ?? post.title,
      description: post.socialDescription ?? post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await postRepository.getPostBySlug(slug);
  if (!post) notFound();
  const dictionary = getDictionary();
  const [neighbors, related] = await Promise.all([
    postRepository.getSeriesNeighbors(post),
    postRepository.getRelatedPosts(post, 3),
  ]);
  const toc = extractTableOfContents(post.source);
  return (
    <main id="main-content" className="page-main">
      <div className="shell article-layout">
        <ArticleBreadcrumbs title={post.title} dictionary={dictionary} />
        <ArticleHeader post={post} dictionary={dictionary} />
        <div className="article-body-grid">
          <ArticleProse post={post} dictionary={dictionary} />
          <TableOfContents items={toc} dictionary={dictionary} />
        </div>
        <footer className="article-footer">
          <SeriesNavigation
            previous={neighbors.previous}
            next={neighbors.next}
            dictionary={dictionary}
          />
          <RelatedPosts posts={related} dictionary={dictionary} />
          <ShareLinks title={post.title} dictionary={dictionary} />
        </footer>
      </div>
    </main>
  );
}

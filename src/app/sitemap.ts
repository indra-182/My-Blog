import type { MetadataRoute } from "next";
import { postRepository } from "@/content/post-repository";
import { locales } from "@/i18n/config";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexes = locales.map((locale) => ({ url: `${siteConfig.blogUrl}/${locale}`, changeFrequency: "weekly" as const, priority: .8 }));
  const posts = (await Promise.all(locales.map(async (locale) => (await postRepository.getAllPosts(locale)).map((post) => ({ url: `${siteConfig.blogUrl}/${locale}/blog/${post.slug}`, lastModified: post.updatedAt ?? post.publishedAt, changeFrequency: "monthly" as const, priority: .7 }))))).flat();
  return [...indexes, ...posts];
}

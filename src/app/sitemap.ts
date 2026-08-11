import type { MetadataRoute } from "next";
import { postRepository } from "@/content/post-repository";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await postRepository.getAllPosts();
  return [
    {
      url: siteConfig.blogUrl,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.blogUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

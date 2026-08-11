import { postRepository } from "@/content/post-repository";
import { siteConfig } from "@/lib/site-config";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export async function GET() {
  const posts = await postRepository.getAllPosts();
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${siteConfig.blogUrl}/blog/${post.slug}</link><guid>${siteConfig.blogUrl}/blog/${post.slug}</guid><description>${escapeXml(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><category>${post.topics.map(escapeXml).join("</category><category>")}</category></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>INDRA.DEV Blog</title><link>${siteConfig.blogUrl}</link><description>Tulisan teknis dari INDRA.DEV</description>${items}</channel></rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

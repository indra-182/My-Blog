import { postRepository } from "@/content/post-repository";
import { isLocale } from "@/i18n/config";
import { siteConfig } from "@/lib/site-config";

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[character] ?? character));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "id";
  const posts = await postRepository.getAllPosts(locale);
  const items = posts.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${siteConfig.blogUrl}/${locale}/blog/${post.slug}</link><guid>${siteConfig.blogUrl}/${locale}/blog/${post.slug}</guid><description>${escapeXml(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><category>${post.topics.map(escapeXml).join("</category><category>")}</category></item>`).join("");
  const title = locale === "id" ? "INDRA.DEV Blog" : "INDRA.DEV Blog — English";
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${title}</title><link>${siteConfig.blogUrl}/${locale}</link><description>Technical writing from INDRA.DEV</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}

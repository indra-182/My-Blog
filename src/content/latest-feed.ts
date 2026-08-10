import { latestPostFeedSchema, type LatestPostFeedV1 } from "./latest-feed-schema";
import { LOCALES } from "./post-types";
import type { Locale, PostSummary } from "./post-types";

export { latestPostFeedSchema };
export type { LatestPostFeedV1 };

export function clampFeedLimit(value: number) {
  return Math.min(10, Math.max(1, Math.trunc(value)));
}

export function buildLatestFeed(posts: PostSummary[], locale: Locale, limit = 3, generatedAt = new Date().toISOString()): LatestPostFeedV1 {
  const feed = {
    version: 1 as const,
    locale,
    generatedAt,
    posts: posts
      .filter((post) => post.locale === locale && !post.draft)
      .slice(0, clampFeedLimit(limit))
      .map(({ title, slug, description, publishedAt, topics, readingTimeMinutes }) => ({ title, slug, description, locale, publishedAt, topics, readingTimeMinutes })),
  };
  return latestPostFeedSchema.parse(feed);
}

export function parseLatestFeedQuery(params: URLSearchParams): { locale: Locale; limit: number } | { error: string } {
  const rawLocale = params.get("locale") ?? "id";
  if (!LOCALES.includes(rawLocale as Locale)) return { error: "Unsupported locale" };
  const rawLimit = params.get("limit");
  if (rawLimit !== null && (!/^\d+$/.test(rawLimit) || Number(rawLimit) < 1)) return { error: "Limit must be a positive integer" };
  return { locale: rawLocale as Locale, limit: rawLimit ? clampFeedLimit(Number(rawLimit)) : 3 };
}

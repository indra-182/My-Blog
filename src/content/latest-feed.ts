import {
  latestPostFeedSchema,
  type LatestPostFeedV1,
} from "./latest-feed-schema";
import { isPublished } from "./post-repository";
import type { PostSummary } from "./post-types";

function clampFeedLimit(value: number) {
  return Math.min(10, Math.max(1, Math.trunc(value)));
}

export function buildLatestFeed(
  posts: PostSummary[],
  limit = 3,
  generatedAt = new Date().toISOString(),
): LatestPostFeedV1 {
  const feed = {
    version: 1 as const,
    generatedAt,
    posts: posts
      .filter((post) => isPublished(post))
      .slice(0, clampFeedLimit(limit))
      .map(
        ({
          title,
          slug,
          description,
          topics,
          publishedAt,
          readingTimeMinutes,
        }) => ({
          title,
          slug,
          description,
          publishedAt,
          topics,
          readingTimeMinutes,
        }),
      ),
  };
  return latestPostFeedSchema.parse(feed);
}

export function parseLatestFeedQuery(
  params: URLSearchParams,
): { limit: number } | { error: string } {
  const rawLimit = params.get("limit");
  if (rawLimit !== null && (!/^\d+$/.test(rawLimit) || Number(rawLimit) < 1))
    return { error: "Limit must be a positive integer" };
  return {
    limit: rawLimit ? clampFeedLimit(Number(rawLimit)) : 3,
  };
}

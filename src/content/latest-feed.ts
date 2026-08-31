import { z } from "zod";
import type { PostSummary } from "./post-types";

const latestPostFeedSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime({ offset: true }),
  posts: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      publishedAt: z.string().datetime({ offset: true }),
      topics: z.array(z.string()),
      readingTimeMinutes: z.number().int().positive(),
    }),
  ),
});

type LatestPostFeedV1 = z.infer<typeof latestPostFeedSchema>;

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

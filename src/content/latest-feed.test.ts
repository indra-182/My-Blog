import { describe, expect, it } from "vitest";
import {
  latestPostFeedSchema,
  buildLatestFeed,
  parseLatestFeedQuery,
} from "./latest-feed";
import type { PostSummary } from "./post-types";

const posts: PostSummary[] = Array.from({ length: 12 }, (_, index) => ({
  title: `Post ${index}`,
  slug: `post-${index}`,
  description: "Description",
  publishedAt: `2026-08-${String(12 - Math.min(index, 9)).padStart(2, "0")}T20:00:00+07:00`,
  topics: ["React"],
  draft: index === 11,
  readingTimeMinutes: 2,
}));

describe("latest post feed", () => {
  it("clamps the limit, excludes drafts, and validates the versioned shape", () => {
    const feed = buildLatestFeed(posts, 99, "2026-08-10T00:00:00.000Z");
    expect(feed.posts).toHaveLength(10);
    expect(feed.posts.every((post) => !post.slug.includes("11"))).toBe(true);
    expect(latestPostFeedSchema.parse(feed).version).toBe(1);
  });

  it("defaults the limit and rejects invalid values", () => {
    expect(parseLatestFeedQuery(new URLSearchParams())).toEqual({ limit: 3 });
    expect(parseLatestFeedQuery(new URLSearchParams("limit=0"))).toEqual({
      error: "Limit must be a positive integer",
    });
    expect(parseLatestFeedQuery(new URLSearchParams("limit=4"))).toEqual({
      limit: 4,
    });
  });
});

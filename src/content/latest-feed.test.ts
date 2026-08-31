import { describe, expect, it } from "vitest";
import { buildLatestFeed, parseLatestFeedQuery } from "./latest-feed";
import type { PostSummary } from "./post-types";

function summary(index: number, overrides?: Partial<PostSummary>): PostSummary {
  return {
    title: `Post ${index}`,
    slug: `post-${index}`,
    description: "Description",
    publishedAt: `2020-01-${String(28 - index).padStart(2, "0")}T20:00:00+07:00`,
    topics: ["React"],
    draft: false,
    readingTimeMinutes: 2,
    ...overrides,
  };
}

const posts: PostSummary[] = Array.from({ length: 10 }, (_, index) =>
  summary(index),
);

describe("latest post feed", () => {
  it("clamps the limit and preserves the feed shape", () => {
    const feed = buildLatestFeed(posts, 99, "2026-08-10T00:00:00.000Z");
    expect(feed.version).toBe(1);
    expect(feed.generatedAt).toBe("2026-08-10T00:00:00.000Z");
    expect(feed.posts).toHaveLength(10);
    expect(Object.keys(feed.posts[0] ?? {}).sort()).toEqual([
      "description",
      "publishedAt",
      "readingTimeMinutes",
      "slug",
      "title",
      "topics",
    ]);
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

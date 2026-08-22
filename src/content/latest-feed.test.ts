import { describe, expect, it } from "vitest";
import { buildLatestFeed, parseLatestFeedQuery } from "./latest-feed";
import { latestPostFeedSchema } from "./latest-feed-schema";
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

const posts: PostSummary[] = [
  ...Array.from({ length: 10 }, (_, index) => summary(index)),
  // Future-dated non-drafts must be excluded just like drafts.
  summary(10, {
    slug: "post-future",
    title: "Post future",
    publishedAt: "2099-01-01T20:00:00+07:00",
  }),
  summary(11, {
    slug: "post-draft",
    title: "Post draft",
    publishedAt: "2099-01-02T20:00:00+07:00",
    draft: true,
  }),
];

describe("latest post feed", () => {
  it("clamps the limit, excludes drafts and future posts, and validates the versioned shape", () => {
    const feed = buildLatestFeed(posts, 99, "2026-08-10T00:00:00.000Z");
    expect(feed.posts).toHaveLength(10);
    expect(
      feed.posts.every(
        (post) => !["post-future", "post-draft"].includes(post.slug),
      ),
    ).toBe(true);
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

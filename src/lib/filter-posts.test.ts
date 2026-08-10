import { describe, expect, it } from "vitest";
import { filterPosts } from "./filter-posts";
import type { PostSummary } from "@/content/post-types";

const posts: PostSummary[] = [
  {
    title: "React boundaries",
    slug: "react-boundaries",
    description: "A guide to stable UI boundaries.",
    locale: "en",
    translationKey: "react-boundaries",
    publishedAt: "2026-08-05T20:00:00+07:00",
    topics: ["React", "TypeScript"],
    series: "Architecture",
    seriesOrder: 1,
    draft: false,
    readingTimeMinutes: 4,
  },
  {
    title: "Shipping APIs",
    slug: "shipping-apis",
    description: "Production habits for small APIs.",
    locale: "en",
    translationKey: "shipping-apis",
    publishedAt: "2026-08-04T20:00:00+07:00",
    topics: ["Next.js"],
    draft: false,
    readingTimeMinutes: 3,
  },
  {
    title: "Mobile state",
    slug: "mobile-state",
    description: "State patterns for React Native.",
    locale: "en",
    translationKey: "mobile-state",
    publishedAt: "2026-08-03T20:00:00+07:00",
    topics: ["React Native", "React"],
    series: "Architecture",
    seriesOrder: 2,
    draft: false,
    readingTimeMinutes: 5,
  },
];

describe("filterPosts", () => {
  it("matches title, description, and topics case-insensitively", () => {
    expect(filterPosts(posts, "  production  ", "all", "all").map((post) => post.slug)).toEqual([
      "shipping-apis",
    ]);
    expect(filterPosts(posts, "native", "all", "all").map((post) => post.slug)).toEqual([
      "mobile-state",
    ]);
  });

  it("applies exact topic and series constraints without mutating input", () => {
    const result = filterPosts(posts, "", "React", "Architecture");
    expect(result.map((post) => post.slug)).toEqual(["react-boundaries", "mobile-state"]);
    expect(posts.map((post) => post.slug)).toEqual([
      "react-boundaries",
      "shipping-apis",
      "mobile-state",
    ]);
  });
});

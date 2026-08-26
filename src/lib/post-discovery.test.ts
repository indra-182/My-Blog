import { describe, expect, it } from "vitest";
import {
  defaultPostFilters,
  filterPosts,
  parsePostFilters,
  serializePostFilters,
} from "./post-discovery";
import type { PostSummary } from "@/content/post-types";

const posts: PostSummary[] = [
  {
    title: "React boundaries",
    slug: "react-boundaries",
    description: "A guide to stable UI boundaries.",
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
    publishedAt: "2026-08-04T20:00:00+07:00",
    topics: ["Next.js"],
    draft: false,
    readingTimeMinutes: 3,
  },
  {
    title: "Mobile state",
    slug: "mobile-state",
    description: "State patterns for React Native.",
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
    expect(
      filterPosts(posts, {
        query: "  production  ",
        topic: "all",
        series: "all",
      }).map((post) => post.slug),
    ).toEqual(["shipping-apis"]);
    expect(
      filterPosts(posts, {
        query: "native",
        topic: "all",
        series: "all",
      }).map((post) => post.slug),
    ).toEqual(["mobile-state"]);
  });

  it("applies exact topic and series constraints without mutating input", () => {
    const result = filterPosts(posts, {
      query: "",
      topic: "React",
      series: "Architecture",
    });
    expect(result.map((post) => post.slug)).toEqual([
      "react-boundaries",
      "mobile-state",
    ]);
    expect(posts.map((post) => post.slug)).toEqual([
      "react-boundaries",
      "shipping-apis",
      "mobile-state",
    ]);
  });
});

describe("post filter URL contract", () => {
  it("parses defaults and uses the first repeated parameter", () => {
    expect(parsePostFilters({})).toEqual(defaultPostFilters);
    expect(
      parsePostFilters({
        q: ["first", "second"],
        topic: ["React", "Next.js"],
        series: undefined,
      }),
    ).toEqual({ query: "first", topic: "React", series: "all" });
  });

  it("serializes only active filters in canonical order", () => {
    expect(serializePostFilters(defaultPostFilters)).toBe("");
    expect(
      serializePostFilters({
        query: "react state",
        topic: "React",
        series: "Architecture",
      }),
    ).toBe("q=react+state&topic=React&series=Architecture");
  });
});

import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createPostRepository } from "./post-repository";

const fixtureRoot = path.join(process.cwd(), "src/test/fixtures/posts");

describe("post repository", () => {
  it("returns published posts newest first and excludes drafts", async () => {
    const repository = createPostRepository(fixtureRoot);
    const posts = await repository.getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "typescript-errors",
      "react-state",
    ]);
    expect(posts[0]?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it("finds related posts by topic and series neighbors by order", async () => {
    const repository = createPostRepository(fixtureRoot);
    const post = await repository.getPostBySlug("react-state");

    expect(post).not.toBeNull();
    const related = await repository.getRelatedPosts(post!, 3);
    expect(related.map((item) => item.slug)).toEqual(["typescript-errors"]);

    const neighbors = await repository.getSeriesNeighbors(post!);
    expect(neighbors.previous).toBeNull();
    expect(neighbors.next?.slug).toBe("typescript-errors");
  });

  it("does not expose malformed or duplicate slugs as public posts", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    await mkdir(root, { recursive: true });
    const frontmatter = `---
title: "Duplicate"
slug: "same-slug"
description: "Duplicate"
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Content`;
    await writeFile(path.join(root, "one.mdx"), frontmatter);
    await writeFile(path.join(root, "two.mdx"), frontmatter);

    const posts = await createPostRepository(root).getAllPosts();
    expect(posts).toHaveLength(1);
  });
});

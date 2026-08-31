import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  createPostRepository,
  isPublished,
  loadPostCollection,
  parsePostSource,
} from "./post-repository";

const fixtureRoot = path.join(process.cwd(), "src/test/fixtures/posts");

describe("post repository", () => {
  it("returns published posts newest first and excludes drafts", async () => {
    const repository = createPostRepository(fixtureRoot);
    const posts = await repository.getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "typescript-errors",
      "react-state",
    ]);
    expect(posts[0]).not.toHaveProperty("source");
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

    const lastOfSeries = await repository.getPostBySlug("typescript-errors");
    const previousNeighbors = await repository.getSeriesNeighbors(
      lastOfSeries!,
    );
    expect(previousNeighbors.previous?.slug).toBe("react-state");
    expect(previousNeighbors.next).toBeNull();
  });

  it("rejects duplicate slugs instead of choosing a document", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
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

    await expect(createPostRepository(root).getAllPosts()).rejects.toThrow(
      "duplicate slug",
    );
  });
});

describe("isPublished", () => {
  const now = Date.parse("2026-08-15T00:00:00Z");

  it("excludes drafts and future-dated non-drafts at a fixed time", () => {
    expect(
      isPublished({ draft: false, publishedAt: "2026-08-14T00:00:00Z" }, now),
    ).toBe(true);
    expect(
      isPublished({ draft: true, publishedAt: "2020-01-01T00:00:00Z" }, now),
    ).toBe(false);
    expect(
      isPublished({ draft: false, publishedAt: "2099-01-01T00:00:00Z" }, now),
    ).toBe(false);
  });
});

describe("parsePostSource", () => {
  const validFrontmatter = `---
title: "Future"
slug: "future-post"
description: "Scheduled"
publishedAt: "2099-01-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Body`;

  it("parses future-dated frontmatter without rejecting it", () => {
    const result = parsePostSource(validFrontmatter, "future.mdx");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("future-post");
      expect(result.data.source).toContain("Body");
    }
  });

  it("reports malformed frontmatter as a failure", () => {
    const result = parsePostSource(
      '---\ntitle: "No slug"\n---\n\nBody',
      "bad.mdx",
    );
    expect(result.success).toBe(false);
  });
});

describe("content edge cases", () => {
  it("rejects malformed files instead of serving a partial collection", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    await writeFile(
      path.join(root, "broken.mdx"),
      '---\ntitle: "Broken"\n---\n\nBody',
    );
    await writeFile(
      path.join(root, "valid.mdx"),
      `---
title: "Valid"
slug: "valid-post"
description: "Valid"
publishedAt: "2020-01-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Body`,
    );

    await expect(createPostRepository(root).getAllPosts()).rejects.toThrow(
      "broken.mdx",
    );
  });

  it("allows a missing content directory only when configured as optional", async () => {
    const missing = path.join(os.tmpdir(), "blog-content-missing");

    await expect(createPostRepository(missing).getAllPosts()).rejects.toThrow(
      "content directory does not exist",
    );
    await expect(
      loadPostCollection(missing, Date.now(), true),
    ).resolves.toEqual({ documents: [], issues: [] });
  });
});

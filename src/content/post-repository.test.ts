import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createPostRepository,
  isPublished,
  parsePostSource,
} from "./post-repository";

const fixtureRoot = path.join(process.cwd(), "src/test/fixtures/posts");

afterEach(() => {
  vi.restoreAllMocks();
});

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
  it("skips malformed files with a clear warning instead of failing silently", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    await mkdir(root, { recursive: true });
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

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const repository = createPostRepository(root);
    const posts = await repository.getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual(["valid-post"]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("broken.mdx");
  });

  it("hides future non-drafts publicly but includes them with includeDrafts", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    await mkdir(root, { recursive: true });
    await writeFile(
      path.join(root, "scheduled.mdx"),
      `---
title: "Scheduled"
slug: "scheduled-post"
description: "Scheduled"
publishedAt: "2099-01-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Body`,
    );

    const repository = createPostRepository(root);
    expect(await repository.getAllPosts()).toEqual([]);
    expect(await repository.getPostBySlug("scheduled-post")).toBeNull();

    const everything = await repository.getAllPosts({ includeDrafts: true });
    expect(everything.map((post) => post.slug)).toEqual(["scheduled-post"]);
  });

  it("returns metadata and source from the same document when slugs collide", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    await mkdir(root, { recursive: true });
    await writeFile(
      path.join(root, "older.mdx"),
      `---
title: "Older duplicate"
slug: "clash"
description: "Older"
publishedAt: "2020-01-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Older source`,
    );
    await writeFile(
      path.join(root, "newer.mdx"),
      `---
title: "Newer duplicate"
slug: "clash"
description: "Newer"
publishedAt: "2021-01-01T20:00:00+07:00"
topics: ["React"]
draft: false
---

Newer source`,
    );

    const repository = createPostRepository(root);
    const summary = (await repository.getAllPosts()).at(-1)!;
    const document = await repository.getPostBySlug("clash");

    expect(summary.title).toBe("Newer duplicate");
    expect(document).not.toBeNull();
    expect(document!.title).toBe(summary.title);
    expect(document!.description).toBe(summary.description);
    expect(document!.source).toContain("Newer source");
  });
});

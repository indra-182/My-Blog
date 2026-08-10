import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createPostRepository } from "./post-repository";

const fixtureRoot = path.join(process.cwd(), "src/test/fixtures/posts");

describe("post repository", () => {
  it("returns published posts newest first and excludes drafts", async () => {
    const repository = createPostRepository(fixtureRoot);
    const posts = await repository.getAllPosts("id");

    expect(posts.map((post) => post.slug)).toEqual([
      "typescript-errors",
      "react-state",
    ]);
    expect(posts[0]?.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it("resolves locale variants through their translation key", async () => {
    const repository = createPostRepository(fixtureRoot);

    await expect(
      repository.getTranslationPath("react-server-state", "en"),
    ).resolves.toBe("/en/blog/react-state");
  });

  it("finds related posts by topic and series neighbors by order", async () => {
    const repository = createPostRepository(fixtureRoot);
    const post = await repository.getPostBySlug("id", "react-state");

    expect(post).not.toBeNull();
    const related = await repository.getRelatedPosts(post!, 3);
    expect(related.map((item) => item.slug)).toEqual(["typescript-errors"]);

    const neighbors = await repository.getSeriesNeighbors(post!);
    expect(neighbors.previous).toBeNull();
    expect(neighbors.next?.slug).toBe("typescript-errors");
  });

  it("does not expose malformed or duplicate slugs as public posts", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "blog-content-"));
    const idRoot = path.join(root, "id");
    await mkdir(idRoot, { recursive: true });
    const frontmatter = `---\ntitle: "Duplicate"\nslug: "same-slug"\ndescription: "Duplicate"\nlocale: "id"\ntranslationKey: "same"\npublishedAt: "2026-08-01T20:00:00+07:00"\ntopics: ["React"]\ndraft: false\n---\n\nContent`;
    await writeFile(path.join(idRoot, "one.mdx"), frontmatter);
    await writeFile(path.join(idRoot, "two.mdx"), frontmatter);

    const posts = await createPostRepository(root).getAllPosts("id");
    expect(posts).toHaveLength(1);
  });
});

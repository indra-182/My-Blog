import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateContentDirectory } from "./post-repository";

async function createContentRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), "blog-validate-"));
  return root;
}

function frontmatter(overrides: {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  series?: string;
  seriesOrder?: number;
  draft?: boolean;
  featured?: boolean;
}) {
  const {
    slug = "valid-post",
    publishedAt = "2020-01-01T20:00:00+07:00",
    updatedAt,
    series,
    seriesOrder,
    draft = false,
    featured,
  } = overrides;
  const featuredLine = featured === undefined ? "" : `featured: ${featured}\n`;
  const updatedAtLine = updatedAt ? `updatedAt: "${updatedAt}"\n` : "";
  const seriesLine = series ? `series: "${series}"\n` : "";
  const seriesOrderLine = seriesOrder ? `seriesOrder: ${seriesOrder}\n` : "";
  return `---
title: "Valid"
slug: "${slug}"
description: "Valid"
publishedAt: "${publishedAt}"
${updatedAtLine}topics: ["React"]
${seriesLine}${seriesOrderLine}draft: ${draft}
${featuredLine}
---

Body`;
}

describe("validateContentDirectory", () => {
  it("passes a directory of valid posts", async () => {
    const root = await createContentRoot();
    await writeFile(path.join(root, "one.mdx"), frontmatter({ slug: "one" }));
    await writeFile(
      path.join(root, "two.mdx"),
      frontmatter({ slug: "two", draft: true }),
    );

    expect(await validateContentDirectory(root)).toEqual([]);
  });

  it("reports malformed frontmatter", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "broken.mdx"),
      '---\ntitle: "Broken"\n---\n\n',
    );

    const issues = await validateContentDirectory(
      root,
      Date.parse("2026-08-15T00:00:00Z"),
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]?.filePath).toContain("broken.mdx");
  });

  it("reports future-dated non-draft posts but allows future drafts", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "scheduled.mdx"),
      frontmatter({
        slug: "scheduled",
        publishedAt: "2099-01-01T20:00:00+07:00",
      }),
    );
    await writeFile(
      path.join(root, "draft.mdx"),
      frontmatter({
        slug: "draft",
        publishedAt: "2099-01-01T20:00:00+07:00",
        draft: true,
      }),
    );

    const issues = await validateContentDirectory(
      root,
      Date.parse("2026-08-15T00:00:00Z"),
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]?.filePath).toContain("scheduled.mdx");
    expect(issues[0]?.message).toContain("future");
  });

  it("reports every duplicate slug occurrence", async () => {
    const root = await createContentRoot();
    await writeFile(path.join(root, "one.mdx"), frontmatter({ slug: "clash" }));
    await writeFile(path.join(root, "two.mdx"), frontmatter({ slug: "clash" }));
    await writeFile(
      path.join(root, "three.mdx"),
      frontmatter({ slug: "clash" }),
    );

    const issues = await validateContentDirectory(root);
    expect(issues).toHaveLength(2);
    expect(issues.map((issue) => issue.filePath)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("two.mdx"),
        expect.stringContaining("three.mdx"),
      ]),
    );
    expect(issues.every((issue) => issue.message.includes("one.mdx"))).toBe(
      true,
    );
  });

  it("reports a missing explicit content directory", async () => {
    const missing = path.join(os.tmpdir(), "blog-validate-missing");
    await expect(validateContentDirectory(missing)).resolves.toEqual([
      {
        filePath: missing,
        message: "content directory does not exist",
      },
    ]);
  });

  it("rejects featured drafts", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "draft-featured.mdx"),
      frontmatter({ slug: "draft-featured", draft: true, featured: true }),
    );

    const issues = await validateContentDirectory(root);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("draft");
    expect(issues[0]?.message).toContain("featured");
  });

  it("rejects more than one published featured post", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "one.mdx"),
      frontmatter({ slug: "one", featured: true }),
    );
    await writeFile(
      path.join(root, "two.mdx"),
      frontmatter({ slug: "two", featured: true }),
    );

    const issues = await validateContentDirectory(root);
    expect(issues).toHaveLength(2);
    expect(
      issues.every((issue) => issue.message.includes("more than one")),
    ).toBe(true);
  });

  it("rejects an update date before publication", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "early-update.mdx"),
      frontmatter({ updatedAt: "2019-12-31T20:00:00+07:00" }),
    );

    const issues = await validateContentDirectory(root);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("updatedAt");
  });

  it("rejects duplicate positions within a series, including drafts", async () => {
    const root = await createContentRoot();
    await writeFile(
      path.join(root, "first.mdx"),
      frontmatter({ slug: "first", series: "React", seriesOrder: 1 }),
    );
    await writeFile(
      path.join(root, "second.mdx"),
      frontmatter({
        slug: "second",
        series: "React",
        seriesOrder: 1,
        draft: true,
      }),
    );
    await writeFile(
      path.join(root, "other-series.mdx"),
      frontmatter({
        slug: "other-series",
        series: "TypeScript",
        seriesOrder: 1,
      }),
    );

    const issues = await validateContentDirectory(root);
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("duplicate seriesOrder 1");
    expect(issues[0]?.message).toContain("React");
  });
});

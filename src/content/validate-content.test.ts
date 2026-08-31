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
  draft?: boolean;
}) {
  const {
    slug = "valid-post",
    publishedAt = "2020-01-01T20:00:00+07:00",
    draft = false,
  } = overrides;
  return `---
title: "Valid"
slug: "${slug}"
description: "Valid"
publishedAt: "${publishedAt}"
topics: ["React"]
draft: ${draft}
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
});

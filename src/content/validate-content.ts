import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { isPublished, parsePostSource } from "./post-repository";

export interface ContentValidationIssue {
  filePath: string;
  message: string;
}

/**
 * Validates every post in a content directory. Fails for malformed
 * frontmatter, duplicate slugs, and future-dated non-draft posts so
 * production builds never ship broken or leaking content.
 */
export async function validateContentDirectory(
  rootDirectory: string,
  now: number = Date.now(),
): Promise<ContentValidationIssue[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(rootDirectory)).filter((filename) =>
      filename.endsWith(".mdx"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const issues: ContentValidationIssue[] = [];
  const slugs = new Map<string, string>();

  for (const filename of filenames) {
    const filePath = path.join(rootDirectory, filename);
    const result = parsePostSource(await readFile(filePath, "utf8"), filePath);

    if (!result.success) {
      issues.push({ filePath, message: result.error.message });
      continue;
    }

    if (!result.data.draft && !isPublished(result.data, now)) {
      issues.push({
        filePath,
        message: "publishedAt cannot be in the future unless draft is true",
      });
    }

    const existingFilePath = slugs.get(result.data.slug);
    if (existingFilePath) {
      issues.push({
        filePath,
        message: `duplicate slug "${result.data.slug}" also used by ${existingFilePath}`,
      });
    } else {
      slugs.set(result.data.slug, filePath);
    }
  }

  return issues;
}

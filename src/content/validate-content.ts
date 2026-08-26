import { defaultRootDirectory, loadPostCollection } from "./post-repository";

/**
 * Validates every post in a content directory. Fails for malformed
 * frontmatter, duplicate slugs, and future-dated non-draft posts so
 * production builds never ship broken or leaking content.
 */
export async function validateContentDirectory(
  rootDirectory?: string,
  now: number = Date.now(),
) {
  const resolvedRootDirectory = rootDirectory ?? defaultRootDirectory();
  const allowMissing =
    rootDirectory === undefined && process.env.CONTENT_ROOT === undefined;
  const { issues } = await loadPostCollection(
    resolvedRootDirectory,
    now,
    allowMissing,
  );
  return issues;
}

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parsePostSource } from "@/content/post-repository";

const root = path.resolve(
  process.env.CONTENT_ROOT ?? path.join(process.cwd(), "content/posts"),
);
const failures: string[] = [];
const validPosts: Array<{
  slug: string;
  filePath: string;
}> = [];

async function main() {
  let files: string[] = [];
  try {
    files = (await readdir(root)).filter((file) => file.endsWith(".mdx"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  for (const file of files) {
    const filePath = path.join(root, file);
    const result = parsePostSource(await readFile(filePath, "utf8"), filePath);
    if (!result.success) {
      failures.push(`${filePath}: ${result.error.message}`);
      continue;
    }
    validPosts.push({ slug: result.data.slug, filePath });
  }

  const slugs = new Map<string, string>();
  for (const post of validPosts) {
    const previousSlug = slugs.get(post.slug);
    if (previousSlug)
      failures.push(
        `${post.filePath}: duplicate slug "${post.slug}" also used by ${previousSlug}`,
      );
    slugs.set(post.slug, post.filePath);
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${validPosts.length} post(s).`);
  }
}

void main();

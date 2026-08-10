import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parsePostSource } from "@/content/post-repository";
import { locales } from "@/i18n/config";

const root = path.resolve(
  process.env.CONTENT_ROOT ?? path.join(process.cwd(), "content/posts"),
);
const failures: string[] = [];
const validPosts: Array<{
  locale: string;
  slug: string;
  translationKey: string;
  filePath: string;
}> = [];

async function main() {
  for (const locale of locales) {
    const directory = path.join(root, locale);
    let files: string[] = [];
    try {
      files = (await readdir(directory)).filter((file) =>
        file.endsWith(".mdx"),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    for (const file of files) {
      const filePath = path.join(directory, file);
      const result = parsePostSource(
        await readFile(filePath, "utf8"),
        filePath,
        locale,
      );
      if (!result.success) {
        failures.push(`${filePath}: ${result.error.message}`);
        continue;
      }
      validPosts.push({
        locale,
        slug: result.data.slug,
        translationKey: result.data.translationKey,
        filePath,
      });
    }
  }

  for (const locale of locales) {
    const posts = validPosts.filter((post) => post.locale === locale);
    const slugs = new Map<string, string>();
    const translationKeys = new Map<string, string>();
    for (const post of posts) {
      const previousSlug = slugs.get(post.slug);
      if (previousSlug)
        failures.push(
          `${post.filePath}: duplicate slug "${post.slug}" also used by ${previousSlug}`,
        );
      slugs.set(post.slug, post.filePath);
      const previousTranslation = translationKeys.get(post.translationKey);
      if (previousTranslation)
        failures.push(
          `${post.filePath}: duplicate translationKey "${post.translationKey}" also used by ${previousTranslation}`,
        );
      translationKeys.set(post.translationKey, post.filePath);
    }
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${validPosts.length} post(s).`);
  }
}

void main();

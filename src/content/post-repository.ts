import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { ZodError } from "zod";
import { postFrontmatterSchema } from "./post-schema";
import type {
  Locale,
  PostDocument,
  PostFrontmatter,
  PostSummary,
} from "./post-types";

export type PostFileResult =
  | { success: true; data: PostDocument; filePath: string }
  | { success: false; filePath: string; error: ZodError | Error };

function defaultRootDirectory() {
  return path.resolve(
    /* turbopackIgnore: true */ process.env.CONTENT_ROOT ??
      path.join(process.cwd(), "content/posts"),
  );
}

function isPublished(post: PostSummary, includeDrafts: boolean) {
  return (
    includeDrafts ||
    (!post.draft && new Date(post.publishedAt).getTime() <= Date.now())
  );
}

export function parsePostSource(
  source: string,
  filePath: string,
  expectedLocale?: Locale,
): PostFileResult {
  try {
    const parsed = matter(source);
    const result = postFrontmatterSchema.safeParse(parsed.data);

    if (!result.success) {
      return { success: false, filePath, error: result.error };
    }
    if (expectedLocale && result.data.locale !== expectedLocale) {
      return {
        success: false,
        filePath,
        error: new Error(
          `locale does not match directory: expected ${expectedLocale}`,
        ),
      };
    }
    if (
      !result.data.draft &&
      new Date(result.data.publishedAt).getTime() > Date.now()
    ) {
      return {
        success: false,
        filePath,
        error: new Error(
          "publishedAt cannot be in the future unless draft is true",
        ),
      };
    }

    const frontmatter = result.data as PostFrontmatter;
    return {
      success: true,
      filePath,
      data: {
        ...frontmatter,
        readingTimeMinutes: Math.max(
          1,
          Math.ceil(readingTime(parsed.content).minutes),
        ),
        source: parsed.content,
      },
    };
  } catch (error) {
    return {
      success: false,
      filePath,
      error: error instanceof Error ? error : new Error("Unable to parse post"),
    };
  }
}

async function readLocalePosts(
  rootDirectory: string,
  locale: Locale,
): Promise<PostFileResult[]> {
  const localeDirectory = path.join(rootDirectory, locale);
  let filenames: string[];
  try {
    filenames = (await readdir(localeDirectory)).filter((filename) =>
      filename.endsWith(".mdx"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  return Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(localeDirectory, filename);
      return parsePostSource(
        await readFile(filePath, "utf8"),
        filePath,
        locale,
      );
    }),
  );
}

function uniqueBySlug(posts: PostSummary[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

export function createPostRepository(rootDirectory = defaultRootDirectory()) {
  async function getAllPosts(
    locale: Locale,
    options?: { includeDrafts?: boolean },
  ) {
    const includeDrafts = options?.includeDrafts ?? false;
    const parsed = await readLocalePosts(rootDirectory, locale);
    const posts = parsed
      .filter(
        (item): item is Extract<PostFileResult, { success: true }> =>
          item.success,
      )
      .map((item) => item.data)
      .filter((post) => isPublished(post, includeDrafts))
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

    return uniqueBySlug(posts) satisfies PostSummary[];
  }

  async function getPostBySlug(locale: Locale, slug: string) {
    const posts = await getAllPosts(locale);
    const post = posts.find((item) => item.slug === slug);
    if (!post) return null;

    const parsed = await readLocalePosts(rootDirectory, locale);
    const document = parsed.find(
      (item): item is Extract<PostFileResult, { success: true }> =>
        item.success && item.data.slug === slug,
    );
    return document?.data ?? (post as PostDocument);
  }

  async function getRelatedPosts(post: PostSummary, limit = 3) {
    const posts = await getAllPosts(post.locale);
    const topicSet = new Set(post.topics.map((topic) => topic.toLowerCase()));
    return posts
      .filter((candidate) => candidate.slug !== post.slug)
      .map((candidate) => ({
        candidate,
        score: candidate.topics.filter((topic) =>
          topicSet.has(topic.toLowerCase()),
        ).length,
      }))
      .filter(({ score }) => score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.candidate.publishedAt).getTime() -
            new Date(a.candidate.publishedAt).getTime(),
      )
      .slice(0, limit)
      .map(({ candidate }) => candidate);
  }

  async function getSeriesNeighbors(post: PostSummary) {
    if (!post.series || post.seriesOrder === undefined)
      return { previous: null, next: null };
    const posts = (await getAllPosts(post.locale))
      .filter((candidate) => candidate.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const index = posts.findIndex((candidate) => candidate.slug === post.slug);
    return {
      previous: index > 0 ? posts[index - 1] : null,
      next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
    };
  }

  async function getTranslationPath(
    translationKey: string,
    targetLocale: Locale,
  ) {
    const posts = await getAllPosts(targetLocale);
    const post = posts.find(
      (candidate) => candidate.translationKey === translationKey,
    );
    return post ? `/${targetLocale}/blog/${post.slug}` : null;
  }

  return {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    getSeriesNeighbors,
    getTranslationPath,
  };
}

export const postRepository = createPostRepository();

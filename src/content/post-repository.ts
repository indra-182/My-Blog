import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import { postFrontmatterSchema } from "./post-schema";
import type { PostDocument, PostSummary } from "./post-types";

type PostFileResult =
  | { success: true; data: PostDocument; filePath: string }
  | { success: false; filePath: string; error: Error };

const defaultContentDirectory = path.join(process.cwd(), "content/posts");

export function defaultRootDirectory() {
  return process.env.CONTENT_ROOT ?? defaultContentDirectory;
}

export function isPublished(
  post: Pick<PostSummary, "draft" | "publishedAt">,
  now: number = Date.now(),
) {
  return !post.draft && new Date(post.publishedAt).getTime() <= now;
}

export function parsePostSource(
  source: string,
  filePath: string,
): PostFileResult {
  try {
    const parsed = matter(source);
    const result = postFrontmatterSchema.safeParse(parsed.data);

    if (!result.success) {
      return { success: false, filePath, error: result.error };
    }

    const frontmatter = result.data;
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

async function readPosts(rootDirectory: string): Promise<PostDocument[]> {
  let filenames: string[];
  try {
    filenames = (await readdir(rootDirectory)).filter((filename) =>
      filename.endsWith(".mdx"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const results = await Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(rootDirectory, filename);
      return parsePostSource(await readFile(filePath, "utf8"), filePath);
    }),
  );

  const documents: PostDocument[] = [];
  for (const result of results) {
    if (result.success) {
      documents.push(result.data);
    } else {
      console.warn(
        `[content] Skipping unreadable post ${result.filePath}: ${result.error.message}`,
      );
    }
  }
  return documents;
}

function publishedAtDesc(a: PostSummary, b: PostSummary) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function uniqueBySlug<T extends PostSummary>(posts: T[]): T[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

export function createPostRepository(rootDirectory = defaultRootDirectory()) {
  // React cache dedupes reads and parses within a single server request.
  const loadDocuments = cache(async (): Promise<PostDocument[]> => {
    const documents = await readPosts(rootDirectory);
    return documents.sort(publishedAtDesc);
  });

  async function getPublicDocuments(): Promise<PostDocument[]> {
    const documents = await loadDocuments();
    return uniqueBySlug(documents.filter((document) => isPublished(document)));
  }

  async function getAllPosts() {
    const documents = await getPublicDocuments();
    return documents.map(({ source: _, ...summary }) => summary);
  }

  async function getPostBySlug(slug: string) {
    const documents = await getPublicDocuments();
    return documents.find((document) => document.slug === slug) ?? null;
  }

  async function getRelatedPosts(post: PostSummary, limit = 3) {
    const posts = await getAllPosts();
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
    const posts = (await getAllPosts())
      .filter((candidate) => candidate.series === post.series)
      .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const index = posts.findIndex((candidate) => candidate.slug === post.slug);
    return {
      previous: index > 0 ? posts[index - 1] : null,
      next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
    };
  }

  return {
    getAllPosts,
    getPostBySlug,
    getRelatedPosts,
    getSeriesNeighbors,
  };
}

export const postRepository = createPostRepository();

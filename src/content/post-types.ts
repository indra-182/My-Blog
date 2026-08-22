import type { PostFrontmatter } from "./post-schema";

export type { PostFrontmatter };

export type PostSummary = PostFrontmatter & {
  readingTimeMinutes: number;
};

export type PostDocument = PostSummary & {
  source: string;
};

export type PostFrontmatter = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  topics: string[];
  series?: string;
  seriesOrder?: number;
  cover?: string;
  draft: boolean;
  canonical?: string;
  socialTitle?: string;
  socialDescription?: string;
};

export type PostSummary = PostFrontmatter & {
  readingTimeMinutes: number;
};

export type PostDocument = PostSummary & {
  source: string;
};

import { z } from "zod";

export const latestPostFeedSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime({ offset: true }),
  posts: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      publishedAt: z.string().datetime({ offset: true }),
      topics: z.array(z.string()),
      readingTimeMinutes: z.number().int().positive(),
    }),
  ),
});

export type LatestPostFeedV1 = z.infer<typeof latestPostFeedSchema>;

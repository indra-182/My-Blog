import { z } from "zod";
import { LOCALES } from "./post-types";

const nonEmptyText = z.string().trim().min(1);
const slug = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase URL slug");
const isoDate = z.string().datetime({ offset: true });

export const postFrontmatterSchema = z
  .object({
    title: nonEmptyText,
    slug,
    description: nonEmptyText,
    locale: z.enum(LOCALES),
    translationKey: nonEmptyText,
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    topics: z
      .array(nonEmptyText)
      .min(1)
      .refine(
        (topics) =>
          new Set(topics.map((topic) => topic.toLowerCase())).size ===
          topics.length,
        "topics must be unique",
      ),
    series: nonEmptyText.optional(),
    seriesOrder: z.number().int().positive().optional(),
    cover: z.string().trim().min(1).optional(),
    draft: z.boolean(),
    canonical: z.string().url().optional(),
    socialTitle: nonEmptyText.optional(),
    socialDescription: nonEmptyText.optional(),
  })
  .strict()
  .refine(
    (post) => Boolean(post.series) === (post.seriesOrder !== undefined),
    "series and seriesOrder must be provided together",
  );

export type ParsedFrontmatter = z.infer<typeof postFrontmatterSchema>;

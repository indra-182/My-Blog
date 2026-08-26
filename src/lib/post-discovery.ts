import type { PostSummary } from "@/content/post-types";

export type PostFilters = {
  query: string;
  topic: string;
  series: string;
};

export const defaultPostFilters: PostFilters = {
  query: "",
  topic: "all",
  series: "all",
};

function firstValue(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

export function parsePostFilters(
  params: Record<string, string | string[] | undefined>,
): PostFilters {
  return {
    query: firstValue(params.q, defaultPostFilters.query),
    topic: firstValue(params.topic, defaultPostFilters.topic),
    series: firstValue(params.series, defaultPostFilters.series),
  };
}

export function serializePostFilters(filters: PostFilters) {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.topic !== defaultPostFilters.topic)
    params.set("topic", filters.topic);
  if (filters.series !== defaultPostFilters.series)
    params.set("series", filters.series);
  return params.toString();
}

export function filterPosts(posts: PostSummary[], filters: PostFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase();
  return posts.filter((post) => {
    const matchesQuery =
      !normalizedQuery ||
      [post.title, post.description, ...post.topics]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    const matchesTopic =
      filters.topic === defaultPostFilters.topic ||
      post.topics.includes(filters.topic);
    const matchesSeries =
      filters.series === defaultPostFilters.series ||
      post.series === filters.series;
    return matchesQuery && matchesTopic && matchesSeries;
  });
}

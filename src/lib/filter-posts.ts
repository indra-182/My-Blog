import type { PostSummary } from "@/content/post-types";

export function filterPosts(
  posts: PostSummary[],
  query: string,
  topic: string,
  series: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return posts.filter((post) => {
    const matchesQuery =
      !normalizedQuery ||
      [post.title, post.description, ...post.topics]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    const matchesTopic = topic === "all" || post.topics.includes(topic);
    const matchesSeries = series === "all" || post.series === series;
    return matchesQuery && matchesTopic && matchesSeries;
  });
}

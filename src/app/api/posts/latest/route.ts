import { NextResponse } from "next/server";
import { buildLatestFeed, parseLatestFeedQuery } from "@/content/latest-feed";
import { postRepository } from "@/content/post-repository";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = parseLatestFeedQuery(url.searchParams);
  if ("error" in parsed)
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  const posts = await postRepository.getAllPosts();
  const feed = buildLatestFeed(posts, parsed.limit);
  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

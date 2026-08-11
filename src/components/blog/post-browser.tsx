"use client";

import { LuChevronDown, LuSearch } from "react-icons/lu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { PostSummary } from "@/content/post-types";
import type { Dictionary } from "@/i18n/dictionaries";
import { filterPosts } from "@/lib/filter-posts";
import { PostCard } from "./post-card";

export function PostBrowser({
  posts,
  dictionary,
  pageSize = 6,
}: {
  posts: PostSummary[];
  dictionary: Dictionary;
  pageSize?: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "all");
  const [series, setSeries] = useState(searchParams.get("series") ?? "all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const topics = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.topics))).sort(),
    [posts],
  );
  const seriesOptions = useMemo(
    () =>
      Array.from(
        new Set(posts.map((post) => post.series).filter(Boolean)),
      ).sort() as string[],
    [posts],
  );
  const filteredPosts = useMemo(
    () => filterPosts(posts, query, topic, series),
    [posts, query, topic, series],
  );
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  function updateState(next: {
    query?: string;
    topic?: string;
    series?: string;
  }) {
    const values = { query, topic, series, ...next };
    const params = new URLSearchParams();
    if (values.query.trim()) params.set("q", values.query.trim());
    if (values.topic !== "all") params.set("topic", values.topic);
    if (values.series !== "all") params.set("series", values.series);
    const nextUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
    router.replace(nextUrl, { scroll: false });
    setVisibleCount(pageSize);
  }

  function resetFilters() {
    setQuery("");
    setTopic("all");
    setSeries("all");
    setVisibleCount(pageSize);
    window.history.replaceState(null, "", pathname);
    router.replace(pathname, { scroll: false });
  }

  if (posts.length === 0) {
    return (
      <div className="shell browser">
        <div className="empty-state">
          <h2>{dictionary.blog.emptyTitle}</h2>
          <p>{dictionary.blog.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="browser shell" aria-label="Penjelajah tulisan">
      <div className="browser-toolbar">
        <div className="field">
          <label htmlFor="post-search">{dictionary.blog.search}</label>
          <div className="search-input">
            <LuSearch size={16} aria-hidden="true" />
            <input
              id="post-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                updateState({ query: event.target.value });
              }}
              placeholder={dictionary.blog.searchPlaceholder}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="topic-filter">{dictionary.blog.topic}</label>
          <div className="select-wrap">
            <LuChevronDown size={16} aria-hidden="true" />
            <select
              id="topic-filter"
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                updateState({ topic: event.target.value });
              }}
            >
              <option value="all">{dictionary.blog.allTopics}</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="series-filter">{dictionary.blog.series}</label>
          <div className="select-wrap">
            <LuChevronDown size={16} aria-hidden="true" />
            <select
              id="series-filter"
              value={series}
              onChange={(event) => {
                setSeries(event.target.value);
                updateState({ series: event.target.value });
              }}
            >
              <option value="all">{dictionary.blog.allSeries}</option>
              {seriesOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="result-count" aria-live="polite">
        {dictionary.blog.resultCount.replace(
          "{count}",
          String(filteredPosts.length),
        )}
      </div>
      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h2>{dictionary.blog.noResults}</h2>
          <button className="reset-button" type="button" onClick={resetFilters}>
            {dictionary.blog.reset}
          </button>
        </div>
      ) : (
        <>
          <div className="post-list">
            {visiblePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {visibleCount < filteredPosts.length ? (
            <div className="load-more-wrap">
              <button
                className="load-more"
                type="button"
                onClick={() => setVisibleCount((count) => count + pageSize)}
              >
                {dictionary.blog.loadMore}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

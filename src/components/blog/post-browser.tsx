"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "@/components/icons";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import { filterPosts } from "@/lib/filter-posts";
import { PostCard } from "./post-card";

const pageSize = 6;
const searchDebounceMs = 300;

type FilterValues = { query: string; topic: string; series: string };

function buildSearchPath(pathname: string, values: FilterValues) {
  const params = new URLSearchParams();
  if (values.query) params.set("q", values.query);
  if (values.topic !== "all") params.set("topic", values.topic);
  if (values.series !== "all") params.set("series", values.series);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function PostBrowser({ posts }: { posts: PostSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const topic = searchParams.get("topic") ?? "all";
  const series = searchParams.get("series") ?? "all";
  const currentPath = buildSearchPath(pathname, {
    query: urlQuery,
    topic,
    series,
  });

  // Typing stays in local state so filtering is immediate; the URL catches up
  // debounced. lastPushedQueryRef marks our own URL writes so their echo does
  // not clobber newer keystrokes.
  const [query, setQuery] = useState(urlQuery);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const lastPushedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    const lastPushedQuery = lastPushedQueryRef.current;
    if (lastPushedQuery !== null) {
      lastPushedQueryRef.current = null;
      if (urlQuery === lastPushedQuery) return;
    }

    setQuery((current) => (current === urlQuery ? current : urlQuery));
    setVisibleCount(pageSize);
  }, [urlQuery]);

  const replaceUrl = useCallback(
    (values: FilterValues) => {
      const nextPath = buildSearchPath(pathname, values);
      if (nextPath === currentPath) return;
      startTransition(() => {
        router.replace(nextPath, { scroll: false });
      });
    },
    [currentPath, pathname, router],
  );

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === urlQuery) return;
    const timeout = window.setTimeout(() => {
      lastPushedQueryRef.current = trimmedQuery;
      replaceUrl({ query: trimmedQuery, topic, series });
    }, searchDebounceMs);
    return () => window.clearTimeout(timeout);
  }, [query, urlQuery, topic, series, replaceUrl]);

  const topics = Array.from(
    new Set(posts.flatMap((post) => post.topics)),
  ).sort();
  const seriesOptions = Array.from(
    new Set(posts.map((post) => post.series).filter(Boolean)),
  ).sort() as string[];
  const filteredPosts = filterPosts(posts, query, topic, series);
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(pageSize);
  }

  function applyFilters(next: { topic?: string; series?: string }) {
    const values = { query: query.trim(), topic, series, ...next };
    setVisibleCount(pageSize);
    if (values.query !== urlQuery) lastPushedQueryRef.current = values.query;
    replaceUrl(values);
  }

  function resetFilters() {
    setQuery("");
    setVisibleCount(pageSize);
    if (urlQuery !== "") lastPushedQueryRef.current = "";
    replaceUrl({ query: "", topic: "all", series: "all" });
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
            <Search size={16} aria-hidden="true" />
            <input
              id="post-search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder={dictionary.blog.searchPlaceholder}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="topic-filter">{dictionary.blog.topic}</label>
          <div className="select-wrap">
            <ChevronDown size={16} aria-hidden="true" />
            <select
              id="topic-filter"
              value={topic}
              onChange={(event) => applyFilters({ topic: event.target.value })}
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
            <ChevronDown size={16} aria-hidden="true" />
            <select
              id="series-filter"
              value={series}
              onChange={(event) => applyFilters({ series: event.target.value })}
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

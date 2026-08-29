"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search } from "@/components/icons";
import type { PostSummary } from "@/content/post-types";
import dictionary from "@/i18n/messages/id.json";
import {
  defaultPostFilters,
  filterPosts,
  serializePostFilters,
  type PostFilters,
} from "@/lib/post-discovery";
import { PostCard } from "./post-card";

const pageSize = 6;
const searchDebounceMs = 300;

function buildSearchPath(pathname: string, filters: PostFilters) {
  const queryString = serializePostFilters(filters);
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function PostBrowser({
  posts,
  initialFilters,
}: {
  posts: PostSummary[];
  initialFilters: PostFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { query: urlQuery, topic, series } = initialFilters;
  const currentPath = buildSearchPath(pathname, initialFilters);
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
    (values: PostFilters) => {
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

  const { topics, seriesOptions } = useMemo(() => {
    const topics = new Set<string>();
    const seriesOptions = new Set<string>();
    for (const post of posts) {
      for (const topicName of post.topics) topics.add(topicName);
      if (post.series) seriesOptions.add(post.series);
    }
    return {
      topics: Array.from(topics).sort(),
      seriesOptions: Array.from(seriesOptions).sort(),
    };
  }, [posts]);
  const filteredPosts = useMemo(
    () => filterPosts(posts, { query, topic, series }),
    [posts, query, topic, series],
  );
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(pageSize);
  }

  function applyFilters(next: { topic?: string; series?: string }) {
    const values: PostFilters = {
      query: query.trim(),
      topic,
      series,
      ...next,
    };
    setVisibleCount(pageSize);
    if (values.query !== urlQuery) lastPushedQueryRef.current = values.query;
    replaceUrl(values);
  }

  function resetFilters() {
    setQuery("");
    setVisibleCount(pageSize);
    if (urlQuery !== "") lastPushedQueryRef.current = "";
    replaceUrl(defaultPostFilters);
  }

  if (posts.length === 0) {
    return (
      <div className="shell pt-[clamp(4rem,8vw,7rem)]">
        <div className="border-t border-border py-[clamp(3rem,8vw,6rem)]">
          <h2 className="m-0 max-w-[24ch] text-[clamp(1.4rem,2.5vw,2.25rem)] font-[750] leading-[1.05] tracking-[-0.04em]">
            {dictionary.blog.emptyTitle}
          </h2>
          <p className="mt-[0.85rem] mb-6 max-w-[48ch] leading-[1.65] text-muted-foreground">
            {dictionary.blog.emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="shell pt-[clamp(4rem,8vw,7rem)]"
      aria-label="Daftar tulisan"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(2,minmax(11rem,15rem))] gap-4 border-b border-border pb-8 max-[767px]:grid-cols-1">
        <div className="grid gap-[0.65rem]">
          <label
            className="font-mono text-[0.65rem] font-[700] leading-[1.4] tracking-[0.16em] text-muted-foreground uppercase"
            htmlFor="post-search"
          >
            {dictionary.blog.search}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-muted-foreground"
              size={16}
              aria-hidden="true"
            />
            <input
              className="min-h-11 w-full appearance-none rounded-[var(--radius-sm)] border border-input bg-surface px-[0.85rem] pl-[2.6rem] text-foreground transition-[border-color,background-color] duration-[var(--motion-fast)] ease placeholder:text-muted-foreground hover:border-cue-rose focus-visible:border-cue-rose focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
              id="post-search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder={dictionary.blog.searchPlaceholder}
            />
          </div>
        </div>
        <div className="grid gap-[0.65rem]">
          <label
            className="font-mono text-[0.65rem] font-[700] leading-[1.4] tracking-[0.16em] text-muted-foreground uppercase"
            htmlFor="topic-filter"
          >
            {dictionary.blog.topic}
          </label>
          <div className="relative">
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-[0.85rem] -translate-y-1/2 text-muted-foreground"
              size={16}
              aria-hidden="true"
            />
            <select
              className="min-h-11 w-full appearance-none rounded-[var(--radius-sm)] border border-input bg-surface px-[0.85rem] pr-[2.6rem] text-foreground transition-[border-color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose focus-visible:border-cue-rose focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
              id="topic-filter"
              value={topic}
              onChange={(event) => applyFilters({ topic: event.target.value })}
            >
              <option
                className="bg-popover text-popover-foreground"
                value="all"
              >
                {dictionary.blog.allTopics}
              </option>
              {topics.map((item) => (
                <option
                  className="bg-popover text-popover-foreground"
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-[0.65rem]">
          <label
            className="font-mono text-[0.65rem] font-[700] leading-[1.4] tracking-[0.16em] text-muted-foreground uppercase"
            htmlFor="series-filter"
          >
            {dictionary.blog.series}
          </label>
          <div className="relative">
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-[0.85rem] -translate-y-1/2 text-muted-foreground"
              size={16}
              aria-hidden="true"
            />
            <select
              className="min-h-11 w-full appearance-none rounded-[var(--radius-sm)] border border-input bg-surface px-[0.85rem] pr-[2.6rem] text-foreground transition-[border-color,background-color] duration-[var(--motion-fast)] ease hover:border-cue-rose focus-visible:border-cue-rose focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
              id="series-filter"
              value={series}
              onChange={(event) => applyFilters({ series: event.target.value })}
            >
              <option
                className="bg-popover text-popover-foreground"
                value="all"
              >
                {dictionary.blog.allSeries}
              </option>
              {seriesOptions.map((item) => (
                <option
                  className="bg-popover text-popover-foreground"
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div
        className="py-4 font-mono text-[0.68rem] tracking-[0.04em] text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        {dictionary.blog.resultCount.replace(
          "{count}",
          String(filteredPosts.length),
        )}
      </div>
      {filteredPosts.length === 0 ? (
        <div className="border-t border-border py-[clamp(3rem,8vw,6rem)]">
          <h2 className="m-0 max-w-[24ch] text-[clamp(1.4rem,2.5vw,2.25rem)] font-[750] leading-[1.05] tracking-[-0.04em]">
            {dictionary.blog.noResults}
          </h2>
          <button
            className="outline-button mt-6"
            type="button"
            onClick={resetFilters}
          >
            {dictionary.blog.reset}
          </button>
        </div>
      ) : (
        <>
          <div className="grid">
            {visiblePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {visibleCount < filteredPosts.length ? (
            <div className="flex justify-center pt-8">
              <button
                className="outline-button"
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

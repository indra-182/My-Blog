"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { TableOfContentsItem } from "@/content/toc";
import dictionary from "@/i18n/messages/id.json";
import { useHydrated } from "@/components/use-hydrated";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ArticleProgress({ items }: { items: TableOfContentsItem[] }) {
  const reducedMotion = useReducedMotion();
  const hydrated = useHydrated();
  const firstId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstId);
  const [progress, setProgress] = useState(0);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const progressLabel = useMemo(
    () =>
      dictionary.article.progressPosition
        .replace("{current}", String(activeIndex + 1))
        .replace("{total}", String(items.length)),
    [activeIndex, items.length],
  );

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null);

    if (headings.length === 0) return;

    const update = () => {
      const marker = 120;
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= marker) current = heading;
      }
      if (current?.id) setActiveId(current.id);

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0,
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside
      className="article-progress"
      data-motion-state={
        hydrated ? (reducedMotion ? "reduced" : "animated") : "static"
      }
    >
      <nav
        className="article-progress-map"
        aria-label={dictionary.article.progressMap}
      >
        <h2>{dictionary.article.progressMap}</h2>
        <ol>
          {items.map((item) => (
            <li data-active={item.id === activeId} key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === activeId ? "location" : undefined}
              >
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div
        className="article-progress-compact"
        aria-label={dictionary.article.progressMap}
      >
        <div className="article-progress-compact__meta">
          <h2>{dictionary.article.progressMap}</h2>
          <span aria-live="polite">{progressLabel}</span>
        </div>
        <div
          className="article-progress-compact__bar"
          role="progressbar"
          aria-label={dictionary.article.progressMap}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span
            style={
              { "--article-progress": `${progress * 100}%` } as CSSProperties
            }
          />
        </div>
      </div>
    </aside>
  );
}

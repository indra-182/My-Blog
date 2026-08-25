"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "@/components/icons";
import dictionary from "@/i18n/messages/id.json";

export function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const setVisible = (nextVisible: boolean) => {
      const button = buttonRef.current;
      if (!button) return;
      button.dataset.visible = String(nextVisible);
      button.tabIndex = nextVisible ? 0 : -1;
    };
    const articleHeader = document.getElementById("article-header");
    if (!articleHeader || typeof window.IntersectionObserver !== "function") {
      setVisible(true);
      return;
    }

    const observer = new window.IntersectionObserver(([entry]) => {
      setVisible(!entry?.isIntersecting);
    });
    observer.observe(articleHeader);
    return () => observer.disconnect();
  }, []);

  function scrollToArticleTop() {
    const articleHeading = document.getElementById("article-title");
    if (!articleHeading) return;

    articleHeading.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    articleHeading.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      className="back-to-top"
      ref={buttonRef}
      data-visible="false"
      tabIndex={-1}
      onClick={scrollToArticleTop}
    >
      <ArrowUp size={18} aria-hidden="true" />
      <span>{dictionary.article.backToTop}</span>
    </button>
  );
}

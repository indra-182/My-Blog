import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PostSummary } from "@/content/post-types";
import { siteConfig } from "@/lib/site-config";
import { ArticleBreadcrumbs } from "./article/article-breadcrumbs";
import { SeriesNavigation } from "./article/series-navigation";
import { PostBrowser } from "./blog/post-browser";
import { MobileNavigation } from "./mobile-navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

const post: PostSummary = {
  title: "Tulisan contoh",
  slug: "tulisan-contoh",
  description: "Deskripsi tulisan contoh.",
  publishedAt: "2026-01-01",
  topics: ["React"],
  draft: false,
  readingTimeMinutes: 3,
};

describe("shared shell", () => {
  it("exposes the Indonesian identity, navigation, and theme actions", () => {
    render(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );

    expect(
      screen.getAllByRole("link", { name: /INDRA\.DEV/i }).length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      screen.getAllByRole("link", { name: /Portfolio/i }).length,
    ).toBeGreaterThanOrEqual(1);
    screen
      .getAllByRole("link", { name: /Portfolio/i })
      .forEach((link) =>
        expect(link).toHaveAttribute("href", siteConfig.portfolioUrl),
      );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      siteConfig.linkedinUrl,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.contactEmail}`,
    );
    expect(
      screen.getAllByRole("link", { name: /Blog/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("button", { name: /theme|tema/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Catatan engineering untuk perangkat lunak yang bertahan lama.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByRole("link", { name: /switch language|bahasa/i }),
    ).toHaveLength(0);
    expect(
      screen.queryAllByRole("button", { name: /language|bahasa/i }),
    ).toHaveLength(0);
    expect(screen.getByText(/Mahadi Indra Manurung/)).toBeInTheDocument();
  });

  it("uses Indonesian labels for navigational landmarks", () => {
    cleanup();

    render(
      <>
        <SiteHeader />
        <SiteFooter />
        <MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />
        <PostBrowser posts={[post]} />
        <ArticleBreadcrumbs title={post.title} />
        <SeriesNavigation previous={post} next={null} />
      </>,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "Buka menu" }).at(-1)!,
    );

    expect(
      screen.getByRole("navigation", { name: "Navigasi utama" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigasi footer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigasi seluler" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Penjelajah tulisan" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Jejak navigasi" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigasi seri" }),
    ).toBeInTheDocument();
  });

  it("restores URL filters while keeping the post list rendered", () => {
    const otherPost: PostSummary = {
      ...post,
      title: "Tulisan lain",
      slug: "tulisan-lain",
      topics: ["TypeScript"],
    };

    cleanup();
    window.history.replaceState(null, "", "/?q=React");
    try {
      render(<PostBrowser posts={[post, otherPost]} />);

      expect(screen.getByLabelText("Cari tulisan")).toHaveValue("React");
      expect(
        screen.getByRole("link", { name: "Tulisan contoh" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Tulisan lain" }),
      ).not.toBeInTheDocument();
    } finally {
      cleanup();
      window.history.replaceState(null, "", "/");
    }
  });
});

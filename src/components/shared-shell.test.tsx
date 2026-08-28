import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PostSummary } from "@/content/post-types";
import { siteConfig } from "@/lib/site-config";
import { ArticleBreadcrumbs } from "./article/article-breadcrumbs";
import { SeriesNavigation } from "./article/series-navigation";
import { PostBrowser } from "./blog/post-browser";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
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

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
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
    expect(screen.getByText(/Hak cipta dilindungi\./)).toBeInTheDocument();
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
        <PostBrowser
          posts={[post]}
          initialFilters={{ query: "", topic: "all", series: "all" }}
        />
        <ArticleBreadcrumbs title={post.title} />
        <SeriesNavigation previous={post} next={null} />
      </>,
    );

    expect(
      screen.getByRole("navigation", { name: "Navigasi situs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigasi bagian bawah" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", {
        name: "Menu seluler",
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Daftar tulisan" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navigasi halaman" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", {
        name: "Pindah antar tulisan dalam seri",
      }),
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
    render(
      <PostBrowser
        posts={[post, otherPost]}
        initialFilters={{ query: "React", topic: "all", series: "all" }}
      />,
    );

    expect(screen.getByLabelText("Temukan tulisan")).toHaveValue("React");
    expect(
      screen.getByRole("link", { name: "Tulisan contoh" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Tulisan lain" }),
    ).not.toBeInTheDocument();
  });
});

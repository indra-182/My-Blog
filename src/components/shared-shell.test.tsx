import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/id",
}));

describe("shared shell", () => {
  it("exposes identity, navigation, theme, and locale actions", () => {
    render(
      <>
        <SiteHeader locale="id" />
        <SiteFooter locale="id" />
      </>,
    );

    expect(screen.getAllByRole("link", { name: /INDRA\.DEV/i }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("link", { name: /Portfolio/i }).length).toBeGreaterThanOrEqual(1);
    screen.getAllByRole("link", { name: /Portfolio/i }).forEach((link) => expect(link).toHaveAttribute("href", siteConfig.portfolioUrl));
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", siteConfig.linkedinUrl);
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${siteConfig.contactEmail}`);
    expect(screen.getAllByRole("link", { name: /Blog/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /theme|tema/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Switch language to English" })).toHaveLength(1);
    expect(screen.queryAllByRole("button", { name: /language|bahasa/i })).toHaveLength(0);
    expect(screen.getByText(/Mahadi Indra Manurung/)).toBeInTheDocument();
  });
});

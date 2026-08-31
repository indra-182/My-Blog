import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

describe("site shell", () => {
  it("exposes the Indonesian identity, navigation, destinations, and theme action", () => {
    render(
      <>
        <SiteHeader />
        <SiteFooter />
      </>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
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
      screen.getAllByRole("link", { name: /INDRA\.DEV/i }).length,
    ).toBeGreaterThanOrEqual(2);
    const portfolioLinks = screen.getAllByRole("link", {
      name: /Portfolio/i,
    });
    expect(portfolioLinks.length).toBeGreaterThanOrEqual(1);
    portfolioLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", siteConfig.portfolioUrl),
    );
    expect(screen.getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      siteConfig.githubUrl,
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
      screen.getByRole("button", { name: /theme|tema/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Catatan engineering untuk perangkat lunak yang bertahan lama.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Hak cipta dilindungi\./)).toBeInTheDocument();
    expect(screen.getByText(/Mahadi Indra Manurung/)).toBeInTheDocument();
  });
});

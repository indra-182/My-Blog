import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system", setTheme: vi.fn() }),
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
    expect(screen.getAllByRole("link", { name: /Blog/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /theme|tema/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /language|bahasa/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Mahadi Indra Manurung/)).toBeInTheDocument();
  });
});

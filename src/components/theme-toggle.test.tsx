import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeToggle", () => {
  it("uses the resolved light/dark theme and never exposes System as an icon state", () => {
    render(<ThemeToggle dictionary={getDictionary()} />);

    const button = screen.getByRole("button", { name: "Tema: Gelap" });
    expect(button.querySelector("svg")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /Sistem/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(window.localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByRole("button", { name: "Tema: Terang" })).toBeVisible();
  });
});

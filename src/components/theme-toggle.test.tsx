import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { ThemeToggle } from "./theme-toggle";

const setTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", resolvedTheme: "dark", setTheme }),
}));

describe("ThemeToggle", () => {
  it("uses the resolved light/dark theme and never exposes System as an icon state", () => {
    render(<ThemeToggle dictionary={getDictionary()} />);

    const button = screen.getByRole("button", { name: "Tema: Gelap" });
    expect(button.querySelector("svg")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /Sistem/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});

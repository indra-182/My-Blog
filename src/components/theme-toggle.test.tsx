import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

type MediaListener = (event: { matches: boolean }) => void;

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<MediaListener>();
  const media = {
    matches: initialMatches,
    addEventListener: (_: string, listener: MediaListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: MediaListener) => {
      listeners.delete(listener);
    },
  };
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({ ...media, media: query }),
  });
  return {
    changeSystemPreference(matches: boolean) {
      act(() => {
        media.matches = matches;
        listeners.forEach((listener) => listener({ matches }));
      });
    },
  };
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  vi.unstubAllGlobals();
});

describe("ThemeToggle", () => {
  it("offers only the light/dark action and persists an explicit choice", () => {
    installMatchMedia(false);
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Ganti ke tema terang" });
    expect(button.querySelector("svg")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: /sistem/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(window.localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    );
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("follows prefers-color-scheme on first visit without a stored theme", () => {
    installMatchMedia(true);
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();
  });

  it("keeps following the system preference while no explicit choice exists", () => {
    const system = installMatchMedia(false);
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema terang" }),
    ).toBeInTheDocument();

    system.changeSystemPreference(true);
    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("theme")).toBeNull();
  });

  it("ignores system preference changes once a choice is stored", () => {
    const system = installMatchMedia(false);
    window.localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();

    system.changeSystemPreference(true);
    expect(
      screen.queryByRole("button", { name: "Ganti ke tema terang" }),
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  it("applies the stored theme when another tab changes it", () => {
    installMatchMedia(false);
    render(<ThemeToggle />);

    window.localStorage.setItem("theme", "light");
    act(() => {
      window.dispatchEvent(new StorageEvent("storage"));
    });

    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");
  });
});

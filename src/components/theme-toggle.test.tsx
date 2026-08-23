import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  cleanup();
  try {
    window.localStorage.clear();
  } catch {
    // The inaccessible-storage test intentionally leaves localStorage unreadable.
  }
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.style.colorScheme = "";
  vi.restoreAllMocks();
});

describe("ThemeToggle", () => {
  it("initializes to dark without a stored choice", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema terang" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("uses a persisted light choice before rendering", () => {
    window.localStorage.setItem("theme", "light");
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("persists explicit toggles and updates both theme classes", () => {
    render(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole("button", { name: "Ganti ke tema terang" }),
    );
    expect(window.localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    );
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
  });

  it("synchronizes a stored choice from another tab", () => {
    render(<ThemeToggle />);

    window.localStorage.setItem("theme", "light");
    act(() => {
      window.dispatchEvent(new StorageEvent("storage"));
    });

    expect(
      screen.getByRole("button", { name: "Ganti ke tema gelap" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("light");
  });

  it("falls back to dark when storage is inaccessible", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    document.documentElement.classList.add("light");

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Ganti ke tema terang" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
  });
});

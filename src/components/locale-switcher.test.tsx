import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "./locale-switcher";

const routerState = vi.hoisted(() => ({ pathname: "/id" }));

vi.mock("next/navigation", () => ({
  usePathname: () => routerState.pathname,
}));

describe("LocaleSwitcher", () => {
  afterEach(() => {
    cleanup();
    routerState.pathname = "/id";
  });

  it("links directly to the destination locale", () => {
    render(<LocaleSwitcher locale="id" dictionary={getDictionary("id")} />);

    const link = screen.getByRole("link", {
      name: "Switch language to English",
    });
    expect(link).toHaveAttribute("href", "/en");
    expect(link).toHaveTextContent("EN");
    expect(
      screen.queryAllByRole("button", { name: /language|bahasa/i }),
    ).toHaveLength(0);
  });

  it("hides the header switcher on article routes", () => {
    routerState.pathname = "/en/blog/react-state";

    render(<LocaleSwitcher locale="en" dictionary={getDictionary("en")} />);

    expect(
      screen.queryAllByRole("link", { name: /switch language to/i }),
    ).toHaveLength(0);
    expect(
      screen.queryAllByRole("button", { name: /language|bahasa/i }),
    ).toHaveLength(0);
  });
});

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PostSummary } from "@/content/post-types";
import { PostBrowser } from "./post-browser";

const { replaceMock } = vi.hoisted(() => ({ replaceMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: replaceMock }),
}));

function summary(index: number, overrides?: Partial<PostSummary>): PostSummary {
  return {
    title: `Tulisan ${index}`,
    slug: `tulisan-${index}`,
    description: `Deskripsi ${index}`,
    publishedAt: "2026-01-01",
    topics: ["React"],
    draft: false,
    readingTimeMinutes: 2,
    ...overrides,
  };
}

const posts: PostSummary[] = [
  summary(1),
  summary(2),
  summary(3),
  summary(4),
  summary(5),
  summary(6),
  summary(7, { topics: ["TypeScript"] }),
  summary(8, { topics: ["TypeScript"] }),
];

const initialFilters = { query: "", topic: "all", series: "all" };

beforeEach(() => {
  replaceMock.mockClear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

describe("PostBrowser", () => {
  it("filters immediately while typing without touching the URL", () => {
    render(<PostBrowser posts={posts} initialFilters={initialFilters} />);
    const input = screen.getByLabelText("Temukan tulisan");

    fireEvent.change(input, { target: { value: "tulisan 7" } });

    expect(input).toHaveValue("tulisan 7");
    expect(
      screen.queryByRole("link", { name: "Tulisan 7" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Tulisan 1" }),
    ).not.toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("synchronizes the trimmed query to the URL after a debounce", () => {
    render(<PostBrowser posts={posts} initialFilters={initialFilters} />);
    const input = screen.getByLabelText("Temukan tulisan");

    fireEvent.change(input, { target: { value: "  react  " } });
    expect(replaceMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/?q=react", { scroll: false });
  });

  it("restores local state when the URL changes externally", () => {
    const view = render(
      <PostBrowser posts={posts} initialFilters={initialFilters} />,
    );
    const input = screen.getByLabelText("Temukan tulisan");

    fireEvent.change(input, { target: { value: "pending text" } });
    view.rerender(
      <PostBrowser
        posts={posts}
        initialFilters={{ query: "TypeScript", topic: "all", series: "all" }}
      />,
    );

    expect(input).toHaveValue("TypeScript");
    expect(screen.getByText("2 tulisan tersedia")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(input).toHaveValue("TypeScript");
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("applies select filters immediately and keeps them in the URL", () => {
    const view = render(
      <PostBrowser posts={posts} initialFilters={initialFilters} />,
    );

    fireEvent.change(screen.getByLabelText("Bahasan"), {
      target: { value: "TypeScript" },
    });

    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/?topic=TypeScript", {
      scroll: false,
    });

    view.rerender(
      <PostBrowser
        posts={posts}
        initialFilters={{ query: "", topic: "TypeScript", series: "all" }}
      />,
    );

    expect(screen.getByLabelText("Bahasan")).toHaveValue("TypeScript");
    expect(screen.getByText("2 tulisan tersedia")).toBeInTheDocument();
  });

  it("resets filters from the empty state and restores the list", () => {
    render(<PostBrowser posts={posts} initialFilters={initialFilters} />);
    const input = screen.getByLabelText("Temukan tulisan");

    fireEvent.change(input, { target: { value: "nothing-matches" } });
    expect(screen.getByText("0 tulisan tersedia")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Bersihkan filter" }));

    expect(input).toHaveValue("");
    expect(screen.getByText("8 tulisan tersedia")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tulisan 1" })).toBeInTheDocument();
  });

  it("resets the visible count when filters change", () => {
    render(<PostBrowser posts={posts} initialFilters={initialFilters} />);
    expect(screen.getAllByRole("link", { name: /^Tulisan \d$/ })).toHaveLength(
      6,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Tampilkan lebih banyak" }),
    );
    expect(screen.getAllByRole("link", { name: /^Tulisan \d$/ })).toHaveLength(
      8,
    );

    fireEvent.change(screen.getByLabelText("Temukan tulisan"), {
      target: { value: "deskripsi" },
    });
    expect(screen.getAllByRole("link", { name: /^Tulisan \d$/ })).toHaveLength(
      6,
    );
    expect(
      screen.getByRole("button", { name: "Tampilkan lebih banyak" }),
    ).toBeInTheDocument();
  });
});

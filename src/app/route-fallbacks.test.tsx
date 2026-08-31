import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ArticleNotFound from "./blog/[slug]/not-found";
import ErrorPage from "./error";
import Loading from "./loading";
import NotFound from "./not-found";

describe("skip-link targets", () => {
  it.each([
    ["loading", () => <Loading />],
    ["error", () => <ErrorPage error={new Error("boom")} reset={() => {}} />],
    ["root not found", () => <NotFound />],
    ["article not found", () => <ArticleNotFound />],
  ])("gives the %s screen a main#main-content target", (_, factory) => {
    const { container } = render(factory());
    const main = container.querySelector("main");
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("renders the root and article not-found copy from the dictionary", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: "Halaman tidak tersedia" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Buka halaman utama" }),
    ).toBeInTheDocument();

    cleanup();

    render(<ArticleNotFound />);
    expect(
      screen.getByRole("heading", { name: "Tulisan tidak tersedia" }),
    ).toBeInTheDocument();
  });

  it("renders the error fallback actions and retries", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    expect(screen.getByText("500")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ulangi percobaan" }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("link", { name: "Buka halaman utama" }),
    ).toBeInTheDocument();
  });
});

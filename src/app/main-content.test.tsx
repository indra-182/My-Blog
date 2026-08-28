import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ArticleNotFound from "./blog/[slug]/not-found";
import ErrorPage from "./error";
import Loading from "./loading";
import NotFound from "./not-found";

afterEach(() => {
  cleanup();
});

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

  it("renders not-found and error copy from the dictionary", () => {
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
});

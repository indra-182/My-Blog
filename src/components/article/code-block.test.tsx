import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";
import { mockClipboard } from "@/test/mock-clipboard";

afterEach(() => {
  vi.useRealTimers();
});

describe("CodeBlock", () => {
  it("copies the exact rendered code and announces success", async () => {
    vi.useFakeTimers();
    const writeText = mockClipboard();
    render(<CodeBlock code="const value = 1" language="ts" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Salin kode" }));
    });
    expect(writeText).toHaveBeenCalledWith("const value = 1");
    expect(
      screen.getByRole("button", { name: "Berhasil disalin" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(
      screen.getByRole("button", { name: "Salin kode" }),
    ).toBeInTheDocument();
  });

  it("keeps copied feedback for two seconds after the latest copy", async () => {
    vi.useFakeTimers();
    mockClipboard();
    render(<CodeBlock code="const value = 1" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Salin kode" }));
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Berhasil disalin" }));
    });
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(
      screen.getByRole("button", { name: "Berhasil disalin" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(
      screen.getByRole("button", { name: "Salin kode" }),
    ).toBeInTheDocument();
  });

  it("keeps syntax-highlighted markup while copying plain code", async () => {
    const writeText = mockClipboard();
    const { container } = render(
      <CodeBlock
        code="const value = 1"
        highlightedCode={
          <span style={{ color: "#ff79c6" }}>const value = 1</span>
        }
        language="ts"
      />,
    );

    const codeBlock = within(container);
    expect(
      codeBlock.getByText("const value = 1", { selector: "span" }),
    ).toHaveStyle({ color: "rgb(255, 121, 198)" });
    await act(async () => {
      fireEvent.click(codeBlock.getByRole("button", { name: "Salin kode" }));
    });
    expect(writeText).toHaveBeenCalledWith("const value = 1");
  });
});

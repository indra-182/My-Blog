import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";

describe("CodeBlock", () => {
  it("copies the exact rendered code and announces success", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<CodeBlock code="const value = 1" language="ts" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Salin" }));
    });
    expect(writeText).toHaveBeenCalledWith("const value = 1");
    expect(
      screen.getByRole("button", { name: "Tersalin" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(screen.getByRole("button", { name: "Salin" })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("keeps syntax-highlighted markup while copying plain code", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
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
      fireEvent.click(codeBlock.getByRole("button", { name: "Salin" }));
    });
    expect(writeText).toHaveBeenCalledWith("const value = 1");
  });
});

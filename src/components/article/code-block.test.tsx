import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { CodeBlock } from "./code-block";

describe("CodeBlock", () => {
  it("copies the exact rendered code and announces success", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<CodeBlock code="const value = 1" language="ts" dictionary={getDictionary("en")} />);

    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy code" })); });
    expect(writeText).toHaveBeenCalledWith("const value = 1");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(2200); });
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

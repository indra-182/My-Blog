import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareLinks } from "./share-links";
import { mockClipboard } from "@/test/mock-clipboard";

afterEach(() => {
  vi.useRealTimers();
  delete (navigator as { share?: unknown }).share;
});

describe("ShareLinks", () => {
  it("falls back to copying when the native share is unavailable", async () => {
    const writeText = mockClipboard();
    render(<ShareLinks title="Tulisan" />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /Bagikan sekarang$/ }),
      );
    });

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(
      screen.getByRole("button", { name: /Berhasil disalin/ }),
    ).toBeInTheDocument();
  });

  it("ignores a cancelled native share without copying", async () => {
    const writeText = mockClipboard();
    const share = vi.fn().mockRejectedValue(new DOMException("", "AbortError"));
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    render(<ShareLinks title="Tulisan" />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /Bagikan sekarang$/ }),
      );
    });

    expect(share).toHaveBeenCalledTimes(1);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("falls back to copying on other share failures", async () => {
    const writeText = mockClipboard();
    const share = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    render(<ShareLinks title="Tulisan" />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /Bagikan sekarang$/ }),
      );
    });

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: /Berhasil disalin/ }),
    ).toBeInTheDocument();
  });

  it("resets the copied state and clears the pending timer on unmount", async () => {
    vi.useFakeTimers();
    const writeText = mockClipboard();
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    render(<ShareLinks title="Tulisan" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Salin tautan/ }));
    });
    expect(
      screen.getByRole("button", { name: /Berhasil disalin/ }),
    ).toBeInTheDocument();

    cleanup();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});

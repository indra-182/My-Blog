import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { MobileNavigation } from "./mobile-navigation";

const dialogPrototype = HTMLDialogElement.prototype;
const originalShowModal = dialogPrototype.showModal;
const originalClose = dialogPrototype.close;

beforeEach(() => {
  dialogPrototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  dialogPrototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  dialogPrototype.showModal = originalShowModal;
  dialogPrototype.close = originalClose;
});

describe("MobileNavigation", () => {
  it("opens and closes a native modal dialog", () => {
    render(<MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />);
    const trigger = screen.getByRole("button", { name: "Buka navigasi" });
    const dialog = screen.getByRole("dialog", { hidden: true });

    fireEvent.click(trigger);
    expect(dialog).toHaveAttribute("open");

    fireEvent.click(screen.getByRole("button", { name: "Tutup navigasi" }));
    expect(dialog).not.toHaveAttribute("open");
  });

  it("closes when a navigation link is chosen", () => {
    render(<MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />);
    const trigger = screen.getByRole("button", { name: "Buka navigasi" });
    const dialog = screen.getByRole("dialog", { hidden: true });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("link", { name: "Portfolio" }));

    expect(dialog).not.toHaveAttribute("open");
  });

  it("returns focus when the browser closes the dialog for Escape", () => {
    render(<MobileNavigation portfolioUrl={siteConfig.portfolioUrl} />);
    const trigger = screen.getByRole("button", { name: "Buka navigasi" });
    const dialog = screen.getByRole("dialog", {
      hidden: true,
    }) as HTMLDialogElement;
    trigger.focus();

    fireEvent.click(trigger);
    dialog.close();

    expect(document.activeElement).toBe(trigger);
  });
});

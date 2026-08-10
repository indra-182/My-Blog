import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { TranslationNotice } from "./translation-notice";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("translation=unavailable"),
  usePathname: () => "/id",
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("translation recovery", () => {
  it("shows a dismissible notice and marks an unavailable locale target", () => {
    render(<><TranslationNotice dictionary={getDictionary("en")} /><LocaleSwitcher locale="id" dictionary={getDictionary("id")} targetPath={null} /></>);
    expect(screen.getByText(/translation is not available/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByText(/translation is not available/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /language|bahasa/i }));
    expect(screen.getByRole("link", { name: /English/i })).toHaveAttribute("href", "/en?translation=unavailable");
  });
});

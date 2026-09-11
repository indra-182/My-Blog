import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function prepareSnapshot(page: Page, colorScheme: "light" | "dark") {
  await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.removeItem("theme"));
  await page.evaluate(() => document.fonts.ready);
}

test("INDRA.DEV homepage light desktop snapshot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepareSnapshot(page, "light");
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect(page.locator("[data-featured-route]")).toBeVisible();
  await expect(page.locator(".archive-results")).toHaveAttribute(
    "data-motion-state",
    "reduced",
  );
  await expect(page).toHaveScreenshot("blog-home-light-desktop.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

test("INDRA.DEV featured article dark mobile snapshot", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await prepareSnapshot(page, "dark");
  await page.goto("/blog/react-state");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect(
    page.getByRole("heading", { name: /Server State/ }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("blog-featured-article-dark-mobile.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
  });
});

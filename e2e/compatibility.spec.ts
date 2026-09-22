import { expect, test } from "@playwright/test";

test("reader flow works across browser engines", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const navigationTrigger = page.getByRole("button", {
    name: "Buka navigasi",
  });
  await navigationTrigger.click();
  await expect(page.locator("dialog")).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(navigationTrigger).toBeFocused();

  await page.getByLabel("Temukan tulisan").fill("URL");
  await expect(page).toHaveURL(/q=URL/i);
  await expect(
    page.getByRole("link", { name: /Memisahkan Server State/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Memisahkan Server State/i }).click();
  await expect(page).toHaveURL(/\/blog\/react-state$/);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Memisahkan Server State dari UI State",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Dalam tulisan ini" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

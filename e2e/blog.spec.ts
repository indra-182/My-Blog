import { expect, test } from "@playwright/test";

test("search and locale navigation preserve the editorial discovery flow", async ({
  page,
}) => {
  await page.goto("/id");
  await expect(
    page.getByRole("heading", { name: /Membangun dengan lebih sengaja/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Memisahkan Server State/i }),
  ).toBeVisible();
  await page.getByLabel("Cari tulisan").fill("URL");
  await expect(page).toHaveURL(/q=URL/i);
  await expect(
    page.getByRole("link", { name: /Memisahkan Server State/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Switch language to English" }).click();
  await expect(page).toHaveURL(/\/en$/);
});

test("latest feed validates published metadata only", async ({ request }) => {
  const response = await request.get("/api/posts/latest?locale=id&limit=3");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.version).toBe(1);
  expect(
    body.posts.every(
      (post: Record<string, unknown>) =>
        !("source" in post) && !("draft" in post),
    ),
  ).toBe(true);
});

test("theme hydration uses only light and dark icons", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/id");
  const toggle = page.getByRole("button", { name: /Tema: (Terang|Gelap)/i });
  await expect(toggle).toBeVisible();
  await expect(toggle.locator(".lucide-monitor")).toHaveCount(0);
  await toggle.click();
  await expect(
    page.getByRole("button", { name: /Tema: (Terang|Gelap)/i }),
  ).toBeVisible();
  expect(
    pageErrors.filter((message) => message.includes("Hydration failed")),
  ).toEqual([]);
});

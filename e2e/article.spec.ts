import { expect, test } from "@playwright/test";

test("article exposes reading primitives and copy code", async ({ page }) => {
  await page.goto("/en/blog/react-state");
  await expect(
    page.getByRole("heading", {
      name: "Separating Server State from UI State",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Keep the URL shareable/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy code/i })).toBeVisible();
  await expect(page.getByText("React Architecture")).toBeVisible();
  await expect(page.getByText(/Baca dalam Bahasa Indonesia/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Switch language to/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /language|bahasa/i }),
  ).toHaveCount(0);
});

test("RSS is available for each explicit locale", async ({ request }) => {
  const response = await request.get("/en/rss.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response.text()).toContain("Separating Server State");
});

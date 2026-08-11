import { expect, test } from "@playwright/test";

test("article exposes reading primitives and copy code", async ({ page }) => {
  await page.goto("/blog/react-state");
  await expect(
    page.getByRole("heading", {
      name: "Memisahkan Server State dari UI State",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Jejak navigasi" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Jaga URL tetap dapat dibagikan/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Salin" })).toBeVisible();
  await expect(page.getByText("React Architecture")).toBeVisible();
});

test("RSS is available at the root route", async ({ request }) => {
  const response = await request.get("/rss.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response.text()).toContain("Memisahkan Server State");
});

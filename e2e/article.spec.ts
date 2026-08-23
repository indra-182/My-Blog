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
  await expect(
    page.getByRole("button", { name: "Salin", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("React Architecture")).toBeVisible();
});

test("RSS is available at the root route", async ({ request }) => {
  const response = await request.get("/rss.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  expect(await response.text()).toContain("Memisahkan Server State");
});

test("article moves the table of contents before prose on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/blog/react-state");
  const toc = page.getByRole("navigation", { name: "Di halaman ini" });
  await expect(toc).toBeVisible();
  expect(
    await page.evaluate(() => {
      const tocNode = document.querySelector(".toc");
      const proseNode = document.querySelector(".prose");
      return Boolean(
        tocNode &&
        proseNode &&
        tocNode.getBoundingClientRect().top <
          proseNode.getBoundingClientRect().top,
      );
    }),
  ).toBe(true);
});

test("homepage entrance cue is disabled for reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector(".animate-cue-rise")!)
          .animationName,
    ),
  ).toBe("none");
});

import { expect, test } from "@playwright/test";

test("search preserves the editorial discovery flow", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Membangun dengan lebih terarah/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Memisahkan Server State/i }),
  ).toBeVisible();
  await page.getByLabel("Temukan tulisan").fill("URL");
  await expect(page).toHaveURL(/q=URL/i);
  await page.reload();
  await expect(page.getByLabel("Temukan tulisan")).toHaveValue("URL");
  await expect(page).toHaveURL(/q=URL/i);
  await expect(
    page.getByRole("link", { name: /Memisahkan Server State/i }),
  ).toBeVisible();
});

test("latest feed validates published metadata only", async ({ request }) => {
  const response = await request.get("/api/posts/latest?limit=1");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.version).toBe(1);
  expect(body.posts).toHaveLength(1);
  expect(body).not.toHaveProperty("locale");
  expect(
    body.posts.every(
      (post: Record<string, unknown>) =>
        !("source" in post) && !("draft" in post) && !("locale" in post),
    ),
  ).toBe(true);

  const expandedResponse = await request.get("/api/posts/latest?limit=2");
  expect(expandedResponse.ok()).toBeTruthy();
  expect((await expandedResponse.json()).posts).toHaveLength(2);
});

test("legacy locale routes are unavailable", async ({ request }) => {
  expect((await request.get("/id")).status()).toBe(404);
  expect((await request.get("/en")).status()).toBe(404);
});

test("theme hydration uses only light and dark icons", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: /Gunakan tema (terang|gelap)/i,
  });
  await expect(toggle).toBeVisible();
  await expect(toggle.locator('[data-theme-icon="light"]')).toHaveCount(1);
  await expect(toggle.locator('[data-theme-icon="dark"]')).toHaveCount(1);
  await toggle.click();
  await expect(
    page.getByRole("button", { name: /Gunakan tema (terang|gelap)/i }),
  ).toBeVisible();
  expect(
    pageErrors.filter((message) => message.includes("Hydration failed")),
  ).toEqual([]);
});

test("explicit light theme persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("theme"));
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Gunakan tema terang" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  await expect(
    page.getByRole("button", { name: "Gunakan tema gelap" }),
  ).toBeVisible();
});

test("mobile navigation uses a native dialog and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Buka navigasi" });
  const dialog = page.locator("dialog");

  await trigger.click();
  await expect(dialog).toHaveAttribute("open", "");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open", "");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await dialog.getByRole("link", { name: "Blog" }).click();
  await expect(dialog).not.toHaveAttribute("open", "");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("homepage stays within the viewport across shell breakpoints", async ({
  page,
}) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("homepage hero horizon uses the bounded native scroll response", async ({
  page,
}) => {
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const hero = page.locator("section.blog-hero");
    const heading = page.getByRole("heading", {
      name: /Membangun dengan lebih terarah/i,
    });
    const supportsTimeline = await page.evaluate(() =>
      CSS.supports("animation-timeline: scroll()"),
    );
    const pseudoStyle = () =>
      hero.evaluate((element) => {
        const style = getComputedStyle(element, "::before");
        return {
          animationName: style.animationName,
          backgroundImage: style.backgroundImage,
          opacity: style.opacity,
          transform: style.transform,
        };
      });

    await expect(hero).toBeVisible();
    await expect(heading).toBeVisible();

    if (!supportsTimeline) {
      const style = await pseudoStyle();
      expect(style.animationName).toBe("none");
      expect(style.transform).toBe("none");
      expect(style.backgroundImage).toContain("linear-gradient");
      expect(style.opacity).toBe("0.55");
      continue;
    }

    const initialStyle = await pseudoStyle();
    expect(initialStyle.animationName).toBe("cue-horizon-rise");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => window.scrollTo(0, innerHeight * 0.4));
    await expect
      .poll(async () => (await pseudoStyle()).transform)
      .not.toBe(initialStyle.transform);
    await expect(heading).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await page.evaluate(() => window.scrollTo(0, innerHeight * 0.8));
    const restingStyle = await pseudoStyle();
    await page.evaluate(() => window.scrollTo(0, innerHeight * 1.2));
    await expect
      .poll(async () => (await pseudoStyle()).transform)
      .toBe(restingStyle.transform);
    await expect(heading).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("homepage motion honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.locator("section.blog-hero");
  await expect(
    page.getByRole("heading", {
      name: /Membangun dengan lebih terarah/i,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector(".animate-cue-rise")!)
          .animationName,
    ),
  ).toBe("none");
  const style = await hero.evaluate((element) => {
    const pseudo = getComputedStyle(element, "::before");
    return {
      animationName: pseudo.animationName,
      backgroundImage: pseudo.backgroundImage,
      opacity: pseudo.opacity,
      transform: pseudo.transform,
    };
  });
  expect(style.animationName).toBe("none");
  expect(style.transform).toBe("none");
  expect(style.backgroundImage).toContain("linear-gradient");
  expect(style.opacity).toBe("0.55");
});

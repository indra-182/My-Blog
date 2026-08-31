import { expect, test } from "@playwright/test";

test("article exposes reading primitives and copy code", async ({ page }) => {
  await page.goto("/blog/react-state");
  await expect(
    page.getByRole("heading", {
      name: "Memisahkan Server State dari UI State",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigasi halaman" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Pindah antar tulisan dalam seri" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Jaga URL tetap dapat dibagikan/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Salin kode", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("React Architecture")).toBeVisible();
});
test("article metadata uses fallbacks and social overrides", async ({
  page,
}) => {
  await page.goto("/blog/react-state");
  await expect(page).toHaveTitle(
    "Memisahkan Server State dari UI State | INDRA.DEV",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Batas praktis antara cache server, state antarmuka, dan URL.",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Batas praktis antara cache server, state antarmuka, dan URL.",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Memisahkan Server State dari UI State",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/blog\/react-state$/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  expect(
    Date.parse(
      (await page
        .locator('meta[property="article:published_time"]')
        .getAttribute("content")) ?? "",
    ),
  ).toBe(Date.parse("2026-08-01T20:00:00+07:00"));
  await expect(
    page.locator('meta[property="article:modified_time"]'),
  ).toHaveCount(0);

  await page.goto("/blog/typescript-errors");
  await expect(page).toHaveTitle("Desain Error TypeScript | INDRA.DEV");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Cara membaca error TypeScript sebagai petunjuk desain.",
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Cara membaca error TypeScript sebagai petunjuk desain.",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Desain Error TypeScript",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://example.com/canonical/typescript-errors",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  expect(
    Date.parse(
      (await page
        .locator('meta[property="article:published_time"]')
        .getAttribute("content")) ?? "",
    ),
  ).toBe(Date.parse("2026-08-05T20:00:00+07:00"));
  expect(
    Date.parse(
      (await page
        .locator('meta[property="article:modified_time"]')
        .getAttribute("content")) ?? "",
    ),
  ).toBe(Date.parse("2026-08-06T20:00:00+07:00"));
});
test("article shows Kembali ke atas after its header leaves the viewport", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 375, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/blog/react-state");

    const heading = page.getByRole("heading", {
      name: "Memisahkan Server State dari UI State",
    });
    const control = page.getByRole("button", {
      name: "Ke awal tulisan",
      exact: true,
      includeHidden: true,
    });

    await expect(heading).toBeVisible();
    await expect(control).toHaveCount(1);
    await expect(control).toBeHidden();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() =>
        heading.evaluate(
          (element) => element.getBoundingClientRect().bottom < 0,
        ),
      )
      .toBe(true);
    await expect(control).toBeVisible();

    const metrics = await control.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
        overflows: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    expect(metrics.width).toBeGreaterThanOrEqual(44);
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.right).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeGreaterThanOrEqual(0);
    expect(metrics.overflows).toBe(false);

    const beforeScroll = await control.boundingBox();
    await page.evaluate(() => window.scrollBy(0, -1));
    const afterScroll = await control.boundingBox();
    expect(beforeScroll).not.toBeNull();
    expect(afterScroll).not.toBeNull();
    expect(Math.abs(afterScroll!.y - beforeScroll!.y)).toBeLessThan(1);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(control).toBeHidden();
  }
});

test("article back-to-top activation focuses its heading without changing the URL", async ({
  page,
}) => {
  await page.goto("/blog/react-state");
  const heading = page.getByRole("heading", {
    name: "Memisahkan Server State dari UI State",
  });
  const control = page.getByRole("button", {
    name: "Ke awal tulisan",
    exact: true,
  });
  const url = page.url();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(control).toBeVisible();
  await control.focus();
  await expect(control).toBeFocused();
  const focusRing = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });
  expect(focusRing.outlineStyle).toBe("solid");
  expect(focusRing.outlineWidth).toBe("2px");
  const transitionDurations = await control.evaluate((element) =>
    getComputedStyle(element)
      .transitionDuration.split(",")
      .map((duration) => Number.parseFloat(duration)),
  );
  expect(transitionDurations.some((duration) => duration > 0)).toBe(true);
  await control.press("Enter");
  const headingTopAfterPress = await heading.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  expect(Math.abs(headingTopAfterPress)).toBeGreaterThan(120);
  await expect
    .poll(() =>
      heading.evaluate(
        (element) => Math.abs(element.getBoundingClientRect().top) < 120,
      ),
    )
    .toBe(true);
  await expect(heading).toBeFocused();
  expect(page.url()).toBe(url);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(control).toBeVisible();
  await control.focus();
  await control.press("Space");
  await expect(heading).toBeFocused();
  expect(page.url()).toBe(url);
});

test("article back-to-top honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/blog/react-state");

  const heading = page.getByRole("heading", {
    name: "Memisahkan Server State dari UI State",
  });
  const control = page.getByRole("button", {
    name: "Ke awal tulisan",
    exact: true,
  });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(control).toBeVisible();
  const transitionDurations = await control.evaluate((element) =>
    getComputedStyle(element)
      .transitionDuration.split(",")
      .map((duration) => Number.parseFloat(duration)),
  );
  expect(transitionDurations.every((duration) => duration === 0)).toBe(true);
  await control.click();
  await expect(heading).toBeFocused();
  expect(
    Math.abs(
      await heading.evaluate((element) => element.getBoundingClientRect().top),
    ),
  ).toBeLessThan(120);
});

test("article back-to-top remains usable without viewport observation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/blog/react-state");

  const heading = page.getByRole("heading", {
    name: "Memisahkan Server State dari UI State",
  });
  const control = page.getByRole("button", {
    name: "Ke awal tulisan",
    exact: true,
  });

  await expect(control).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await control.click();
  await expect(heading).toBeFocused();
  await expect
    .poll(() =>
      heading.evaluate(
        (element) => Math.abs(element.getBoundingClientRect().top) < 120,
      ),
    )
    .toBe(true);
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
  const toc = page.getByRole("navigation", { name: "Dalam tulisan ini" });
  await expect(toc).toBeVisible();
  expect(
    await toc.evaluate((tocNode) => {
      const proseNode = document.querySelector(".prose");
      return Boolean(
        proseNode &&
        tocNode.getBoundingClientRect().top <
          proseNode.getBoundingClientRect().top,
      );
    }),
  ).toBe(true);
});

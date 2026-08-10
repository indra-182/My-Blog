import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("blog index has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/id");
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("article has no serious or critical accessibility violations in dark mode", async ({
  page,
}) => {
  await page.goto("/en/blog/react-state");
  await page.getByRole("button", { name: /theme|tema/i }).click();
  await page.getByRole("button", { name: /theme|tema/i }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

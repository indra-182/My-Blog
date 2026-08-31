import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoSeriousOrCriticalViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
}
test("blog index has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expectNoSeriousOrCriticalViolations(page);
});

test("article has no serious or critical accessibility violations in default dark mode", async ({
  page,
}) => {
  await page.goto("/blog/react-state");
  await expectNoSeriousOrCriticalViolations(page);
});

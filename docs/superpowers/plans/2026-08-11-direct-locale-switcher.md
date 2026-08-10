# Direct Locale Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the blog language control a one-click direct link, remove it from the Footer, and hide it on article routes while preserving article translation links.

**Architecture:** Keep `LocaleSwitcher` as the shared client component, but replace its dropdown state with a direct `next/link` target. Because the shared layout cannot read child route segments on the server, the client switcher will use `usePathname()` and return `null` for `/[locale]/blog/[slug]`. The Footer will stop rendering the switcher; the existing header and article composition remain otherwise unchanged.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, `next/link`, `next/navigation`, Vitest, React Testing Library, and Playwright.

## Global Constraints

- Keep the change limited to the language control, Footer rendering, related CSS, and focused tests.
- Do not add dependencies or change locale routing, translation lookup, or article translation notices.
- Use the portfolio interaction: clicking the locale control immediately navigates to the destination locale.
- Keep code, identifiers, comments, and test descriptions in English.
- Preserve `targetPath={null}` as `/<target-locale>?translation=unavailable`.

---

## File Map

- Create `src/components/locale-switcher.test.tsx`: isolated direct-link and article-route visibility tests.
- Modify `src/components/locale-switcher.tsx`: remove dropdown state/menu and render a direct destination-locale link; hide on article paths.
- Modify `src/components/site-footer.tsx`: remove the Footer switcher import and render call.
- Modify `src/components/shared-shell.test.tsx`: assert the direct header link and absence of a language button.
- Modify `src/components/article/translation-notice.test.tsx`: assert the unavailable-translation direct link without a menu-opening click.
- Modify `src/app/globals.css`: remove dropdown and Footer-switcher-only rules while retaining the shared locale link styling.
- Modify `e2e/blog.spec.ts`: verify one-click locale navigation from the index.
- Modify `e2e/article.spec.ts`: verify the header switcher is absent on an article page.

## Task 1: Add failing behavior tests

**Files:**

- Create: `src/components/locale-switcher.test.tsx`
- Modify: `src/components/shared-shell.test.tsx`
- Modify: `src/components/article/translation-notice.test.tsx`
- Modify: `e2e/blog.spec.ts`
- Modify: `e2e/article.spec.ts`

**Interfaces:**

- Consumes: existing `LocaleSwitcher({ locale, dictionary, targetPath? })`, `SiteHeader`, and `SiteFooter` APIs.
- Produces: executable expectations for direct links, article visibility, Footer removal, and one-click E2E navigation.

- [ ] **Step 1: Write the isolated component tests first**

  Add a hoisted pathname value and mock `next/navigation` so the component can be tested at both `/id` and `/en/blog/react-state`:

  ```tsx
  const routerState = vi.hoisted(() => ({ pathname: "/id" }));

  vi.mock("next/navigation", () => ({
    usePathname: () => routerState.pathname,
  }));
  ```

  Test that an Indonesian index renders one link named `Switch language to English`, with visible `EN` text and `href="/en"`. Test that changing the mocked pathname to `/en/blog/react-state` renders no language link.

- [ ] **Step 2: Update existing unit expectations**

  In `shared-shell.test.tsx`, mock `usePathname()` as `/id`, replace the language-button assertion with a direct link assertion, and assert that no language button is present. Keep the existing Footer identity/link assertions so the shared shell still verifies the Footer.

  In `translation-notice.test.tsx`, keep the existing `/id` pathname mock and replace the menu-opening interaction with a direct assertion that the link named `Switch language to English` has `href="/en?translation=unavailable"`.

- [ ] **Step 3: Update E2E expectations**

  In `e2e/blog.spec.ts`, replace the button-then-menu click sequence with one click on the link named `Switch language to English`, then assert the URL ends in `/en`.

  In `e2e/article.spec.ts`, add an assertion after loading `/en/blog/react-state` that no link whose accessible name matches `Switch language to` is present. Leave the article content translation link assertion intact.

- [ ] **Step 4: Run the focused unit tests and confirm the intended red state**

  Run:

  ```bash
  rtk npm test -- src/components/locale-switcher.test.tsx src/components/shared-shell.test.tsx src/components/article/translation-notice.test.tsx
  ```

  Expected: FAIL because the current implementation still exposes a menu-opening language button, renders the Footer switcher, and does not hide the switcher on article paths. Do not change production code before observing this failure.

## Task 2: Implement the direct switcher and remove the Footer control

**Files:**

- Modify: `src/components/locale-switcher.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**

- Consumes: `usePathname()` from Next.js, `Locale`, `Dictionary`, and the existing optional `targetPath` contract.
- Produces: a direct `Link` with `className="locale-button"`, destination-locale text, and an accessible label; no Footer language control.

- [ ] **Step 1: Replace dropdown behavior with the minimal direct-link implementation**

  In `locale-switcher.tsx`:

  - Remove `useState` and `ChevronDown` imports.
  - Import `usePathname` from `next/navigation`.
  - Compute the target with `otherLocale(locale)` from `@/i18n/config`.
  - Return `null` when the pathname matches `^/(id|en)/blog(?:/|$)`.
  - Preserve the current target URL expression for `targetPath === null`, an explicit `targetPath`, and the default locale index target.
  - Render one `Link` with `aria-label` set to `Switch language to English` or `Switch language to Bahasa Indonesia`, and show `EN` or `ID` for the destination locale.

  The resulting JSX should follow this shape:

  ```tsx
  return (
    <Link className="locale-button" href={href} aria-label={`Switch language to ${label}`}>
      <Languages size={16} aria-hidden="true" />
      <span>{targetLocale.toUpperCase()}</span>
    </Link>
  );
  ```

- [ ] **Step 2: Remove the Footer instance**

  Delete the `LocaleSwitcher` import from `site-footer.tsx` and delete its JSX call from `.footer-grid`. Leave the Footer navigation links, timezone, copyright, and dictionary usage unchanged.

- [ ] **Step 3: Remove obsolete CSS only**

  Keep `.locale-button` styling so the direct link retains the existing 44-pixel accessible target. Remove `.locale-switcher`, `.locale-menu`, `.locale-menu:hover`, and the two responsive `.footer-grid > .locale-switcher` rules. Do not alter unrelated header, Footer, or mobile-navigation rules.

- [ ] **Step 4: Run the focused unit tests and confirm green**

  Run:

  ```bash
  rtk npm test -- src/components/locale-switcher.test.tsx src/components/shared-shell.test.tsx src/components/article/translation-notice.test.tsx
  ```

  Expected: all tests in the three files pass with no warnings or errors.

- [ ] **Step 5: Commit the focused implementation**

  ```bash
  git add src/components/locale-switcher.tsx src/components/locale-switcher.test.tsx src/components/site-footer.tsx src/components/shared-shell.test.tsx src/components/article/translation-notice.test.tsx src/app/globals.css e2e/blog.spec.ts e2e/article.spec.ts
  git commit -m "fix: make blog locale switching direct"
  ```

## Task 3: Verify rendered navigation and project health

**Files:**

- No additional files expected; use the tests and implementation from Tasks 1–2.

**Interfaces:**

- Consumes: the direct header link, Footer without a language control, and article route visibility behavior produced by Task 2.
- Produces: fresh verification evidence for the requested UX and repository health.

- [ ] **Step 1: Run the relevant E2E tests**

  Run:

  ```bash
  rtk npm run test:e2e -- e2e/blog.spec.ts e2e/article.spec.ts
  ```

  Expected: locale index navigation reaches `/en` after one click, the article page has no header language switcher, and all existing article/blog assertions pass.

- [ ] **Step 2: Run lint and typecheck**

  Run:

  ```bash
  rtk npm run lint
  rtk npm run typecheck
  ```

  Expected: both commands exit with code 0.

- [ ] **Step 3: Inspect the final diff and whitespace**

  Run:

  ```bash
  git diff HEAD^ --stat
  rtk git diff --check HEAD^
  git status --short
  ```

  Confirm only the planned spec/plan/implementation files changed, there are no whitespace errors, and no unrelated user changes were overwritten.

- [ ] **Step 4: Run the full unit suite**

  Run:

  ```bash
  rtk npm test
  ```

  Expected: the complete Vitest suite passes.

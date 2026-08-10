# Direct Locale Switcher Design

## Objective

Align the blog language control with the portfolio behavior: clicking the control immediately navigates to the other locale. The Footer must not render a language control, and article pages must not render the header language control.

## Scope

- Keep one language control in the site header on locale index pages.
- Render it as a direct link to the other locale, showing the destination locale code.
- Preserve the optional `targetPath` behavior and the unavailable-translation query fallback.
- Remove the language control from the shared Footer.
- Hide the header language control on article routes (`/[locale]/blog/[slug]`).
- Keep the article body translation link unchanged; it is a content-level translation action, not the header switcher.

## Design

`LocaleSwitcher` remains the shared client component because it already supports the optional translation target. Its dropdown state and chevron are removed. The component derives the other locale, builds the existing target URL, and returns one accessible `Link` with an explicit destination-language label. It uses the current pathname to return `null` for article routes while remaining visible on locale index routes.

`SiteFooter` no longer imports or renders `LocaleSwitcher`. Footer layout rules that only position the removed control and dropdown styles are removed as part of the same focused cleanup.

## Behavior

- On `/id`, clicking the language control navigates directly to `/en`.
- On `/en`, clicking the language control navigates directly to `/id`.
- With `targetPath={null}`, the control links to `/<target-locale>?translation=unavailable`.
- On `/id/blog/<slug>` and `/en/blog/<slug>`, no header language control is rendered.
- The existing article translation link remains available when a translated post exists.

## Verification

- Unit tests verify direct-link rendering, destination URL, and absent Footer control.
- Existing translation recovery coverage is updated for the direct-link interaction.
- E2E coverage verifies one-click locale navigation on the index and absence of the header switcher on an article page.
- Run the targeted Vitest tests, lint, typecheck, and relevant Playwright tests.

## Out of Scope

- Changing locale routing, translation lookup, or article translation notices.
- Changing theme controls, mobile navigation, or footer links other than removing the language control.

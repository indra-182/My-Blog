# Language Control Migration Record

> This historical plan was superseded before implementation by the
> Indonesian-only root migration on 2026-08-12.

## Original intent

The earlier product direction considered a one-click language link in the
header, removal of the footer control, and hiding the control on article pages.
That direction is no longer applicable because the blog now publishes one
language only.

## Final implementation outcome

- Removed the language switcher component and its tests.
- Removed the translation notice and translation-specific UI.
- Kept the shared shell focused on navigation, theme, mobile menu, and external
  links.
- Moved the public homepage to `/` and articles to `/blog/<slug>`.
- Exposed RSS at `/rss.xml` and removed language parameters from the latest-post
  API.
- Verified that legacy language-prefixed requests return 404.

## Verification record

The replacement migration covered component tests, root-route browser tests,
article and RSS tests, accessibility checks, lint, typecheck, content
validation, and the production build gate. The current implementation plan and
spec are the source of truth for any future work.

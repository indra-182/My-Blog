# Single-Language Root Blog Design

## Goal

Make the blog Indonesian-only and remove the locale-switching architecture. The
root URL becomes the canonical blog homepage, while the old `/id` and `/en`
route families return 404.

## Approved requirements

- `/` is the blog homepage.
- Articles use `/blog/<slug>`.
- RSS uses `/rss.xml`.
- The generated Open Graph image is available at `/opengraph-image`.
- Requests under `/id` and `/en` return 404; no compatibility redirects are
  added.
- Frontmatter no longer contains `locale` or `translationKey`.
- The latest-post API no longer accepts or returns locale data.
- Remaining English UI copy is translated into Indonesian.
- README, active documentation, and historical specs/plans describe the new
  single-language architecture.

## Architecture

The dynamic `src/app/[locale]` route tree is replaced by static root routes.
The root layout owns the shared theme provider, header, footer, Indonesian
dictionary, and root-level loading, error, and not-found states. The blog index
is rendered by `src/app/page.tsx`; the article page moves to
`src/app/blog/[slug]/page.tsx`; RSS and Open Graph image handlers move to the
root app segment.

Because no `/id` or `/en` route remains, Next.js handles both legacy route
families through the root not-found behavior. Missing article slugs continue to
use the article-specific not-found state.

## Content model

Production content is flattened from `content/posts/id` into
`content/posts`. Test fixtures follow the same layout and the English fixture is
removed. The post frontmatter keeps title, slug, description, publication and
update dates, topics, series data, draft state, and social/canonical overrides;
it drops locale and translation identity fields.

The repository reads one content directory directly. Its public methods no
longer receive a locale, and translation-path lookup is removed. The validator
checks the single content directory, schema validity, future publication rules,
and duplicate slugs.

## UI and copy

The Indonesian message dictionary remains as the single source of localized UI
copy, exposed through `getDictionary()` without a locale argument. The English
dictionary and locale configuration are removed.

Components no longer accept locale props. Internal links point to `/` or
`/blog/<slug>`, date formatting always uses `id-ID`, and article translation UI
is removed. The locale switcher, translation notice, translation-specific tests,
and locale-only CSS are deleted. Static English UI labels such as skip links,
loading states, errors, and footer copy are translated into Indonesian while
brand names and technical terms remain unchanged.

## Public metadata and feeds

Article metadata produces one canonical URL per article and no alternate-language
links. The sitemap contains the root homepage and Indonesian article URLs only.
RSS is a single root route and uses Indonesian blog copy and canonical article
links.

The latest-post API keeps version 1, limit clamping, draft exclusion, and cache
headers. Its query accepts only `limit`; its top-level and post entries no
longer include locale fields.

## Tests and verification

Unit tests are updated for the locale-free repository, post schema, feed shape,
component props, and Indonesian copy. Locale-switcher, translation-recovery,
and English-variant tests are removed or replaced with single-language cases.
E2E tests use `/`, `/blog/<slug>`, `/rss.xml`, and the locale-free API query,
and verify that `/id` and `/en` return 404. Accessibility coverage is run on
the root index and article routes.

The implementation is verified with content validation, targeted tests, the
full Vitest suite, lint, typecheck, production build, and E2E tests.

## Scope boundaries

This change intentionally breaks old locale-prefixed URLs rather than adding
redirects. It does not add new content, change theme behavior, alter external
navigation destinations, or introduce dependencies.

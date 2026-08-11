# INDRA.DEV Technical Blog MVP Implementation Plan

**Approved design:** [INDRA.DEV Blog Design](../specs/2026-08-10-indra-dev-blog-design.md)
**Updated:** 2026-08-12 for the Indonesian-only root architecture

## Goal

Build and maintain an Indonesian technical blog with validated MDX content,
engineer-focused discovery, readable code-heavy articles, public feeds, and
the shared INDRA.DEV shell.

## Architecture

Use file-backed MDX under one `content/posts` directory and compile it in
Server Components. Keep content discovery, schema validation, MDX rendering,
table-of-contents extraction, filtering, and feed serialization in focused
modules. Client code is limited to search/filter/load-more state, mobile
navigation, theme selection, copy-code feedback, and share interactions.

## Global Constraints

- Execute commands in `/home/mahad/code/Personal/blog`.
- Use npm and commit the generated `package-lock.json`.
- The canonical homepage is `/`; articles use `/blog/<slug>`.
- Keep the UI and content Indonesian-only. Brand names and technical terms may
  remain unchanged.
- Use Inter Variable for interface/editorial text and Geist Mono for code and
  metadata.
- Use Light, Dark, and System themes; System is the first-visit default.
- Motion uses opacity and transform, lasts 150–420 milliseconds, and respects
  `prefers-reduced-motion`.
- Published article copy is not invented for visual fullness; tests use
  fixtures under `src/test/fixtures`.
- Invalid MDX must not become public while unrelated published posts remain
  available.
- Do not add analytics, comments, newsletter, live playground, GSAP, or a CMS.

## Task 1: Scaffold and quality harness

Create the Next.js App Router application, TypeScript alias, Tailwind setup,
Vitest setup, Playwright setup, content validation script, and npm scripts for
development, linting, typechecking, testing, and building.

The Playwright server injects `src/test/fixtures/posts` through
`CONTENT_ROOT`. The smallest useful baseline is:

```bash
npm run lint
npm run typecheck
npm test
```

## Task 2: Build the Indonesian shared shell

Use the approved design tokens and shared components:

- `src/styles/design-tokens.css`
- `src/components/theme-provider.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/mobile-navigation.tsx`
- `src/i18n/dictionaries.ts`
- `src/i18n/messages/id.json`

The root layout owns the theme provider, skip link, header, page content, and
footer. There is no language switcher, translation notice, or alternate UI
dictionary.

## Task 3: Implement validated MDX content

The content root is `content/posts`. Each post contains:

```yaml
title: "Judul tulisan"
slug: "slug-url"
description: "Ringkasan satu kalimat."
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React"]
draft: false
```

`updatedAt`, `cover`, canonical/social overrides, and the paired `series` plus
positive integer `seriesOrder` are optional. Slugs are unique across the
content root. Future publications must remain drafts, and drafts are excluded
from public reads, RSS, sitemap, and the latest-post feed.

The repository exposes:

```ts
getAllPosts(options?)
getPostBySlug(slug)
getRelatedPosts(post, limit?)
getSeriesNeighbors(post)
```

The validator checks every production file, including drafts, reports the file
path plus the schema issue, detects duplicate slugs, and exits nonzero on
failure.

## Task 4: Add discovery and article reading

The root page loads published summaries and renders the editorial hero,
search, topic and series filters, result count, empty state, and Load More.
Filtering is case-insensitive, does not mutate input, preserves publication
ordering, and keeps active state in the URL query string.

The article route loads one published post, extracts the table of contents,
renders MDX with server-side highlighting, and includes breadcrumbs, metadata,
copy-code, series navigation, related posts, and share actions. Article
metadata has one canonical URL and no alternate-language links.

## Task 5: Expose public discovery endpoints

The public contracts are:

- `GET /api/posts/latest?limit=3`
- `GET /rss.xml`
- `GET /sitemap.xml`
- `GET /robots.txt`
- `GET /opengraph-image`

The version-one latest-post response contains `version`, `generatedAt`, and
published post metadata (`title`, `slug`, `description`, `publishedAt`,
`topics`, and `readingTimeMinutes`). It contains no draft, MDX source, or
language fields. The API ignores unrelated query parameters, validates and
clamps `limit` to 1–10, and uses one-hour public caching with
stale-while-revalidate.

RSS, sitemap, robots, canonical metadata, and share URLs use the normalized
environment-driven blog origin. Legacy language-prefixed requests return 404;
compatibility redirects are intentionally absent.

## Task 6: Verify the application

Run the focused checks first, then the complete quality gate:

```bash
npm run content:validate
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser coverage verifies root discovery, search, filters, theme hydration,
article reading, copy-code, RSS, latest-post API, accessibility in light and
dark themes, and 404 responses for legacy language-prefixed routes.

## Task 7: Documentation and deployment boundary

README and historical specs/plans must describe the same final contracts:
Indonesian-only content, root routes, locale-free post data, and no language
switcher. Hermes scheduling remains a separate later plan.

The blog is deployed as a separate Vercel project. Creating remotes, pushing,
configuring Vercel, or attaching a domain requires an explicit user request.

# INDRA.DEV Blog

Indonesian technical blog for React, Next.js, TypeScript, and React Native. The application uses the App Router, TypeScript, custom CSS, and file-backed MDX.

## Development

```bash
pnpm install
pnpm dev
```

The root URL (`/`) is the canonical blog homepage. Articles live at `/blog/<slug>`.

## Content authoring

Published posts are Indonesian `.mdx` files in `content/posts`. Every file requires:

```yaml
title: "Post title"
slug: "lowercase-url-slug"
description: "One-sentence summary"
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React"]
draft: false
```

`updatedAt`, canonical/social overrides, and the paired `series` plus positive integer `seriesOrder` are optional. Slugs must be unique. Publication timestamps use Asia/Jakarta semantics. Future posts must remain drafts; drafts are excluded from the site, RSS, sitemap, and latest-post feed.

Validate content with:

```bash
pnpm content:validate
```

The production content directory intentionally has no sample articles. Tests use private fixtures under `src/test/fixtures/posts` and Playwright injects that root through `CONTENT_ROOT`.

## Public contracts

- `GET /api/posts/latest?limit=3` returns version 1 published metadata with a one-hour public cache.
- `GET /rss.xml` returns the single Indonesian RSS feed.
- Legacy locale-prefixed requests such as `/id` and `/en` return 404.
- `sitemap.xml` and `robots.txt` use the environment-driven blog origin.

Environment names are documented in `.env.example`: `NEXT_PUBLIC_BLOG_URL`, `NEXT_PUBLIC_PORTFOLIO_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, and `NEXT_PUBLIC_LINKEDIN_URL`.

## Quality gate

```bash
pnpm content:validate
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

Hermes scheduling, CMS publishing, analytics, comments, newsletter, and deployment automation are outside this MVP.

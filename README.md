# INDRA.DEV Blog

Localized technical blog for React, Next.js, TypeScript, and React Native. The application uses the App Router, TypeScript, Tailwind CSS, and file-backed MDX.

## Development

```bash
npm install
npm run dev
```

The root URL redirects to `/id`. English content lives under `/en`.

## Content authoring

Published posts are `.mdx` files in `content/posts/id` or `content/posts/en`. Every file requires:

```yaml
title: "Post title"
slug: "lowercase-url-slug"
description: "One-sentence summary"
locale: "id"
translationKey: "stable-translation-id"
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React"]
draft: false
```

`updatedAt`, `cover`, canonical/social overrides, and the paired `series` plus positive integer `seriesOrder` are optional. Slugs and translation keys must be unique within a locale. Locale variants share a translation key. Publication timestamps use Asia/Jakarta semantics. Future posts must remain drafts; drafts are excluded from the site, RSS, sitemap, and latest-post feed.

Validate content with:

```bash
npm run content:validate
```

The production content directory intentionally has no sample articles. Tests use private fixtures under `src/test/fixtures/posts` and Playwright injects that root through `CONTENT_ROOT`.

## Public contracts

- `GET /api/posts/latest?locale=id&limit=3` returns version 1 published metadata with a one-hour public cache.
- `GET /id/rss.xml` and `GET /en/rss.xml` return localized RSS.
- `sitemap.xml` and `robots.txt` use the environment-driven blog origin.

Environment names are documented in `.env.example`: `NEXT_PUBLIC_BLOG_URL`, `NEXT_PUBLIC_PORTFOLIO_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, and `NEXT_PUBLIC_LINKEDIN_URL`.

## Quality gate

```bash
npm run content:validate
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Hermes scheduling, CMS publishing, analytics, comments, newsletter, and deployment automation are outside this MVP.
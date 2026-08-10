# INDRA.DEV Technical Blog Design

**Date:** 2026-08-10  
**Status:** Approved design; implementation not started  
**Application:** `/home/mahad/code/Personal/blog`

## Objective

Build a technical blog for software engineers covering React, Next.js, TypeScript, React Native, and production-oriented code examples. The blog is a separate Next.js application and Vercel project, but it must use the same INDRA.DEV identity, navigation language, theme behavior, footer, and visual tokens as the portfolio.

## Audience and Success Criteria

- Primary audience: software engineers, especially frontend engineers.
- Readers can find content through search, topics, and series.
- Long-form text and code remain readable on mobile and desktop.
- Articles support Indonesian and English variants through stable locale URLs.
- Content validation prevents malformed Hermes output from breaking published content.
- A public latest-post feed lets the portfolio surface new writing automatically.

## MVP Scope

- Next.js App Router and TypeScript.
- Tailwind CSS and shadcn/ui primitives.
- Explicit `/id` and `/en` locale routes; Indonesian is the default.
- Light, Dark, and System themes; first visit follows System.
- File-backed MDX with strict frontmatter validation.
- Search, topic filter, series filter, and Load More.
- Article breadcrumbs, table of contents, syntax highlighting, copy-code, reading time, related posts, series navigation, and share controls.
- RSS, sitemap, robots, Open Graph, canonical URLs, alternate-language URLs, and structured data.
- Versioned latest-post JSON feed for the portfolio.
- Loading, empty, error, not-found, and missing-translation recovery states.
- Vitest, Testing Library, Playwright, and accessibility verification.

## Excluded from MVP

- Analytics.
- Comments.
- Newsletter.
- Live code playground.
- CMS dashboard or multi-author publishing.
- GSAP, scroll-jacking, heavy parallax, animated cursors, or decorative 3D.
- Hermes scheduling and repository automation; these require a later plan after the Hermes runner is in scope.

## Shared Visual Contract

The approved direction is **Authority Editorial**:

- Strict editorial grid and clear information hierarchy.
- High-contrast surfaces with restrained blue accents.
- No purple/pink gradients, glassmorphism, random glows, emoji controls, or excessive rounded cards.
- `INDRA.DEV` uppercase text wordmark with the dot as the blue accent.
- Inter Variable for interface and editorial text.
- Geist Mono for code and technical metadata.
- One Lucide SVG icon family.
- Four/eight-pixel spacing rhythm and article measure around 65–75 characters.

Light theme:

- Background `#FAFAFA`
- Foreground `#101114`
- Surface `#F1F3F6`
- Muted text `#5D626B`
- Border `#D8DADD`
- Accent `#2563EB`

Dark theme:

- Background `#0B0D10`
- Foreground `#F5F7FA`
- Surface `#15181D`
- Muted text `#A6ADB8`
- Border `#2C3139`
- Accent `#60A5FA`

All components consume semantic variables instead of hardcoded theme-specific colors.

## Shared Header and Footer

The blog copies these source files byte-for-byte from the completed portfolio foundation:

- `src/styles/design-tokens.css`
- `src/components/theme-provider.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/locale-switcher.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/mobile-navigation.tsx`
- `src/i18n/config.ts`

The header includes the INDRA.DEV wordmark, Portfolio and Blog navigation, relevant blog links, language switcher, theme control, and an accessible mobile menu. Theme control uses Sun, Moon, and Monitor/System icons with tooltips, accessible names, and a minimum 44-pixel target.

The footer includes the wordmark, Portfolio, Blog, LinkedIn, email, language switcher, and `© <current year> Mahadi Indra Manurung`.

## Motion

- Entrance motion uses opacity plus an 8–12 pixel translate over 300–420 milliseconds.
- Hover and pressed feedback lasts 150–200 milliseconds.
- Only one or two motion groups appear per viewport.
- Content remains visible without JavaScript.
- `prefers-reduced-motion: reduce` disables entrance and nonessential transitions.

## Blog Information Architecture

### Index

1. Shared header.
2. Editorial hero explaining the React, Next.js, TypeScript, and React Native focus.
3. Search.
4. Topic and series filters.
5. Article list with title, description, topic, date, reading time, and series context.
6. Load More preserving active search and filters.
7. Shared footer.

### Article

1. Breadcrumbs.
2. Title, description, topics, dates, reading time, and series context.
3. Table of contents for eligible headings.
4. MDX prose and server-highlighted code.
5. Accessible copy-code control.
6. Previous/next navigation within a series.
7. Related posts.
8. Share controls.
9. Shared footer.

## MDX Content Contract

Every post defines:

- `title`
- `slug`
- `description`
- `locale`
- `translationKey`
- `publishedAt`
- Optional `updatedAt`
- `topics`
- Paired `series` and `seriesOrder` when the post belongs to a series
- Optional `cover`
- `draft`
- Optional canonical and social metadata overrides

Reading time is derived during processing. Slugs are unique within a locale. Locale variants share one `translationKey`. Invalid content is excluded from public output and the validation command returns a precise file-level failure.

## Localization

- URLs use explicit `/id` and `/en` prefixes.
- Interface dictionaries and article content are separate.
- Language switching maps translated articles through `translationKey`.
- If no translation exists, switch to the target-language blog index and show a nonblocking explanation.
- Dates use the active locale and Asia/Jakarta publication semantics.
- Canonical, `hreflang`, and Open Graph metadata are generated per locale route.

## Public Feed Contract

The blog exposes `GET /api/posts/latest?locale=<id|en>&limit=3` with schema version 1. The response contains published metadata only: title, slug, description, locale, publication date, topics, and reading time. Draft state and MDX source are never exposed.

The endpoint supports public caching for one hour with stale-while-revalidate behavior. Unsupported locale or malformed query input returns a clear 400 response.

## Hermes Boundary

Hermes publishing is a later phase. The website MVP provides the contract it must satisfy:

1. Write locale-specific MDX using the approved schema.
2. Use Asia/Jakarta publication time.
3. Run format, schema, slug, translation-key, link, test, and build checks.
4. Keep invalid content as draft and report a recoverable error.
5. Publish only through a separately approved Git and deployment workflow.

The intended schedule is 20:00 Asia/Jakarta after the Hermes repository and runner are supplied.

## UX States

- Zero published posts: localized honest empty state without fabricated article cards.
- No filter results: explain active constraints and expose Reset Filters.
- Loading over roughly 300 milliseconds: layout-stable skeleton.
- Missing or draft article: localized not-found page.
- Missing translation: target blog index plus polite explanation.
- Copy failure: manual-selection recovery instruction.
- General route failure: Retry and Home actions.

## Accessibility and Performance

- WCAG 2.2 AA contrast, landmarks, sequential headings, skip link, visible focus, and keyboard navigation.
- Minimum 44-pixel interactive targets.
- No meaning conveyed by color, hover, or motion alone.
- Code highlighting occurs on the server/build path rather than in a large client runtime.
- Images reserve aspect ratio and use responsive Next.js image behavior.
- Client Components are limited to interactions requiring browser state.

## Verification

- Unit tests for schema, repository ordering, drafts, locale mapping, translations, series neighbors, related posts, TOC, filtering, pagination, copy-code, and feed serialization.
- Playwright for search, filters, Load More, theme, language, mobile menu, article navigation, copy-code, missing translations, RSS, and feed endpoints.
- Axe checks on index and article routes in light and dark themes.
- Manual checks at 375, 768, 1024, and 1440 pixels, including reduced motion and keyboard-only use.
- Required gate: content validation, unit tests, lint, typecheck, production build, and E2E tests all pass.

## Deployment Boundary

The blog is deployed as a Vercel project separate from the portfolio and receives its own domain. Public portfolio/blog URLs, email, and LinkedIn are environment-driven. Creating Git remotes, pushing, configuring Vercel, or attaching a domain requires a new explicit user instruction.


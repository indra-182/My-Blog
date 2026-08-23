# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Indonesian frontend and mobile engineers reading practical React, Next.js, TypeScript, and React Native guidance. They use the blog to discover durable implementation advice and study concrete production decisions.

## Product Purpose

INDRA.DEV is a durable, production-minded technical learning blog. It helps engineers find, read, and revisit practical technical writing through published Indonesian MDX articles.

## Positioning

Concrete implementation decisions backed by code and browser verification, rather than generic developer-blog commentary.

## Operating Context

Desktop and mobile article discovery plus long-form reading. Readers search and filter published notes, follow headings and code examples, and continue through series or related posts.

## Capabilities and Constraints

- File-backed Indonesian MDX content.
- Canonical homepage at `/` and articles at `/blog/<slug>`.
- Discovery through `q`, `topic`, and `series` filters.
- Series and related-post navigation, table of contents, code copy, and sharing.
- RSS, sitemap, and latest-post API surfaces.
- No `/id` or `/en` UI routes.
- No fabricated claims, new production dependencies, or broken server-first boundaries.
- Dark-first theme with persisted explicit light choice.
- Semantic landmarks, keyboard access, visible focus, reduced motion, and no horizontal overflow.

## Brand Commitments

INDRA.DEV. The blog shares the sibling portfolio's current Cue Horizon system while remaining a focused technical-reading product. Preserve the blog's Indonesian technical-reading purpose, routes, content model, and interactions. Do not copy recruiter-only claims, locale routing, portrait or CV assets, testimonials, or portfolio content.

## Evidence on Hand

- `README.md`
- `src/i18n/messages/id.json`
- `src/content`
- `content/posts`
- `src/lib/site-config.ts`

The repository's real MDX and code are the evidence base. Future work must not fabricate testimonials, credentials, benchmarks, or product claims.

## Product Principles

- Make practical implementation decisions easy to find and verify.
- Keep reading structure clearer than decoration.
- Preserve durable routes and content contracts.
- Treat code, browser behavior, and accessibility as proof.

## Accessibility & Inclusion

Maintain semantic landmarks, keyboard access, visible focus, native dialog behavior, 44px interactive targets, reduced motion, and responsive layouts without horizontal overflow.

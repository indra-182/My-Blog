# INDRA.DEV Technical Blog MVP Implementation Plan

**Approved design:** [INDRA.DEV Blog Design](../specs/2026-08-10-indra-dev-blog-design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the localized INDRA.DEV technical blog with validated MDX content, engineer-focused discovery, readable code-heavy articles, public feeds, and the exact portfolio shell.

**Architecture:** Use file-backed MDX under locale directories and compile it in Server Components. Separate content discovery, schema validation, MDX rendering, table-of-contents extraction, and feed serialization into focused server-only modules. Restrict client code to search/filter/load-more state, mobile navigation, theme selection, copy-code feedback, and share interactions.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, next-themes, Lucide icons, Zod, next-mdx-remote, unified/remark/rehype, Shiki through rehype-pretty-code, Vitest, Testing Library, Playwright.

## Global Constraints

- Execute every command in `/home/mahad/code/Personal/blog` unless a step states otherwise.
- Use npm and commit the generated `package-lock.json`.
- Use explicit `/id` and `/en` routes; redirect `/` to `/id`.
- Copy the canonical design token and shared shell files from the completed portfolio plan without visual modification.
- Use Inter Variable for interface/editorial text and Geist Mono for code and metadata.
- Use Light, Dark, and System themes; System is the first-visit default.
- Motion uses only opacity and transform, lasts 150–420 milliseconds, and respects `prefers-reduced-motion`.
- Published article copy is not invented for visual fullness; tests use fixtures under `src/test/fixtures`.
- MDX validation failure must prevent the invalid post from becoming public without breaking unrelated published posts.
- Do not add analytics, comments, newsletter, live playground, GSAP, or a CMS.

---

### Task 1: Scaffold the Blog and Test Harness

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `playwright.config.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces npm scripts `dev`, `build`, `lint`, `typecheck`, `test`, `test:watch`, `content:validate`, and `test:e2e`.
- Produces the `@/*` alias mapped to `src/*`.

- [ ] **Step 1: Generate the application**

Run:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm --disable-git --yes
```

Expected: a Next.js App Router application is created inside the empty blog folder.

- [ ] **Step 2: Initialize local version control**

Run:

```bash
git init -b main
git add .
git commit -m "chore: scaffold technical blog"
```

- [ ] **Step 3: Install UI, content, and test dependencies**

Run:

```bash
npm install next-themes lucide-react zod clsx tailwind-merge class-variance-authority next-mdx-remote gray-matter reading-time remark-gfm remark-parse remark-mdx rehype-slug rehype-autolink-headings rehype-pretty-code unified unist-util-visit mdast-util-to-string github-slugger
npm install -D vitest @vitest/coverage-v8 jsdom @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright @types/mdx
npx shadcn@latest init -d
npx shadcn@latest add button dropdown-menu sheet separator tooltip skeleton input badge
```

- [ ] **Step 4: Add scripts and deterministic test configuration**

Run:

```bash
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.test="vitest run"
npm pkg set scripts.test:watch="vitest"
npm pkg set scripts.test:coverage="vitest run --coverage"
npm pkg set scripts.content:validate="tsx scripts/validate-content.ts"
npm pkg set scripts.test:e2e="playwright test"
npm install -D tsx
```

Create the same `vitest.config.ts` and `src/test/setup.ts` contract used by the portfolio plan. Configure `playwright.config.ts` with base URL `http://127.0.0.1:3001` and web server command `npm run dev -- --port 3001`.

- [ ] **Step 5: Verify the generated baseline**

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all commands pass.

- [ ] **Step 6: Commit the blog toolchain**

Run:

```bash
git add package.json package-lock.json components.json src/components/ui vitest.config.ts playwright.config.ts src/test
git commit -m "test: configure blog quality harness"
```

### Task 2: Copy and Verify the Canonical Design Shell

**Files:**
- Create: `src/styles/design-tokens.css`
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/locale-switcher.tsx`
- Create: `src/components/site-header.tsx`
- Create: `src/components/site-footer.tsx`
- Create: `src/components/mobile-navigation.tsx`
- Create: `src/i18n/config.ts`
- Create: `src/i18n/dictionaries.ts`
- Create: `src/i18n/messages/id.json`
- Create: `src/i18n/messages/en.json`
- Create: `src/components/shared-shell.test.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces byte-identical token, theme, locale, header, footer, and mobile-navigation source files for the later parity check.
- Adds blog-specific dictionary copy without changing shared component public props.

- [ ] **Step 1: Copy the canonical shared files**

Run from `/home/mahad/code/Personal`:

```bash
mkdir -p blog/src/styles blog/src/components blog/src/i18n/messages
cp portfolio/src/styles/design-tokens.css blog/src/styles/design-tokens.css
cp portfolio/src/components/theme-provider.tsx blog/src/components/theme-provider.tsx
cp portfolio/src/components/theme-toggle.tsx blog/src/components/theme-toggle.tsx
cp portfolio/src/components/locale-switcher.tsx blog/src/components/locale-switcher.tsx
cp portfolio/src/components/site-header.tsx blog/src/components/site-header.tsx
cp portfolio/src/components/site-footer.tsx blog/src/components/site-footer.tsx
cp portfolio/src/components/mobile-navigation.tsx blog/src/components/mobile-navigation.tsx
cp portfolio/src/i18n/config.ts blog/src/i18n/config.ts
```

Expected: no source changes are made during copying.

- [ ] **Step 2: Write the shared shell test**

Assert the blog header exposes Portfolio, Blog, theme, and locale actions; assert the footer includes the identical identity, external links, language control, and current copyright. Reuse the same public component props from the portfolio test.

- [ ] **Step 3: Add blog dictionaries and locale layout**

Create parallel Indonesian and English dictionaries with keys under `navigation`, `theme`, `blog`, `article`, `footer`, `errors`, and `actions`. Redirect `/` to `/id`; generate static params for `id` and `en`; validate unsupported locales with `notFound()`.

- [ ] **Step 4: Configure fonts and theme provider**

Use Inter and Geist Mono through `next/font/google`, set the same body variables, add `suppressHydrationWarning`, and wrap the locale page tree with the copied ThemeProvider. Import `design-tokens.css` before blog-specific global styles.

- [ ] **Step 5: Run the shared shell checks**

Run:

```bash
npm test -- src/components/shared-shell.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit the canonical blog shell**

Run:

```bash
git add src/styles src/components src/i18n src/app
git commit -m "feat: apply shared indra dev shell"
```

### Task 3: Build the Validated MDX Content Pipeline

**Files:**
- Create: `content/posts/id/.gitkeep`
- Create: `content/posts/en/.gitkeep`
- Create: `src/content/post-schema.ts`
- Create: `src/content/post-types.ts`
- Create: `src/content/post-repository.ts`
- Create: `src/content/post-repository.test.ts`
- Create: `src/content/toc.ts`
- Create: `src/content/toc.test.ts`
- Create: `src/test/fixtures/posts/id/react-state.mdx`
- Create: `src/test/fixtures/posts/en/react-state.mdx`
- Create: `scripts/validate-content.ts`

**Interfaces:**
- Produces `PostFrontmatter`, `PostSummary`, `PostDocument`, and `TableOfContentsItem` types.
- Produces `getAllPosts(locale)`, `getPostBySlug(locale, slug)`, `getRelatedPosts(post, limit)`, `getSeriesNeighbors(post)`, `getTranslationPath(translationKey, targetLocale)`, and `extractTableOfContents(source)`.
- Published content root is `content/posts/<locale>/*.mdx`; test fixtures use a separate root injected into repository functions.

- [ ] **Step 1: Define the post types and failing repository tests**

Create these core types:

```ts
export type PostFrontmatter = {
  title: string
  slug: string
  description: string
  locale: 'id' | 'en'
  translationKey: string
  publishedAt: string
  updatedAt?: string
  topics: string[]
  series?: string
  seriesOrder?: number
  cover?: string
  draft: boolean
  canonical?: string
  socialTitle?: string
  socialDescription?: string
}

export type PostSummary = PostFrontmatter & {
  readingTimeMinutes: number
}

export type PostDocument = PostSummary & {source: string}
```

Tests must assert:

- Draft posts are excluded by default.
- Posts are newest-first.
- Slugs are unique within a locale.
- A series requires both `series` and positive integer `seriesOrder`.
- Both fixture locales resolve through one `translationKey`.
- Related posts share topics but never include the current post.
- Series neighbors follow `seriesOrder`.

- [ ] **Step 2: Run tests and confirm missing repository failures**

Run:

```bash
npm test -- src/content/post-repository.test.ts src/content/toc.test.ts
```

Expected: FAIL because the content modules do not exist.

- [ ] **Step 3: Define strict frontmatter validation**

Use Zod with ISO date strings, supported locales, at least one topic, unique nonempty slug, and a refinement requiring `series` and `seriesOrder` together. Reject future malformed publications, but allow a future `publishedAt` only when `draft` is true.

Create the Indonesian fixture with this frontmatter and body:

````mdx
---
title: "Memisahkan Server State dari UI State"
slug: "react-server-state"
description: "Batas praktis antara cache server, state antarmuka, dan URL."
locale: "id"
translationKey: "react-server-state"
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React", "TypeScript"]
series: "React Architecture"
seriesOrder: 1
draft: false
---

## Tentukan sumber kebenaran

State server dan state antarmuka memiliki siklus hidup yang berbeda.

```ts
type RequestState =
  | {status: 'idle'}
  | {status: 'success'; data: string[]}
```

## Jaga URL tetap dapat dibagikan

Gunakan URL untuk filter yang perlu dipertahankan saat halaman dibuka ulang.
````

Create the English fixture with this exact content:

````mdx
---
title: "Separating Server State from UI State"
slug: "react-server-state"
description: "A practical boundary between server cache, interface state, and the URL."
locale: "en"
translationKey: "react-server-state"
publishedAt: "2026-08-01T20:00:00+07:00"
topics: ["React", "TypeScript"]
series: "React Architecture"
seriesOrder: 1
draft: false
---

## Define the source of truth

Server state and interface state have different lifecycles.

```ts
type RequestState =
  | {status: 'idle'}
  | {status: 'success'; data: string[]}
```

## Keep the URL shareable

Use the URL for filters that must survive a reload or shared link.
````

- [ ] **Step 4: Implement the repository with an injectable root**

Use this public signature:

```ts
export function createPostRepository(rootDirectory: string): {
  getAllPosts(locale: Locale, options?: {includeDrafts?: boolean}): Promise<PostSummary[]>
  getPostBySlug(locale: Locale, slug: string): Promise<PostDocument | null>
  getRelatedPosts(post: PostSummary, limit?: number): Promise<PostSummary[]>
  getSeriesNeighbors(post: PostSummary): Promise<{previous: PostSummary | null; next: PostSummary | null}>
  getTranslationPath(translationKey: string, targetLocale: Locale): Promise<string | null>
}
```

Create the production repository with `path.resolve(process.env.CONTENT_ROOT ?? path.join(process.cwd(), 'content/posts'))`. Parse frontmatter with gray-matter and derive `readingTimeMinutes` as `Math.max(1, Math.ceil(readingTime(source).minutes))`.

- [ ] **Step 5: Implement AST-based table-of-contents extraction**

Parse MDX source with unified, remark-parse, and remark-mdx; visit depth-two and depth-three headings; derive stable slugs with `github-slugger`, which matches rehype-slug behavior; and return:

```ts
export type TableOfContentsItem = {depth: 2 | 3; title: string; id: string}
```

Test that headings inside fenced code blocks are ignored and duplicate headings receive unique IDs.

- [ ] **Step 6: Implement the content validation command**

`scripts/validate-content.ts` loads both locales, checks all files including drafts, reports file path plus Zod issue, checks locale slug uniqueness and translation-key uniqueness, and exits with status 1 on any violation. It prints only a post count on success.

- [ ] **Step 7: Run content and unit verification**

Run:

```bash
npm run content:validate
npm test -- src/content/post-repository.test.ts src/content/toc.test.ts
npm run typecheck
```

Expected: production content validates as zero posts and fixtures pass repository tests.

- [ ] **Step 8: Commit the content pipeline**

Run:

```bash
git add content src/content src/test/fixtures scripts package.json package-lock.json
git commit -m "feat: add validated mdx content pipeline"
```

### Task 4: Build Blog Discovery, Search, Filters, and Load More

**Files:**
- Create: `src/components/blog/blog-hero.tsx`
- Create: `src/components/blog/post-browser.tsx`
- Create: `src/components/blog/post-browser.test.tsx`
- Create: `src/components/blog/post-card.tsx`
- Create: `src/components/blog/blog-empty-state.tsx`
- Create: `src/lib/filter-posts.ts`
- Create: `src/lib/filter-posts.test.ts`
- Create: `src/app/[locale]/page.tsx`

**Interfaces:**
- Produces `filterPosts(posts, query, topic, series): PostSummary[]`.
- Produces `PostBrowser({posts, locale, pageSize?: number})`; default page size is six.
- Consumes only published summaries from Task 3.

- [ ] **Step 1: Write filtering and pagination tests**

Test case-insensitive matching across title, description, and topics; exact topic and series filters; combined constraints; six initial results; six additional results per Load More click; filter changes resetting visible count; and empty state offering Reset Filters.

- [ ] **Step 2: Confirm focused test failures**

Run:

```bash
npm test -- src/lib/filter-posts.test.ts src/components/blog/post-browser.test.tsx
```

Expected: FAIL because filtering and browser modules do not exist.

- [ ] **Step 3: Implement pure filtering**

Normalize query text with locale-aware lowercase and whitespace trimming. Do not mutate the input array. Apply query, topic, and series in that order and preserve published date ordering.

- [ ] **Step 4: Implement the client-side post browser**

Use a visible `<label>` for search, shadcn Input, accessible filter buttons, a polite result-count live region, and Load More. Keep filters in URL search parameters with `router.replace` so refresh and back navigation preserve discovery state. Primary use remains tap/click; hover is cosmetic only.

- [ ] **Step 5: Compose the server-first index**

The locale page loads `getAllPosts(locale)`, renders the editorial hero, and passes summaries into PostBrowser. With zero posts, render an honest localized publishing-soon message and topic description rather than fabricated cards.

- [ ] **Step 6: Run discovery verification**

Run:

```bash
npm test -- src/lib/filter-posts.test.ts src/components/blog/post-browser.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit blog discovery**

Run:

```bash
git add src/components/blog src/lib/filter-posts.ts src/lib/filter-posts.test.ts 'src/app/[locale]/page.tsx'
git commit -m "feat: add technical blog discovery"
```

### Task 5: Render Accessible MDX Articles and Code Blocks

**Files:**
- Create: `src/mdx-components.tsx`
- Create: `src/components/article/article-breadcrumbs.tsx`
- Create: `src/components/article/article-header.tsx`
- Create: `src/components/article/article-prose.tsx`
- Create: `src/components/article/table-of-contents.tsx`
- Create: `src/components/article/code-block.tsx`
- Create: `src/components/article/code-block.test.tsx`
- Create: `src/components/article/series-navigation.tsx`
- Create: `src/components/article/related-posts.tsx`
- Create: `src/components/article/share-links.tsx`
- Create: `src/app/[locale]/blog/[slug]/page.tsx`
- Create: `src/app/[locale]/blog/[slug]/not-found.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Produces statically generated localized article pages.
- `CodeBlock` copies its rendered code text and announces success through `aria-live="polite"`.
- Locale switch receives the resolved translated article path or the target blog index.

- [ ] **Step 1: Write the failing copy-code interaction test**

Create a test that stubs `navigator.clipboard.writeText`, renders `CodeBlock` with `const value = 1`, clicks Copy code, expects the exact text passed to the clipboard, and expects a polite `Copied` status that returns to `Copy code` after the configured timeout.

- [ ] **Step 2: Confirm the component test fails**

Run:

```bash
npm test -- src/components/article/code-block.test.tsx
```

Expected: FAIL because CodeBlock does not exist.

- [ ] **Step 3: Configure server-side MDX compilation**

Use `next-mdx-remote/rsc` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, and `rehype-pretty-code`. Configure the light and dark Shiki themes to match the semantic surfaces. Do not ship a browser syntax-highlighting runtime.

- [ ] **Step 4: Implement article primitives**

ArticleBreadcrumbs renders Home, Blog, and the current article using semantic navigation markup. ArticleHeader renders title, description, topics, publication/update dates, reading time, and series context. TableOfContents renders only when at least two eligible headings exist. ArticleProse caps text at `--prose-max`. CodeBlock uses a relative wrapper, visible language label when available, 44-pixel Copy target, and clipboard failure status with a manual-selection instruction.

- [ ] **Step 5: Implement the article route**

Generate static params from all published posts. Return localized not-found UI for absent or draft slugs. Compile source, resolve table of contents, translation path, series neighbors, and three related posts in parallel. Render ArticleBreadcrumbs above ArticleHeader, then generate Article and BreadcrumbList JSON-LD plus localized canonical and alternate URLs.

- [ ] **Step 6: Add series, related, and share behavior**

Series navigation always exposes a predictable previous/next path. Related posts are links with topic and reading-time context. ShareLinks provides Web Share when available and LinkedIn/copy-link fallbacks without requiring login or third-party script loading.

- [ ] **Step 7: Verify article behavior**

Run:

```bash
npm test -- src/components/article/code-block.test.tsx src/content/toc.test.ts
npm run lint
npm run typecheck
npm run build
```

Expected: fixture-backed unit tests pass and production builds correctly with zero published posts.

- [ ] **Step 8: Commit article rendering**

Run:

```bash
git add next.config.ts src/mdx-components.tsx src/components/article 'src/app/[locale]/blog'
git commit -m "feat: render accessible technical articles"
```

### Task 6: Add Latest-Post API, RSS, Sitemap, Robots, and Social Metadata

**Files:**
- Create: `src/content/latest-feed-schema.ts`
- Create: `src/content/latest-feed.ts`
- Create: `src/content/latest-feed.test.ts`
- Create: `src/app/api/posts/latest/route.ts`
- Create: `src/app/[locale]/rss.xml/route.ts`
- Create: `src/app/[locale]/opengraph-image.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/lib/site-config.ts`
- Create: `.env.example`

**Interfaces:**
- Produces versioned `LatestPostFeedV1` consumed by the portfolio integration plan.
- Public endpoint: `GET /api/posts/latest?locale=id&limit=3`.
- Public RSS endpoint: `GET /<locale>/rss.xml`.

- [ ] **Step 1: Define and test the feed contract**

Use this exact shape:

```ts
export type LatestPostFeedV1 = {
  version: 1
  locale: 'id' | 'en'
  generatedAt: string
  posts: Array<{
    title: string
    slug: string
    description: string
    locale: 'id' | 'en'
    publishedAt: string
    topics: string[]
    readingTimeMinutes: number
  }>
}
```

Tests assert limit clamps between one and ten, drafts never appear, locale defaults to `id`, unsupported locale returns 400, and the response validates against its Zod schema.

- [ ] **Step 2: Verify the feed tests fail**

Run:

```bash
npm test -- src/content/latest-feed.test.ts
```

Expected: FAIL because feed modules do not exist.

- [ ] **Step 3: Implement feed serialization and route handling**

Keep serialization pure and inject `generatedAt` in tests. Route handler validates URL parameters, returns `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`, and never returns MDX source or draft metadata.

- [ ] **Step 4: Implement RSS and global metadata**

RSS contains localized title, canonical article URLs, descriptions, publication dates, and topics. Sitemap includes both locale indexes and every published article. Robots uses the environment origin. Open Graph images use the wordmark, article title or blog descriptor, topic, and blue editorial accent.

- [ ] **Step 5: Validate site configuration**

Use Zod to read `NEXT_PUBLIC_BLOG_URL`, `NEXT_PUBLIC_PORTFOLIO_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, and `NEXT_PUBLIC_LINKEDIN_URL`. `.env.example` holds the production values: `https://blog-indra.vercel.app/`, `https://portfolio-mahadi-indra.vercel.app/`, `mahadiindra2@gmail.com`, and `https://www.linkedin.com/in/mahadindra/`. Source fallbacks in `src/lib/site-config.ts` match them.

- [ ] **Step 6: Run feed and build verification**

Run:

```bash
npm test -- src/content/latest-feed.test.ts
npm run content:validate
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit public discovery endpoints**

Run:

```bash
git add src/content/latest-feed* src/app/api src/app/robots.ts src/app/sitemap.ts 'src/app/[locale]/rss.xml' 'src/app/[locale]/opengraph-image.tsx' src/lib/site-config.ts .env.example
git commit -m "feat: expose blog feeds and metadata"
```

### Task 7: Add Loading, Empty, Error, and Localization Recovery States

**Files:**
- Create: `src/app/[locale]/loading.tsx`
- Create: `src/app/[locale]/error.tsx`
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/components/article/translation-notice.tsx`
- Create: `src/components/article/translation-notice.test.tsx`
- Modify: `src/components/locale-switcher.tsx`

**Interfaces:**
- Missing article translation navigates to `/<targetLocale>` and displays a nonblocking localized explanation.
- Route errors expose Retry and Home actions.

- [ ] **Step 1: Write the missing-translation test**

Test that an absent `targetPath` produces `/<targetLocale>?translation=unavailable` and that the destination renders a polite explanation with a dismiss control.

- [ ] **Step 2: Confirm the test fails**

Run:

```bash
npm test -- src/components/article/translation-notice.test.tsx
```

Expected: FAIL until the notice and locale-switch behavior exist.

- [ ] **Step 3: Implement localized recovery states**

Loading reserves hero and article geometry. Error state describes the failure and exposes Retry. Not Found offers Blog Home and Portfolio. TranslationNotice reads the query marker once, announces it politely, and can be dismissed without affecting filters.

- [ ] **Step 4: Verify recovery behavior**

Run:

```bash
npm test -- src/components/article/translation-notice.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit recovery states**

Run:

```bash
git add 'src/app/[locale]' src/components/article/translation-notice*
git commit -m "feat: add localized blog recovery states"
```

### Task 8: Verify Blog Discovery, Reading, Accessibility, and Responsive Flows

**Files:**
- Create: `e2e/blog.spec.ts`
- Create: `e2e/article.spec.ts`
- Create: `e2e/accessibility.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Produces the Blog MVP acceptance suite and content-authoring instructions.

- [ ] **Step 1: Add one private E2E fixture publication**

Configure E2E setup to copy the two test fixture posts into a temporary content root selected by `CONTENT_ROOT` during Playwright's web server command. Do not copy fixture articles into production `content/posts`.

- [ ] **Step 2: Write discovery E2E coverage**

Test search, topic filter, series filter, URL state retention, reset, Load More, empty results, locale switch, theme persistence, mobile navigation, and cross-site Portfolio link.

- [ ] **Step 3: Write article E2E coverage**

Test article metadata, table of contents, heading anchor, copy code, series navigation, related posts, share fallback, translated article navigation, missing translation recovery, RSS endpoint, and latest-post JSON endpoint.

- [ ] **Step 4: Write accessibility coverage**

Run axe on blog index and article in both themes; assert no serious or critical violations; verify skip link, heading order, named icon controls, keyboard mobile menu, 44-pixel copy button, and reduced-motion computed animation duration.

- [ ] **Step 5: Run the complete blog gate**

Run:

```bash
npx playwright install chromium
npm run content:validate
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Expected: every command passes.

- [ ] **Step 6: Document safe content operations**

README must define the MDX schema, locale directory rules, translation keys, topic and series conventions, validation command, publication date semantics in Asia/Jakarta, draft behavior, test fixture separation, feed endpoint, environment names, and the fact that Hermes scheduling is outside this MVP.

- [ ] **Step 7: Commit the verified Blog MVP**

Run:

```bash
git add e2e README.md src scripts
git commit -m "test: verify technical blog mvp flows"
```

# Single-Language Root Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the blog from locale-prefixed Indonesian/English routing to a single Indonesian blog rooted at `/`, with no English or locale-switching code remaining.

**Architecture:** Replace the dynamic `src/app/[locale]` route tree with static root routes: `/`, `/blog/[slug]`, `/rss.xml`, and `/opengraph-image`. Flatten content into one `content/posts` directory, remove locale and translation identity from post data, retain one Indonesian UI dictionary, and merge the shared shell into the root layout.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Zod, gray-matter, Vitest, Testing Library, Playwright, ESLint, Prettier.

## Global Constraints

- `/` is the canonical blog homepage; articles use `/blog/<slug>`; RSS uses `/rss.xml`.
- Requests under `/id` and `/en` return 404; do not add compatibility redirects.
- Post frontmatter contains no `locale` or `translationKey` fields.
- The latest-post API accepts `limit` only and exposes no locale fields.
- All user-facing UI copy is Indonesian; brand names and technical terms remain unchanged.
- Update README, active documentation, and every historical spec/plan that describes the old locale architecture.
- Do not add dependencies, change theme behavior, alter external navigation destinations, or add content.
- Use the existing `CONTENT_ROOT` override for tests, with the override pointing directly to a directory of `.mdx` files.

---

### Task 1: Collapse the content model and repository to one directory

**Files:**

- Modify: `src/content/post-types.ts`
- Modify: `src/content/post-schema.ts`
- Modify: `src/content/post-repository.ts`
- Modify: `src/content/post-repository.test.ts`
- Modify: `scripts/validate-content.ts`
- Move and modify: `content/posts/id/cache-components-precompute.mdx` → `content/posts/cache-components-precompute.mdx`
- Move and modify: `content/posts/id/optimistic-ui-server-actions.mdx` → `content/posts/optimistic-ui-server-actions.mdx`
- Move and modify: `content/posts/id/react-compiler-memo-otomatis.mdx` → `content/posts/react-compiler-memo-otomatis.mdx`
- Move and modify: `src/test/fixtures/posts/id/draft.mdx` → `src/test/fixtures/posts/draft.mdx`
- Move and modify: `src/test/fixtures/posts/id/react-state.mdx` → `src/test/fixtures/posts/react-state.mdx`
- Move and modify: `src/test/fixtures/posts/id/typescript-errors.mdx` → `src/test/fixtures/posts/typescript-errors.mdx`
- Delete: `src/test/fixtures/posts/en/react-state.mdx`

**Interfaces:**

- `PostFrontmatter` contains `title`, `slug`, `description`, `publishedAt`, optional `updatedAt`, `topics`, optional `series` and `seriesOrder`, optional `cover`, `draft`, optional `canonical`, optional `socialTitle`, and optional `socialDescription`.
- `parsePostSource(source: string, filePath: string): PostFileResult` validates one-language frontmatter without a directory locale argument.
- `createPostRepository(rootDirectory)` reads `.mdx` files directly from `rootDirectory`.
- `getAllPosts(options?: { includeDrafts?: boolean }): Promise<PostSummary[]>` returns published posts newest first.
- `getPostBySlug(slug: string): Promise<PostDocument | null>` finds one published article.
- `getRelatedPosts(post: PostSummary, limit?: number)` and `getSeriesNeighbors(post: PostSummary)` preserve their existing behavior without reading `post.locale`.
- `getTranslationPath` is removed.

- [ ] **Step 1: Update the repository tests to describe the locale-free contract.**

  Change calls from `repository.getAllPosts("id")` to `repository.getAllPosts()`,
  change `repository.getPostBySlug("id", "react-state")` to
  `repository.getPostBySlug("react-state")`, delete the translation-key test,
  and write duplicate-fixture frontmatter without `locale` or
  `translationKey`:

  ```ts
  const frontmatter = `---
  title: "Duplicate"
  slug: "same-slug"
  description: "Duplicate"
  publishedAt: "2026-08-01T20:00:00+07:00"
  topics: ["React"]
  draft: false
  ---
  
  Content`;
  ```

  Keep the assertions for newest-first ordering, draft exclusion, reading
  time, related posts, series neighbors, and duplicate-slug de-duplication.

- [ ] **Step 2: Run the repository test before implementation and confirm it fails for the old API.**

  Run:

  ```bash
  rtk npm test -- src/content/post-repository.test.ts
  ```

  Expected result: FAIL because the current repository still requires a locale
  and the fixture frontmatter still requires locale fields.

- [ ] **Step 3: Remove locale and translation fields from the types and schema.**

  Delete `LOCALES`, `Locale`, `locale`, and `translationKey` from
  `src/content/post-types.ts`. Remove the corresponding Zod fields from
  `postFrontmatterSchema` while keeping `.strict()` and the existing series
  pairing refinement.

- [ ] **Step 4: Make the repository read the root content directory.**

  Replace `readLocalePosts(rootDirectory, locale)` with a reader that calls
  `readdir(rootDirectory)`, filters `.mdx`, and passes each file to
  `parsePostSource(source, filePath)`. Preserve ENOENT-as-empty behavior,
  future publication rejection, published filtering, newest-first sorting, and
  duplicate-slug de-duplication. Remove locale parameters and the
  `getTranslationPath` implementation from the returned repository object.

- [ ] **Step 5: Flatten and update MDX files and fixtures.**

  Keep the existing article content and filenames, remove only the two deleted
  frontmatter fields, and place each file directly under its new root
  directory. Keep the draft fixture so validator and repository tests continue
  to prove draft exclusion. Remove the English fixture entirely.

- [ ] **Step 6: Simplify the content validator.**

  In `scripts/validate-content.ts`, set `root` to `CONTENT_ROOT` or
  `content/posts`, enumerate `.mdx` files directly from `root`, parse them
  without an expected locale, collect `{ slug, filePath }`, and report duplicate
  slugs with both file paths. Remove locale loops, translation-key checks, and
  the `locales` import.

- [ ] **Step 7: Run the repository and content checks.**

  Run:

  ```bash
  rtk npm test -- src/content/post-repository.test.ts
  rtk npm run content:validate
  ```

  Expected result: both commands pass, and the validator reports the count of
  Indonesian production posts without mentioning a locale.

- [ ] **Step 8: Commit the content-model change.**

  ```bash
  git add src/content scripts/validate-content.ts content/posts src/test/fixtures/posts
  git commit -m "refactor: remove locale fields from blog content"
  ```

### Task 2: Keep one Indonesian dictionary and remove locale-aware components

**Files:**

- Modify: `src/i18n/dictionaries.ts`
- Modify: `src/i18n/messages/id.json`
- Delete: `src/i18n/config.ts`
- Delete: `src/i18n/messages/en.json`
- Delete: `src/components/locale-switcher.tsx`
- Delete: `src/components/locale-switcher.test.tsx`
- Delete: `src/components/article/translation-notice.tsx`
- Delete: `src/components/article/translation-notice.test.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/components/mobile-navigation.tsx`
- Modify: `src/components/blog/post-browser.tsx`
- Modify: `src/components/blog/post-card.tsx`
- Modify: `src/components/article/article-breadcrumbs.tsx`
- Modify: `src/components/article/article-header.tsx`
- Modify: `src/components/article/related-posts.tsx`
- Modify: `src/components/article/series-navigation.tsx`
- Modify: `src/components/shared-shell.test.tsx`
- Modify: `src/components/article/code-block.test.tsx`
- Modify: `src/components/theme-toggle.test.tsx`

**Interfaces:**

- `getDictionary(): Dictionary` returns the current Indonesian messages.
- `SiteHeader()`, `SiteFooter()`, and `MobileNavigation({ dictionary })` have no locale prop.
- `PostBrowser({ posts, dictionary, pageSize? })` has no locale prop.
- `ArticleBreadcrumbs({ title, dictionary })` links both home and blog labels to `/`.
- `ArticleHeader({ post, dictionary })` has no translation path and renders no translation link.
- `PostCard`, `RelatedPosts`, and `SeriesNavigation` link to `/blog/<slug>`.

- [ ] **Step 1: Update component tests for the Indonesian-only shell.**

  In `shared-shell.test.tsx`, render `<SiteHeader />` and `<SiteFooter />`,
  assert the theme and existing external links, assert the Indonesian copy,
  and assert that no language switcher or language button exists. In code-block
  and theme-toggle tests, replace `getDictionary("en")` and
  `getDictionary("id")` with `getDictionary()`.

- [ ] **Step 2: Run the component tests and confirm the old API fails.**

  Run:

  ```bash
  rtk npm test -- src/components/shared-shell.test.tsx src/components/article/code-block.test.tsx src/components/theme-toggle.test.tsx
  ```

  Expected result: FAIL because the current dictionary and component APIs still
  require locale-aware props and the old switcher is rendered.

- [ ] **Step 3: Collapse the dictionary API.**

  Make `dictionaries.ts` import only the Indonesian JSON, export the existing
  `Dictionary` type, and implement:

  ```ts
  import id from "./messages/id.json";

  export type Dictionary = typeof id;

  export function getDictionary(): Dictionary {
    return id;
  }
  ```

  Delete locale configuration and the English JSON. Remove obsolete
  translation, language-switch, and dismiss-message keys from `id.json` only
  after all consumers are removed.

- [ ] **Step 4: Remove locale props and rewrite internal links.**

  Remove locale imports and props from the listed components. Use `/` for the
  wordmark, blog navigation, breadcrumbs, footer, and mobile navigation. Use
  `/blog/${post.slug}` for article, related-post, and series links. Change all
  date helpers to `new Intl.DateTimeFormat("id-ID", ...)` and remove the
  translation link block from `ArticleHeader`.

- [ ] **Step 5: Translate remaining static UI copy.**

  Replace static English UI text with Indonesian equivalents, including
  `Lewati ke konten`, `Terjadi kesalahan`, `Tulisan tidak ditemukan`, `Kembali
ke Blog`, and `Memuat tulisan`. Keep “INDRA.DEV”, product names, and
  technical terms such as React and TypeScript unchanged.

- [ ] **Step 6: Remove the translation components and update CSS consumers.**

  Delete the switcher and translation-notice source/tests. Remove their imports
  and JSX from all consumers. Leave unrelated theme, navigation, footer, and
  notice styling intact until the dedicated CSS cleanup task.

- [ ] **Step 7: Run the component tests.**

  Run the same targeted Vitest command from Step 2. Expected result: PASS with
  no language switcher, translation notice, or English dictionary import.

- [ ] **Step 8: Commit the UI and dictionary change.**

  ```bash
  git add src/i18n src/components
  git commit -m "refactor: make blog UI Indonesian-only"
  ```

### Task 3: Replace the locale route tree with root routes

**Files:**

- Modify: `src/app/layout.tsx`
- Replace: `src/app/page.tsx`
- Create: `src/app/loading.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/blog/[slug]/not-found.tsx`
- Create: `src/app/rss.xml/route.ts`
- Create: `src/app/opengraph-image.tsx`
- Delete: `src/app/[locale]/layout.tsx`
- Delete: `src/app/[locale]/page.tsx`
- Delete: `src/app/[locale]/loading.tsx`
- Delete: `src/app/[locale]/error.tsx`
- Delete: `src/app/[locale]/not-found.tsx`
- Delete: `src/app/[locale]/blog/[slug]/page.tsx`
- Delete: `src/app/[locale]/blog/[slug]/not-found.tsx`
- Delete: `src/app/[locale]/rss.xml/route.ts`
- Delete: `src/app/[locale]/opengraph-image.tsx`

**Interfaces:**

- Root layout renders the `ThemeProvider`, skip link, `SiteHeader`, children,
  and `SiteFooter` using `getDictionary()`.
- Root page loads `postRepository.getAllPosts()` and renders
  `BlogHero`, `PostBrowser`, and the existing Suspense fallback.
- Article page receives `params: Promise<{ slug: string }>` and calls
  `postRepository.getPostBySlug(slug)`, `getSeriesNeighbors(post)`, and
  `getRelatedPosts(post, 3)`.
- `generateStaticParams()` returns `{ slug }` for every published post.

- [ ] **Step 1: Merge the shared locale layout into the root layout.**

  Keep the existing root `<html lang="id">`, fonts, metadata base, and global
  CSS. Add `ThemeProvider`, the Indonesian skip link, `SiteHeader`, children,
  and `SiteFooter` from the former locale layout. The header and footer receive
  no locale argument and load the single dictionary internally. Remove locale
  params and alternate-language metadata.

- [ ] **Step 2: Convert the root page and root states.**

  Replace the redirect in `src/app/page.tsx` with the blog index structure,
  using `postRepository.getAllPosts()` and `getDictionary()` while omitting the
  deleted translation notice. Move the loading, error, and not-found UI to root
  files, update links to `/`, and keep the existing retry behavior. Preserve
  the article-specific not-found page under `src/app/blog/[slug]/not-found.tsx`.

- [ ] **Step 3: Move the article route to `/blog/[slug]`.**

  Remove the locale param and static-param locale loop. Generate metadata with
  canonical `${siteConfig.blogUrl}/blog/${post.slug}`, no `alternates.languages`,
  and the Indonesian dictionary. Render breadcrumbs, header, prose, table of
  contents, series navigation, related posts, and share links with their new
  locale-free props.

- [ ] **Step 4: Move the RSS and Open Graph handlers to the root segment.**

  Implement the RSS handler at `src/app/rss.xml/route.ts` with no params,
  Indonesian channel copy, and article links `${siteConfig.blogUrl}/blog/${post.slug}`.
  Implement the Open Graph image at `src/app/opengraph-image.tsx` using the
  single Indonesian dictionary and no locale fallback.

- [ ] **Step 5: Delete the dynamic route tree and verify the route file map.**

  Delete every file listed under `src/app/[locale]`, then run:

  ```bash
  test ! -d 'src/app/[locale]'
  rg --files src/app | rg '^(src/app/(page|layout|loading|error|not-found|opengraph-image|sitemap|rss\.xml/route)|src/app/blog/\[slug\]/(page|not-found))'
  rtk git diff --check
  ```

  Expected result: the locale route directory is absent, the root route file
  map is present, and the diff has no whitespace errors. Full typecheck is
  intentionally deferred until Task 4 finishes the feed/API signature
  migration.

- [ ] **Step 6: Commit the root route migration.**

  ```bash
  git add src/app
  git commit -m "refactor: move blog routes to root"
  ```

### Task 4: Make feed, API, sitemap, and metadata contracts locale-free

**Files:**

- Modify: `src/content/latest-feed-schema.ts`
- Modify: `src/content/latest-feed.ts`
- Modify: `src/content/latest-feed.test.ts`
- Modify: `src/app/api/posts/latest/route.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/rss.xml/route.ts`

**Interfaces:**

- `latestPostFeedSchema` validates `{ version, generatedAt, posts }`; each post
  has title, slug, description, publishedAt, topics, and readingTimeMinutes.
- `buildLatestFeed(posts, limit = 3, generatedAt = new Date().toISOString())`
  filters drafts, clamps limit to 1–10, and returns the locale-free V1 shape.
- `parseLatestFeedQuery(params): { limit: number } | { error: string }` validates
  only a positive integer `limit` and defaults to 3.
- API route calls `postRepository.getAllPosts()` and
  `buildLatestFeed(posts, parsed.limit)`.

- [ ] **Step 1: Rewrite latest-feed tests for the locale-free response.**

  Remove `locale` and `translationKey` from the fixture post type, call
  `buildLatestFeed(posts, 99, generatedAt)`, assert the 10-post clamp and draft
  exclusion, assert the schema version, and replace locale query tests with:

  ```ts
  expect(parseLatestFeedQuery(new URLSearchParams())).toEqual({ limit: 3 });
  expect(parseLatestFeedQuery(new URLSearchParams("limit=0"))).toEqual({
    error: "Limit must be a positive integer",
  });
  expect(parseLatestFeedQuery(new URLSearchParams("limit=4"))).toEqual({
    limit: 4,
  });
  ```

- [ ] **Step 2: Run the feed tests before implementation and confirm failure.**

  Run:

  ```bash
  rtk npm test -- src/content/latest-feed.test.ts
  ```

  Expected result: FAIL because the schema and functions currently require
  locale fields.

- [ ] **Step 3: Remove locale from the feed schema and builder.**

  Delete locale imports and fields from `latest-feed-schema.ts`. Update
  `latest-feed.ts` so the builder filters only `!post.draft`, maps the six
  published metadata fields, and parses the new schema. Remove unsupported
  locale-query validation; retain invalid-limit validation and clamping.

- [ ] **Step 4: Update the API route.**

  Parse only `limit`, fetch all posts once, and build the feed with the new
  signature. Preserve the 400 response for invalid limits and the existing
  cache headers.

- [ ] **Step 5: Update sitemap and article metadata.**

  Make sitemap return the root URL plus each published `/blog/<slug>` URL.
  Remove locale iteration and alternate-language entries. Ensure article
  metadata has one canonical URL and no `alternates.languages` object.

- [ ] **Step 6: Run feed and type checks.**

  Run:

  ```bash
  rtk npm test -- src/content/latest-feed.test.ts
  rtk npm run typecheck
  ```

  Expected result: PASS.

- [ ] **Step 7: Commit the public-contract change.**

  ```bash
  git add src/content/latest-feed* src/app/api/posts/latest src/app/sitemap.ts 'src/app/blog/[slug]/page.tsx' src/app/rss.xml/route.ts
  git commit -m "refactor: remove locale data from feeds"
  ```

### Task 5: Remove locale CSS and update browser verification

**Files:**

- Modify: `src/app/globals.css`
- Modify: `playwright.config.ts`
- Modify: `e2e/blog.spec.ts`
- Modify: `e2e/article.spec.ts`
- Modify: `e2e/accessibility.spec.ts`

- [ ] **Step 1: Update browser routes and assertions.**

  In all E2E files, change index navigation from `/id` to `/`, article
  navigation from `/en/blog/react-state` to `/blog/react-state`, RSS from
  `/en/rss.xml` to `/rss.xml`, and API requests from
  `/api/posts/latest?locale=id&limit=3` to `/api/posts/latest?limit=3`.
  Remove language-switch assertions. Add a test that checks the response status
  for both `/id` and `/en` is 404:

  ```ts
  test("legacy locale routes are unavailable", async ({ request }) => {
    expect((await request.get("/id")).status()).toBe(404);
    expect((await request.get("/en")).status()).toBe(404);
  });
  ```

  Keep accessibility checks for the root index and `/blog/react-state`.

- [ ] **Step 2: Update the Playwright web server URL.**

  Change `webServer.url` from `http://127.0.0.1:3001/id` to
  `http://127.0.0.1:3001/`. Keep `CONTENT_ROOT=src/test/fixtures/posts`.

- [ ] **Step 3: Run the browser tests after the route and API changes.**

  Run:

  ```bash
  PORT=3002 npx playwright test e2e/blog.spec.ts e2e/article.spec.ts e2e/accessibility.spec.ts --project=chromium --workers=1
  ```

  Expected result: the updated root, article, feed, and legacy-404 assertions
  pass before the locale-only CSS is removed.

- [ ] **Step 4: Remove locale-only CSS.**

  Delete `.locale-button`, `.locale-button:hover`, `.locale-switcher`,
  `.locale-menu`, `.locale-menu:hover`, and the responsive
  `.header-actions > .locale-switcher` rules from `src/app/globals.css`.
  Preserve all header, mobile-navigation, footer, theme, and notice rules that
  have no locale-switcher consumer.

- [ ] **Step 5: Run browser and accessibility tests.**

  Run the command from Step 3 again. Expected result: PASS, including root and
  article accessibility checks, canonical RSS, and 404 responses for both old
  locale families.

- [ ] **Step 6: Commit browser and CSS cleanup.**

  ```bash
  git add src/app/globals.css playwright.config.ts e2e
  git commit -m "test: verify single-language root routes"
  ```

### Task 6: Rewrite all project documentation for the root Indonesian blog

**Files:**

- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-10-indra-dev-blog-design.md`
- Modify: `docs/superpowers/plans/2026-08-10-indra-dev-blog-mvp.md`
- Modify: `docs/superpowers/specs/2026-08-11-direct-locale-switcher-design.md`
- Modify: `docs/superpowers/plans/2026-08-11-direct-locale-switcher.md`
- Modify: `docs/superpowers/specs/2026-08-10-hermes-daily-post-schedule-design.md`
- Modify: `docs/superpowers/plans/2026-08-11-prettier-pre-commit.md`
- Keep unchanged: `docs/superpowers/specs/2026-08-11-prettier-pre-commit-design.md` unless its route examples contradict the root architecture.
- Keep unchanged: `docs/superpowers/plans/2026-08-10-hermes-daily-post-schedule.md` unless its route/examples contradict the root architecture.
- Keep unchanged: `docs/superpowers/specs/2026-08-12-single-language-root-design.md`

- [ ] **Step 1: Rewrite README current behavior and authoring instructions.**

  Document `/` as the homepage, `/blog/<slug>` as the article URL,
  `content/posts/*.mdx` as the content directory, the reduced frontmatter
  schema without locale fields, `/api/posts/latest?limit=3`, and `/rss.xml`.
  State explicitly that `/id` and `/en` return 404 and that the API response
  contains no locale fields.

- [ ] **Step 2: Update the original MVP spec and plan.**

  Replace claims about parallel Indonesian/English locales, locale-prefixed
  routes, translation keys, alternate-language metadata, and locale-specific
  RSS/API contracts with the approved root architecture. Update file maps,
  frontmatter examples, fixtures, and test scenarios to use the flattened
  `content/posts` directory and root URLs.

- [ ] **Step 3: Rewrite the direct locale-switcher spec and plan.**

  Preserve the files as historical records but replace their implementation
  requirements with the final outcome: the switcher and translation notice are
  removed, the dynamic locale route tree is gone, and root routes are
  Indonesian-only. Remove task instructions that create or test a locale
  switcher.

- [ ] **Step 4: Audit the remaining historical docs.**

  In the Hermes and Prettier documents, update any concrete route, content-path,
  or API example that conflicts with `/` and `content/posts`. Keep scheduling,
  formatting, and non-locale requirements intact. Do not change the meaning of
  the Hermes requirement that generated posts are Indonesian.

- [ ] **Step 5: Verify documentation contains no obsolete architecture claims.**

  Run:

  ```bash
  rg -n -i 'content/posts/(id|en)|/id/blog|/en/blog|/id/rss|/en/rss|translationKey|locales = \["id", "en"\]' README.md docs/superpowers -g '!plans/2026-08-12-single-language-root.md' -g '!specs/2026-08-12-single-language-root-design.md'
  ```

  Expected result: no obsolete implementation claims. Historical references to
  the migration itself may remain only where they describe the decision to
  remove the old architecture.

- [ ] **Step 6: Commit documentation updates.**

  ```bash
  git add README.md docs/superpowers
  git commit -m "docs: update blog architecture for Indonesian root"
  ```

### Task 7: Run the complete verification gate

**Files:**

- Verify all modified source, test, content, and documentation files.

- [ ] **Step 1: Search runtime code for removed locale infrastructure.**

  Run:

  ```bash
  rg -n -i 'LocaleSwitcher|TranslationNotice|getTranslationPath|otherLocale|LOCALES|translationKey|locale=|/id|/en|Switch language|Read in English' src content scripts e2e
  ```

  Expected result: no matches for removed runtime symbols or old canonical
  routes. Legitimate `toLocaleLowerCase` calls are not locale-routing code and
  may remain.

- [ ] **Step 2: Run content validation and all unit tests.**

  ```bash
  rtk npm run content:validate
  rtk npm test
  ```

  Expected result: both commands pass.

- [ ] **Step 3: Run formatting, lint, and typecheck.**

  ```bash
  rtk npm run format:check
  rtk npm run lint
  rtk npm run typecheck
  ```

  Expected result: all commands pass without modifying files.

- [ ] **Step 4: Run the production build.**

  ```bash
  rtk npm run build
  ```

  Expected result: the build completes with root and article routes and no
  locale route output.

- [ ] **Step 5: Run the complete E2E suite.**

  ```bash
  PORT=3002 npx playwright test --project=chromium --workers=1
  ```

  Expected result: all browser, article, feed, theme, and accessibility tests
  pass, including 404 checks for `/id` and `/en`.

- [ ] **Step 6: Check the final diff and working tree.**

  ```bash
  rtk git diff --check
  rtk git status --short
  ```

  Expected result: no whitespace errors and only intentional committed or
  uncommitted changes remain.

- [ ] **Step 7: Commit any final verification-only fixes.**

  If a verification command identifies a real implementation mismatch, fix the
  smallest relevant file, rerun the failed command, and commit the fix with a
  message describing the specific correction. Do not claim completion until
  every command above has passed.

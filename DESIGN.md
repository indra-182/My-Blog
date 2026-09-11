---
name: INDRA.DEV Blog
description: Decision Atlas reading stage for durable Indonesian technical writing.
---

# Design System: INDRA.DEV Blog

## North star

Decision Atlas treats an article as a route through a set of engineering
decisions. The portfolio can be expressive and persuasive; this reading stage
is deliberately quieter. Lines and nodes only describe a real relationship:
the featured route, article progress, a heading, or an interactive state.

The homepage opens with a restrained atlas field, then puts one published
article on the featured route before discovery. Article pages use a progress
map for wayfinding, while prose stays still so code and long-form reading are
never asked to follow an animation.

## Foundations

### Palette

The six shared Decision Atlas values are:

- **Night Water** `#07161D`: dark canvas.
- **Survey Paper** `#EDF1F2`: light canvas and dark-mode text.
- **Deep Ink** `#12242C`: light-mode text and popover surface.
- **Map Fog** `#B8C6CB`: supporting text and quiet structure.
- **Route Blue** `#2E5BFF`: route links, progress, and directional emphasis.
- **Signal Orange** `#FF6A3D`: active markers, nodes, and feedback.

Light mode uses Survey Paper and Deep Ink. Dark mode uses Night Water and
Survey Paper. Surfaces are a six-percent foreground mix; accents never carry
state alone because active links also change text, border, or position.

### Typography

Recursive Variable is self-hosted for display, UI, metadata, and code labels;
the canonical roles are `--font-ui`, `--font-prose`, and `--font-mono`.
Its stable metrics make the `CASL`, `MONO`, and `wght` axes safe for a
signature interaction without text reflow. Literata Variable is self-hosted
for article prose only. Both font files and their OFL 1.1 licenses live in
`public/fonts`.

- Display: `clamp(3rem, 8vw, 7.5rem)` where a route state needs it.
- Section: `clamp(2rem, 4.5vw, 4.25rem)`.
- Title: `clamp(1.4rem, 2.5vw, 2.25rem)`.
- Body: `1rem / 1.65`.
- Prose: `clamp(1.05rem, 1.5vw, 1.15rem) / 1.75`.

Content is left-aligned. Reading measures cap at `72ch`; the shell caps at
`76rem` and keeps a `1rem` mobile / `1.5rem` wide gutter.

### Shape and depth

The stage is flat at rest. Small rectangular corners (`0.2rem`) are for
controls and route boundaries; pill corners are reserved for topic badges.
There are no card shadows, glass panels, external font requests, WebGL, or
decorative index rails. One-pixel rules separate real sections and states.

## Motion grammar

The local `motion` package is loaded once through `LazyMotion` in
`MotionProvider`. Client islands are limited to the featured route path,
archive filter layout, article progress, theme/menu controls, disclosure and
feedback actions, and back-to-top behavior. Page composition, content, SEO,
and MDX remain Server Components. There is no route transition.

Motion tokens are intentionally small and named by responsibility:

- `--motion-feedback`: `160ms`;
- `--motion-state`: `260ms`;
- `--motion-entrance`: `520ms`;
- `--motion-path`: `900ms`, with `--motion-ease` `[0.16, 1, 0.3, 1]`;
- `--motion-spring-stiffness: 260`, `--motion-spring-damping: 28`, and
  `--motion-spring-mass: 0.8`.

`prefers-reduced-motion: reduce` renders the final state immediately. It
removes path drawing, parallax, smooth scrolling, entrance transforms, and
non-essential transitions. Native scrolling remains available in every mode.

## Reading surfaces

### Homepage

The order is hero, featured route, search/filter archive, and footer. The
featured route is a published post selected by frontmatter; if no post is
featured, the newest published post is used. Search keeps `q`, `topic`, and
`series`, debounce, load-more, no-results, and URL behavior unchanged. Filter
results may use `AnimatePresence` and layout animation, but the input remains
responsive and the content is never hidden before hydration.

### Article

Desktop shows the sticky article progress map beside the prose. Mobile shows a
compact progress meter followed by the existing table of contents before the
prose. The body and code blocks do not receive transforms or entrance effects.
Headings, series navigation, related posts, share/copy feedback, and the
back-to-top control remain semantic and keyboard reachable.

## Accessibility contract

Keep semantic landmarks, a skip link, visible `:focus-visible` rings, 44px
interactive targets, native `<dialog>` behavior with Escape and focus return,
theme anti-flash bootstrap, clipboard/share fallbacks, MDX/code overflow,
Suspense/feed fallbacks, and no horizontal page overflow. Theme defaults to
`prefers-color-scheme`; an explicit light or dark choice is persisted.

## Do / don't

Do use the semantic tokens from `src/styles/design-tokens.css`, keep Indonesian
editorial content intact, and make lines answer a wayfinding question. Don't
invent claims, testimonials, credentials, content, or URLs; don't turn the
reading surface into a portfolio proof sequence.

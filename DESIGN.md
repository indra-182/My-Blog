---
name: INDRA.DEV Blog
description: Cue Horizon reading stage for durable Indonesian technical writing.
colors:
  background-dark: "#08090d"
  foreground-dark: "#f4f1e9"
  surface-dark: "#11131a"
  surface-strong-dark: "#191d27"
  muted-dark: "#a9adba"
  border-dark: "#343a4a"
  accent-dark: "#f29ab0"
  accent-foreground-dark: "#130a0e"
  focus-dark: "#91b9f3"
  primary-dark: "#f4f1e9"
  primary-foreground-dark: "#08090d"
  cobalt: "#173b72"
  cue-day: "#f4f1e9"
  background-light: "#f4f1e9"
  foreground-light: "#08090d"
  surface-light: "#e9e5de"
  surface-strong-light: "#ddd9d2"
  muted-light: "#5d6069"
  border-light: "#c5c3c0"
  accent-light: "#8f304e"
  accent-foreground-light: "#fff8f7"
  focus-light: "#173b72"
  popover-light: "#fffdf8"
  popover-dark: "#191d27"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.75rem, 6.8vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2.25rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.65rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.16em"
rounded:
  sm: "0.15rem"
  md: "0.3rem"
  pill: "999px"
spacing:
  control-height: "2.75rem"
  shell-mobile-gutter: "1rem"
  shell-wide-gutter: "1.5rem"
  content-max: "76rem"
  prose-max: "72ch"
components:
  button-primary:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.primary-foreground-dark}"
    rounded: "{rounded.sm}"
    padding: "0 1.1rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-dark}"
    rounded: "0"
    padding: "0 0.75rem"
    height: "2.75rem"
  badge-outline:
    backgroundColor: "transparent"
    textColor: "{colors.muted-dark}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.625rem"
  site-navigation:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.foreground-dark}"
    height: "4.75rem"
---

# Design System: INDRA.DEV Blog

## Overview

**Creative North Star: "Cue Horizon"**

Cue Horizon stages technical writing as a clear reading path. The reader enters a near-black field, finds a cobalt horizon and rose transition, then moves through search, filters, headings, code, and continuation links. The blog is a Read surface, so typography, wayfinding, and content density carry the experience.

The blog shares the sibling portfolio's visual language without copying its recruiter-only content or proof sequence. It uses a sticky stage header, direct shell alignment, thin structural rules, flat rectangular surfaces, and a single hero cue-rise. The first visit is dark; an explicit light choice persists as the white-day counterpart.

**Key Characteristics:**

- Dark-first stage with cobalt horizon and restrained rose lower wash.
- System sans hierarchy with uppercase monospace cue labels and tabular metadata.
- Direct shell alignment, 76rem content maximum, and 72ch prose measure.
- Flat surfaces, one-pixel rules, pill badges only, and no decorative sequence rails.
- Native modal navigation, visible focus, 44px targets, and reduced-motion support.

## Colors

The semantic palette keeps neutral values responsible for reading load, cobalt for directional fields, rose for cues and active states, and focus blue for keyboard visibility. `.light` remaps the same roles to the white-day scene.

### Primary

- **Stage value** (`--primary`): White-day action face in dark mode and cobalt action face in light mode.
- **Cobalt horizon** (`--cue-cobalt`, #173b72): Hero field and directional signal in both scenes.

### Secondary

- **Rose transition** (`--cue-rose`): Cue labels, active borders, links, and feedback states.
- **Focus blue** (`--focus-ring`): Focus-visible rings and keyboard orientation.

### Neutral

- **Night field** (`--background`, #08090d): Dark canvas and default scene.
- **White-day field** (`--background` in `.light`, #f4f1e9): Light counterpart.
- **Stage surface** (`--surface`): Footer and quiet bounded controls.
- **Strong stage surface** (`--surface-strong`): Popover and muted overlay roles.
- **Muted cue text** (`--muted-foreground`): Supporting copy, metadata, and quiet controls.
- **Structural line** (`--border`): Section rules, field outlines, and navigation boundaries.

### Named Rules

**The Controlled Luminance Rule.** Rose marks a cue or state, cobalt establishes a horizon, and neutral values carry reading load.

**The Two-Scene Rule.** Dark and light are the same Cue Horizon world. Light mode is a white-day stage, not a separate brand palette.

## Typography

**Display Font:** System sans stack from `--font-heading` and the body sans stack.
**Body Font:** `ui-sans-serif`, `system-ui`, `-apple-system`, BlinkMacSystemFont, and Segoe UI fallbacks.
**Label/Mono Font:** `ui-monospace`, SFMono-Regular, Menlo, Monaco, Consolas, monospace.

**Character:** Sans headlines are immediate, dense, and dependable. Monospace labels behave like production cue readouts and never compete with the reading headline.

### Hierarchy

- **Display** (`800`, `clamp(2.75rem, 6.8vw, 5.25rem)`, `0.92`): Homepage hero and article headline scale.
- **Headline** (`800`, `clamp(2.25rem, 5vw, 4.75rem)`, `0.95`): Article and route-state headings.
- **Title** (`750`, `clamp(1.4rem, 2.5vw, 2.25rem)`, `1.05`): Post cards and supporting sections.
- **Body** (`400`, `1rem`, `1.65`): Descriptions, metadata context, and route copy. Prose stays at `72ch` maximum.
- **Label** (`700`, `0.65rem`, `0.16em` tracking, uppercase): Cue labels, filters, dates, and control language.

### Named Rules

**The Headline-Then-Cue Rule.** The sans headline states the writing focus first. Monospace or rose text orients, labels, or timestamps it afterward.

## Layout

The full-width stage uses a centered shell with `1rem` gutters below 640px, `1.5rem` gutters from 640px, and a `76rem` maximum. The header is sticky at `4.75rem`. Desktop navigation appears from 768px; below that breakpoint the menu trigger opens a right-side native modal dialog using `--popover`.

The homepage hero owns the near-black to cobalt field and restrained rose lower wash. Its copy has one `480ms` cue-rise and deliberate lower padding before discovery begins. Discovery starts as a separate shell-aligned section with search, topic, and series controls, then direct post rows. Article pages align breadcrumbs, header, prose, table of contents, and footer content directly to the shell. The table of contents is sticky beside prose on desktop and moves before prose below 768px.

## Elevation & Depth

The blog is flat at rest. Depth comes from hero gradients, tonal scene changes, structural rules, and the popover boundary. Blog surfaces do not use shadows. The code block keeps its Dracula-highlighted surface because code readability is the material requirement, not elevation.

### Named Rules

**The Flat Stage Rule.** Do not turn reading rows or controls into floating cards. Borders and tonal fields provide enough separation.

## Shapes

The form language is rectangular and precise. Controls use the `0.15rem` small radius, navigation controls are transparent and zero-radius, and topic badges alone use the `999px` pill radius. One-pixel borders define rows, fields, series links, and article footer boundaries. Interactive targets use a `2.75rem` minimum height, while mobile drawer links use `3.5rem` rows.

## Components

### Buttons

- **Character:** Quiet, tactile stage controls with readable focus.
- **Primary:** High-contrast semantic action with `2.75rem` minimum height and `0.15rem` radius.
- **Ghost:** Transparent navigation and theme controls with rose bottom-border hover and focus states.
- **Hover / Focus:** Color and border transitions use `--motion-fast`; no layout shift or filled glow.

### Badges

- **Style:** Topic badges use transparent backgrounds, a one-pixel border, monospace labels, `0.25rem 0.625rem` padding, and the pill radius.
- **State:** Badges identify topics. They are not interactive filters.

### Inputs / Fields

- **Style:** Search and select fields use `--surface`, a structural border, small radius, and at least `2.75rem` height.
- **Focus:** Focus-visible uses the ring token and rose border without changing layout.
- **State:** Empty, no-results, and loading states retain shell alignment and name recovery actions in Indonesian.

### Navigation

- **Desktop:** Sticky wordmark, external Portfolio link, active Blog link, and theme control. Blog keeps `aria-current="page"`.
- **Mobile:** Native `<dialog>` opens with `showModal()`, closes with `close()`, delegates Escape to the browser, closes on link selection, and returns focus to the trigger on `close`.
- **Footer:** Visible icon-plus-text links repeat Portfolio, Github, LinkedIn, and Email paths.

### Reading Surface

- **Homepage:** Headline, rose cue, description, breathing room, filters, result count, flat post rows, and load-more action.
- **Article:** Topic badges, headline, description, publication metadata, optional series notice, prose, sticky or pre-prose TOC, Dracula code blocks, series navigation, related posts, and sharing controls.
- **Motion:** Only hero copy enters. Reduced motion sets motion tokens to `0ms`, disables cue-rise, and uses automatic scrolling.

## Do's and Don'ts

### Do:

- **Do** keep the near-black or white-day scene, cobalt horizon, rose cues, thin lines, and direct shell alignment.
- **Do** use semantic tokens from `src/styles/design-tokens.css`.
- **Do** preserve Indonesian copy, repository contracts, code overflow, native clipboard and share fallbacks, and optional-section absence.
- **Do** maintain visible focus, keyboard order, native dialog behavior, 44px targets, and reduced-motion behavior.

### Don't:

- **Don't** add a generic developer-blog hero eyebrow above the heading, visible sequence numbers, or decorative index rails.
- **Don't** add new production dependencies, external font requests, glass panels, blurred headers, floating card shadows, or rounded card grids.
- **Don't** use rose or cobalt as a substitute for readable body text or as the only state signal.
- **Don't** fabricate claims, content, testimonials, credentials, or portfolio proof.

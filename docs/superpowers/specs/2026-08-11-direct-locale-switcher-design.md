# Language Control Decision Record

## Status

Superseded by the approved Indonesian-only root design in
`docs/superpowers/specs/2026-08-12-single-language-root-design.md`.

## Final decision

The blog has no language control. It publishes one Indonesian UI dictionary and
one Indonesian content tree, so a control that navigates between languages has
no remaining product behavior to expose.

The shared shell therefore renders the wordmark, Portfolio and Blog links,
theme control, mobile navigation, and external links without a switcher or
translation notice. Article pages do not render translation actions.

## Resulting contracts

- The canonical homepage is `/`.
- Articles use `/blog/<slug>`.
- RSS uses `/rss.xml`.
- The latest-post API accepts `limit` without a language parameter or language
  fields in its response.
- Legacy language-prefixed requests return 404 rather than redirecting.

## Verification

Unit and browser coverage assert that the shell has no language control, root
navigation works, article translation UI is absent, and legacy language routes
return 404. The final quality gate also includes content validation, lint,
typecheck, build, unit tests, and E2E tests.

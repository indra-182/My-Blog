# Use Tailwind for local styles and native CSS for shared contracts

INDRA.DEV uses Tailwind CSS v4 for styling local to one React surface. Native CSS owns semantic tokens and base rules, generated MDX and code content, complex pseudo-element, keyframe, and state selectors, plus exact declaration bundles reused by at least two rendered surfaces; `@apply` is excluded so this seam stays visible and local utility composition remains easy to trace.

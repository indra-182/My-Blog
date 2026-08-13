# Domain Docs

How the engineering skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repository root, or `CONTEXT-MAP.md` if it exists. The map points to the relevant context documents.
- Relevant ADRs under `docs/adr/`.

If these files do not exist, proceed silently. The domain-modeling skill creates them lazily when terminology or architectural decisions are resolved.

## File structure

This is a single-context repository:

```text
/
??? CONTEXT.md
??? docs/
?   ??? adr/
?   ?   ??? 0001-example-decision.md
?   ?   ??? 0002-example-decision.md
?   ??? agents/
??? src/
```

## Use the glossary vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term defined in `CONTEXT.md`. If the needed concept is not in the glossary, treat that as a possible domain-modeling gap rather than inventing a synonym.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding it:

> Contradicts ADR-0007, but worth reopening because ...

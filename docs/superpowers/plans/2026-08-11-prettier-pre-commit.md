# Prettier Pre-Commit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Prettier and Husky so the entire repository is formatted before every commit while preserving unrelated unstaged changes.

**Architecture:** `npm run format` is the single formatting entry point and runs local Prettier with `--write .`. Husky invokes that script from a versioned `.husky/pre-commit` hook, records staged paths before formatting, and re-stages only those paths after formatting.

**Tech Stack:** npm, Prettier 3, Husky 9, POSIX shell, existing Next.js/TypeScript repository.

## Global Constraints

- Format the entire repository on every commit, excluding dependencies, generated output, caches, reports, and environment files.
- Preserve unrelated working-tree changes; the hook must not use `git add -A`, `git add -u`, or another command that stages all changes.
- Keep code, identifiers, comments, and commit messages in English.
- Do not add lint-staged or modify application behavior.
- Keep the existing user's changes to `package.json`, `package-lock.json`, source files, messages, and `.env.example` intact.

---

### Task 1: Add formatter and hook dependencies

**Files:**

- Modify: `package.json` via npm's dependency installer
- Modify: `package-lock.json` via npm's dependency installer

**Interfaces:**

- Produces local executables at `node_modules/.bin/prettier` and `node_modules/.bin/husky`.
- Produces npm scripts `format`, `format:check`, and `prepare` consumed by later tasks and verification.

- [ ] **Step 1: Confirm the baseline dependency state**

Run:

```bash
test ! -x node_modules/.bin/prettier
test ! -x node_modules/.bin/husky
```

Expected: both commands succeed because the tools are not yet installed.

- [ ] **Step 2: Install the local development dependencies**

Run:

```bash
npm install --save-dev prettier@^3.6.2 husky@^9.1.7
```

Expected: npm adds both packages to `devDependencies` and updates only the dependency sections relevant to the current lockfile.

- [ ] **Step 3: Add the npm entry points**

Update the existing `scripts` object to contain:

```json
"format": "prettier --write .",
"format:check": "prettier --check .",
"prepare": "husky"
```

Keep all existing scripts unchanged.

- [ ] **Step 4: Verify package metadata**

Run:

```bash
npm ls --depth=0 prettier husky
node -e "const p=require('./package.json'); if (!p.devDependencies.prettier || !p.devDependencies.husky || p.scripts.format !== 'prettier --write .' || p.scripts['format:check'] !== 'prettier --check .' || p.scripts.prepare !== 'husky') process.exit(1)"
```

Expected: both commands exit successfully and report the local packages.

### Task 2: Configure repository-wide Prettier scope

**Files:**

- Create: `.prettierrc.json`
- Create: `.prettierignore`

**Interfaces:**

- `prettier --write .` and `prettier --check .` use the same explicit style and ignore rules.

- [ ] **Step 1: Add the explicit formatting configuration**

Create `.prettierrc.json` with:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "tabWidth": 2,
  "useTabs": false
}
```

- [ ] **Step 2: Add generated-file and local-metadata exclusions**

Create `.prettierignore` with:

```text
.git
.agents
.codex
.codegraph
node_modules
.next
out
build
coverage
playwright-report
test-results
.vercel
.env*
```

- [ ] **Step 3: Run the formatter once across the repository**

Run:

```bash
npm run format
```

Expected: Prettier formats supported repository files, skips the ignored paths, and exits successfully. Review the diff before accepting any changes outside formatting.

- [ ] **Step 4: Confirm the formatted state**

Run:

```bash
npm run format:check
```

Expected: Prettier reports that all checked files are formatted.

### Task 3: Add the safe repository-wide pre-commit hook

**Files:**

- Create: `.husky/pre-commit`

**Interfaces:**

- Git invokes the executable hook before commit creation.
- The hook consumes `npm run format` and re-stages only paths present in the initial index.

- [ ] **Step 1: Create the hook with fail-closed behavior**

Create `.husky/pre-commit` with:

```sh
#!/usr/bin/env sh
set -e

staged_paths="$(mktemp)"
trap 'rm -f "$staged_paths"' EXIT

git diff --cached --name-only --diff-filter=ACMR -z > "$staged_paths"
npm run format

if [ -s "$staged_paths" ]; then
  git add --pathspec-from-file="$staged_paths" --pathspec-file-nul
fi
```

This makes formatter failure block the commit and prevents unrelated unstaged files from being added.

- [ ] **Step 2: Mark the hook executable**

Run:

```bash
chmod +x .husky/pre-commit
```

- [ ] **Step 3: Initialize Husky through the package lifecycle**

Run:

```bash
npm run prepare
```

Expected: Husky initializes its local hook support without replacing the versioned `pre-commit` file.

### Task 4: Verify formatting and hook staging behavior

**Files:**

- Inspect only: `package.json`, `package-lock.json`, `.prettierrc.json`, `.prettierignore`, `.husky/pre-commit`

- [ ] **Step 1: Run repository quality checks**

Run:

```bash
npm run lint
npm run typecheck
npm test
```

Expected: each command exits successfully. If an existing user change causes a failure, report it separately rather than reverting it.

- [ ] **Step 2: Verify the hook's executable and syntax state**

Run:

```bash
test -x .husky/pre-commit
sh -n .husky/pre-commit
```

Expected: both commands succeed.

- [ ] **Step 3: Verify staged-path preservation**

Use a temporary test file that is created, staged, and removed after the check. The controlled check must assert that running `.husky/pre-commit` does not stage any pre-existing unrelated modifications, while the initially staged file remains staged after formatting.

Run the hook only through a temporary isolated Git index/worktree test or a disposable branch state; do not use `git reset`, discard existing edits, or commit the user's current changes.

- [ ] **Step 4: Recheck the final working tree scope**

Run:

```bash
git status --short
git diff --check
```

Expected: only the intended Prettier/Husky files plus formatting changes are present; the pre-existing user modifications remain present and are not silently discarded.

# Prettier Pre-Commit Design

## Objective

Install Prettier for the blog repository and guarantee that the entire repository's supported source and configuration files are formatted before every commit.

## Scope

- Add Prettier as a development dependency.
- Add a repository-wide `format` npm script using `prettier --write .`.
- Add Husky as the shared Git hook mechanism.
- Run the format script from `.husky/pre-commit` before a commit is finalized.
- Stage formatting changes for paths that were already staged when the hook started, without staging unrelated working-tree changes.
- Ignore dependencies, build output, test output, caches, and environment files from Prettier traversal.
- Preserve all existing application code and the user's unrelated working-tree changes.

## Design

`package.json` will expose `npm run format` as the explicit local formatting command and a `prepare` script that initializes Husky after dependency installation. Husky's versioned `.husky/pre-commit` hook will record the staged paths, invoke `npm run format`, then re-stage only those recorded paths so repository-wide formatting is applied without pulling unrelated working-tree changes into the pending commit.

Prettier will use a small explicit configuration matching the repository's existing JavaScript and TypeScript style: two-space indentation, semicolons, double quotes, and trailing commas where supported. `.prettierignore` will exclude generated or non-source directories while leaving application source, MDX content, Markdown documentation, JSON, and configuration files in scope.

## Behavior and Failure Handling

- `npm run format` formats all supported files under the repository root and exits non-zero if Prettier itself fails.
- A commit runs the same command through `.husky/pre-commit`.
- If formatting fails, the hook exits non-zero and the commit is blocked.
- If formatting changes a file that was already staged, that file is re-staged before the hook exits; unrelated unstaged files remain unstaged.
- The hook remains portable through `npx --no-install`/local package resolution and does not download packages during a commit.

## Verification

- Confirm Prettier and Husky are installed in `package.json` and the lockfile.
- Run `npm run format` and inspect the resulting diff.
- Run Prettier in check mode to confirm the repository is formatted.
- Execute the pre-commit hook directly in a controlled test invocation and verify its exit behavior and staged-path preservation.
- Run the repository's targeted quality checks: lint, typecheck, and tests as practical after formatting.

## Out of Scope

- Formatting only staged files; this repository intentionally formats the entire repository on every commit.
- Adding lint-staged or other staged-file orchestration.
- Reformatting generated dependencies or build artifacts.
- Changing lint rules, TypeScript settings, or application behavior.

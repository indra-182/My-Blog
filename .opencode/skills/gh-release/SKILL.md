---
name: gh-release
description: Use for GitHub release work that creates a best-practice branch, commits verified changes, pushes them, opens a pull request, and merges it after required checks pass.
---

# GitHub Push Flow

Use this workflow only when the user explicitly asks to publish local changes
through GitHub. Leave the working tree untouched when the user has not asked
for a commit or push.

## Branch

Inspect the current branch, status, recent log, remotes, and default branch
before changing anything. Branch from the up-to-date default branch when
possible. Use a short lowercase kebab-case name with the dominant change type:

- `feat/<name>` for user-facing functionality
- `fix/<name>` for bug or correctness fixes
- `refactor/<name>` for internal restructuring without behavior changes
- `chore/<name>` for tooling, dependency, or maintenance work
- `test/<name>` for test-only changes
- `docs/<name>` for documentation-only changes

For mixed work, choose the prefix matching the highest-risk behavior change.
Do not reuse a branch name that already exists without checking its history.

## Verify

Run the repository's documented quality gate before publishing. For this repo,
that is:

```text
pnpm verify
```

Also run `git diff --check` and inspect the complete diff. Do not publish if a
required check fails unless the user explicitly accepts the failure.

## Commit

Stage only intended files by default. Preserve unrelated user changes and
never use broad staging commands such as `git add -A` without explicit user
permission. If the user explicitly requests all changes, stage tracked and
untracked files after checking that no secrets are present.

Use a concise Conventional Commit subject, for example:

```text
fix: stabilize content and blog interactions
```

Inspect `git status`, `git diff --cached`, and recent history before committing.

## Push And Pull Request

Push the branch with its upstream:

```bash
git push -u origin <branch>
```

Use `gh pr create --base master` with a summary, test list, and any known
limitations. Inspect the created PR URL, title, body, diff, and checks.

## Merge

Merge only after the requested checks are green and no unresolved review or
merge conflict remains. Prefer the repository's normal merge strategy; when
none is documented, use squash merge and delete the remote branch:

```bash
gh pr merge <number> --squash --delete-branch
```

After merging, verify the local branch and remote `master` state. Report the
branch, commit, PR URL, merge result, and every verification result.

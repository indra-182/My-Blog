# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- Create an issue: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- Read an issue: `gh issue view <number> --comments`, filtering comments with `jq` and fetching labels too.
- List issues: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- Comment on an issue: `gh issue comment <number> --body "..."`.
- Apply or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close an issue: `gh issue close <number> --comment "..."`.

Infer the repository from `git remote -v`; `gh` does this automatically inside this clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** Set this to `yes` only if the repository later decides to treat external pull requests as feature requests. The triage skill reads this flag.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

The map is a single issue with child issues as tickets.

- Map: an issue labeled `wayfinder:map`, containing the Notes, Decisions-so-far, and Fog body. Create it with `gh issue create --label wayfinder:map`.
- Child ticket: a GitHub sub-issue linked to the map. If sub-issues are unavailable, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Use `wayfinder:<type>` labels for `research`, `prototype`, `grilling`, or `task`. Assign the ticket to the driving developer once claimed.
- Blocking: use GitHub native issue dependencies. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric database id, not its issue number or node id. If dependencies are unavailable, use a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- Frontier query: list open children scoped to the map, drop any with an open blocker or assignee, and take the first remaining ticket in map order.
- Claim: `gh issue edit <n> --add-assignee @me` is the session's first write.
- Resolve: comment with the answer, close the issue, then append a context pointer with the gist and link to the map's Decisions-so-far.

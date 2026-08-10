# Hermes Daily Blog Post Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Schedule the existing `blog-harian` Hermes job to create and validate one blog post daily at 20:00 WIB.

**Architecture:** Hermes' built-in cron scheduler remains the single source of scheduling. The supported Hermes CLI updates only the job's schedule, which recomputes `next_run_at`; its existing prompt, workdir, model, skills, and delivery settings remain untouched.

**Tech Stack:** Hermes CLI, built-in cron scheduler, croniter, `Asia/Jakarta` timezone.

## Global Constraints

- Target job ID: `77eeac7c43b3` (`blog-harian`).
- Hermes timezone must remain exactly `Asia/Jakarta`.
- Target schedule must be exactly `0 20 * * *`.
- Do not manually run the job.
- Do not alter the prompt, workdir, model, skills, delivery mode, credentials, Git state, or deployment.
- Use the supported `hermes cron edit` command; never hand-edit `~/.hermes/cron/jobs.json`.

---

### Task 1: Update and verify the existing Hermes schedule

**Files:**
- Modify: `/home/mahad/.hermes/cron/jobs.json` (only through the Hermes CLI)
- Verify: `/home/mahad/.hermes/config.yaml`

**Interfaces:**
- Consumes: `hermes cron edit <job_id> --schedule <cron-expression>`.
- Produces: an enabled `blog-harian` job with `schedule.expr` and `schedule_display` equal to `0 20 * * *`, plus a recalculated `next_run_at` at `20:00:00+07:00`.

- [x] **Step 1: Check the scheduler target before mutation**

Run:

```bash
hermes cron list
rg -n '^timezone: Asia/Jakarta$' /home/mahad/.hermes/config.yaml
```

Expected: `blog-harian` resolves to ID `77eeac7c43b3`, is enabled, and Hermes reports `Asia/Jakarta`.

- [x] **Step 2: Apply the schedule update using the supported CLI**

Run:

```bash
hermes cron edit 77eeac7c43b3 --schedule '0 20 * * *'
```

Expected: CLI reports an updated `blog-harian` job with schedule `0 20 * * *` and a future next-run timestamp.

- [x] **Step 3: Verify persisted schedule and next run**

Run:

```bash
jq -e '.jobs[] | select(.id == "77eeac7c43b3") | select(.enabled == true and .state == "scheduled" and .schedule.expr == "0 20 * * *" and .schedule_display == "0 20 * * *") | {name, enabled, state, schedule, next_run_at}' /home/mahad/.hermes/cron/jobs.json
```

Expected: the command returns one object with a `next_run_at` timestamp ending in `20:00:00+07:00`.

- [x] **Step 4: Record outcome**

Report the job name, schedule, timezone, enabled state, and next run. Do not call `hermes cron run` or modify any other scheduler fields.

**Commit:** Not applicable: the Hermes state directory is outside this workspace and the workspace has no Git repository metadata.

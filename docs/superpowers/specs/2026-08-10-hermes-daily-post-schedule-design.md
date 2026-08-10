# Hermes Daily Blog Post Schedule

**Date:** 2026-08-10  
**Status:** Approved design  
**Hermes home:** `/home/mahad/.hermes`

## Objective

Run the existing `blog-harian` Hermes automation once each day at 20:00
Asia/Jakarta (WIB). The job creates one Indonesian MDX post in the local blog
repository and runs the repository's content validation command.

## Selected Approach

Update the schedule of the existing built-in Hermes cron job instead of adding
a WSL/system cron entry or a second Hermes job. Hermes already uses
`Asia/Jakarta`, so the schedule is expressed as `0 20 * * *`.

## Boundaries

- Preserve the job's current prompt, working directory, model settings,
  validation command, and local delivery mode.
- Do not run the job manually as part of configuration.
- Do not commit, push, deploy, or otherwise publish repository changes beyond
  the content file the scheduled job itself is designed to create.
- Do not expose or modify credentials.

## Configuration and Verification

1. Use Hermes' supported scheduler interface to update `blog-harian` to
   `0 20 * * *`.
2. Confirm the job remains enabled and its next run falls at 20:00 with the
   `+07:00` offset.
3. Report the schedule, timezone, enabled state, and next run. Existing
   Hermes execution records remain the source for later failure diagnosis.

## Error Handling

If the scheduler update fails, leave the existing schedule unchanged and
report the error. If a future scheduled run fails, Hermes retains the job's
last status and error information; no automatic retry or duplicate scheduler
will be introduced by this change.

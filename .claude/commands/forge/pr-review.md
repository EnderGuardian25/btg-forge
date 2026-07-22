---
description: G5 merge gate — on a GitHub PR into main, post a summary + reviewer/qa-gate verdict; escalate if blocked.
argument-hint: <PR#>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:pr-review — G5 merge gate on a GitHub PR (Member D)

The final gate before code lands on `main`. Delegates to the `pr-reviewer` subagent, which summarizes the
PR, runs the two-stage `reviewer` + `qa-gate`, and posts a **G5** verdict. **The human owns the merge** —
this command never runs `gh pr merge` and never resolves a semantic conflict on its own.

## Reads
- The PR via `gh`:
  `gh pr view <PR#> --json title,body,author,baseRefName,headRefName,mergeable,mergeStateStatus,files,additions,deletions`,
  `gh pr checks <PR#>`, `gh pr diff <PR#>`.
- `changes/<feature>/spec.md`, `verify-report.md`, `gates.md` for the feature the PR implements.

## Writes
- A PR comment: the summary + the `G5` verdict (`gh pr comment <PR#> --body-file -`).
- A `### G5 Merge — PASS|CONCERNS|FAIL` block appended to `changes/<feature>/gates.md`.

## Steps
1. Dispatch the `pr-reviewer` subagent with the PR number and the change artifacts.
2. It runs `reviewer` (Stage 1 spec compliance → Stage 2 code quality) and `qa-gate`, then evaluates the
   **G5** checklist via `gate`: CI all-green, reviewer + qa-gate = PASS, no unresolved semantic conflict,
   no spec drift (`verify-report.md` fully MET).
3. **If all-green:** post the summary + `G5 — PASS` and clear the PR for a human to merge.
4. **If blocked** (FAIL/CONCERNS, red/pending checks, semantic conflict, or spec drift): the agent MUST
   follow the **`github-escalation`** skill — post a structured escalation with options (and a *proposed*
   conflict resolution, not applied), append the block to `gates.md`, then STOP for a human decision.

## Gate
- **G5 Merge** via `gate`. FAIL/CONCERNS route through `github-escalation`. A human override needs a
  `Justification:` line under the block in `gates.md`.

## Subagents/skills
- `pr-reviewer` (drives the review + summary), which invokes `reviewer`, `qa-gate`, and the
  `github-escalation` skill when blocked. **Never auto-merges or auto-resolves a semantic conflict.**

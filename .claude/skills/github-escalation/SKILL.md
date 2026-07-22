---
name: github-escalation
description: Escalate a GitHub PR safely to a human when it cannot be auto-approved — a qa-gate FAIL or CONCERNS verdict, failing/red CI checks, or a merge conflict that is not trivially resolvable. Use during /forge:pr-review (G5) whenever the merge gate is blocked. Gathers full context via `gh`, writes a structured escalation summary, proposes options, and hands off for human approval. NEVER auto-merges or auto-resolves a semantic conflict.
---

# GitHub Escalation

The **G5 merge gate** (`/forge:pr-review`, `pr-reviewer` agent) is allowed to summarize and to *propose*,
but it must never merge a PR into `main` or commit a conflict resolution on its own. This skill is the
discipline for the moment the gate is blocked: turn an ambiguous, blocked PR into a crisp decision a human
can make in under a minute.

## When this triggers

Escalate — do not proceed to merge — when any of these hold on a PR targeting `main`:

1. **Gate verdict is `FAIL`** — the two-stage review or `qa-gate` failed.
2. **Gate verdict is `CONCERNS`** — advisory issues that a human should accept before merge.
3. **CI checks are failing or pending** — `gh pr checks <PR#>` is not all-green.
4. **Merge conflicts exist** — and any conflicting hunk is *semantic* (not a trivial import/format/adjacent-add).
5. **Spec drift** — `/forge:verify` shows an acceptance line from `spec.md` is unmet.

If NONE of these hold (all-green checks, `PASS` verdict, no conflicts or only trivial ones), this skill
does not apply — the gate may post `PASS` and clear the PR for a human to click merge.

## Process

### 1. Gather context (read-only)
Use the `gh` CLI. Do not mutate anything in this step.
```
gh pr view <PR#> --json title,body,author,baseRefName,headRefName,mergeable,mergeStateStatus,files,additions,deletions
gh pr checks <PR#>
gh pr diff <PR#>
```
For conflicts, identify the conflicting files and classify each conflicting hunk as **trivial**
(imports, formatting, whitespace, two independent additions in different regions) or **semantic**
(same logic edited on both sides, signature/contract changes, data-model or migration changes).

### 2. Classify the blocker
Pick the single most severe reason from the trigger list. Severity order:
`FAIL` > failing checks > semantic conflict > spec drift > `CONCERNS` > trivial conflict.

### 3. Write the escalation summary
Post it as a PR comment (`gh pr comment <PR#> --body-file -`) AND append it to the change's
`changes/<feature>/gates.md` under a `### G5 — CONCERNS|FAIL` block. Use this exact shape:

```
## ⚠️ BTG Forge G5 escalation — human decision needed

**PR:** #<n> "<title>" · <head> → <base>
**Blocker:** <one of: FAIL verdict | failing checks | semantic conflict | spec drift | CONCERNS>
**Severity:** <FAIL | CONCERNS>

### What's wrong
- <bullet: the specific finding, quoting the exact spec line / failing check / file:hunk>

### Options
1. **<recommended>** — <what to do, what it costs> (Recommended)
2. <alternative>
3. Reject / send back — <why you might>

### Proposed conflict resolution (if applicable)
For <file>:<hunk> — <the proposed merged code, with a one-line rationale>.
NOT applied. Approve to have me write it.

### Nothing has been merged or committed.
```

### 4. Hand off — and STOP
- Ask the human which option to take. **Wait for an explicit choice.**
- Only after approval: if they approved a proposed conflict resolution, write ONLY that hunk, re-run the
  gate, and report. If they approved merge, they click merge (or explicitly tell you to run `gh pr merge`).
- If the human overrides a `FAIL` to proceed anyway, record a `Justification:` line in `gates.md`
  (the complexity-tracking escape hatch) before doing anything else.

## Hard rules (never violate)

- **Never** run `gh pr merge`, `git merge`, `git push`, or commit a resolution without an explicit human
  "yes" to a specific option.
- **Never** resolve a *semantic* conflict autonomously — propose only.
- Trivial conflicts (imports/format/adjacent adds) *may* be resolved in the proposal, but are still shown
  and still applied only after approval.
- **Never** hide a blocker to make the gate pass. A silenced problem is worse than a blocked merge.
- Every escalation leaves a durable trace in `gates.md` so the decision is auditable later.

## Example

> PR #42 adds a `/health` endpoint. `gh pr checks` is green, `qa-gate` = PASS, but `git` reports a
> conflict in `src/router.ts` where both branches registered a route in the same block. That hunk is
> **semantic** → escalate. Post the summary with a proposed merged `router.ts` block (both routes kept,
> ordered), Option 1 = "apply this merge", Option 2 = "I'll resolve it", Option 3 = "reject". Wait.

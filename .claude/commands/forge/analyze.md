---
description: Cross-artifact consistency check (spec ⇄ plan ⇄ tasks) — advisory CRITICAL/WARNING/SUGGESTION.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:analyze — cross-artifact consistency (Member D)

Catches drift *between* artifacts before implementation locks it in: a requirement with no task, a task with
no requirement, a plan that contradicts the spec. **Advisory only — it never blocks the pipeline**; it
surfaces findings a human weighs (its CRITICALs are the natural agenda for `/forge:clarify` or a plan revision).

## Reads
- `changes/<feature>/spec.md`, `plan.md`, `tasks.md`.

## Writes
- `changes/<feature>/analysis.md` — a findings list, each tagged **CRITICAL** / **WARNING** / **SUGGESTION**.

## Checks
- **Coverage** — every ADDED/MODIFIED requirement in `spec.md` maps to ≥1 task in `tasks.md`
  (uncovered requirement → **CRITICAL**).
- **Traceability** — every task traces back to a requirement (orphan task → **WARNING**).
- **Plan alignment** — `plan.md` `## Approach`/`## Tech choices` don't contradict the spec or the
  constitution's simplicity budget (contradiction → **WARNING**).
- **Clarity** — no `[NEEDS CLARIFICATION]` remains in `spec.md` (leftover → **CRITICAL**).
- **Granularity** — tasks name concrete file(s) + a verification step; waves respect dependencies
  (missing verify step / mis-ordered `[P]` → **SUGGESTION**).

## Steps
1. Build a requirement↔task matrix and flag both directions (uncovered requirements, orphan tasks).
2. Diff plan claims against the spec + constitution.
3. Write `analysis.md` grouped by severity, each finding citing the artifact + line.
4. Print a one-line rollup (`N CRITICAL / N WARNING / N SUGGESTION`). Do **not** call a gate.

## Gate
None — advisory.

## Subagents/skills
None required.

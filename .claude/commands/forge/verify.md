---
description: Quote each acceptance line from spec.md and check it against the implementation → verify-report.md.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:verify — check the implementation against the spec (Member D)

Proves the change actually does what the accepted spec requires. Reads every acceptance scenario from the
delta `spec.md`, quotes it **verbatim**, and marks it met or unmet with concrete evidence (a passing test,
a `file:line`). Feeds the **G4 Quality** gate — any UNMET line is a FAIL condition.

## Reads
- `changes/<feature>/spec.md` — the ADDED/MODIFIED requirements and their Given/When/Then scenarios.
- `changes/<feature>/tasks.md` — to map each requirement to the task/test that covers it.
- The implementation + tests in the repo (via Grep/Glob/Bash).
- `.forge/templates/verify-report.md` — the report shape to write.

## Writes
- `changes/<feature>/verify-report.md` — one checkbox line per acceptance scenario, each quoting the
  **exact** spec line, marked **MET** (evidence: test name / `file:line`) or **UNMET** (what's missing).

## Steps
1. Extract every acceptance scenario from `spec.md` (each **Then** under ADDED/MODIFIED). Preserve exact text.
2. Run the test suite (`npm test` / `pytest` — match the repo) and capture the result. A scenario is MET
   only if a green test demonstrates it — not because the code merely "looks right".
3. For each scenario, record **MET** + evidence, or **UNMET** + the specific gap. Never mark MET without evidence.
4. Write `verify-report.md` from the template; end with a `## Summary` line: `met N / M`.
5. Call **G4 Quality** via the `gate` subagent (artifacts: `verify-report.md` + the test result), then run
   the `qa-gate` subagent to fold in review findings. Append both verdict blocks to
   `changes/<feature>/gates.md`.

## Gate
- **G4 Quality** — FAIL if any acceptance line is UNMET or the suite is red. A FAIL blocks the pipeline
  unless a human records a `Justification:` line under the block in `gates.md`.

## Subagents/skills
- `gate` (emits the G4 verdict), `qa-gate` (final quality verdict from `reviewer` findings + this report).

## Review model tier
Select the `qa-gate` subagent's model from the feature's `## Complexity Triage` in `plan.md`, using the
**same mapping `/forge:implement` uses** — LOW → `haiku`, MED → `sonnet`, HIGH → `opus` (default MED if
absent). Pass it as the subagent's `model` override so review depth scales with the change's complexity.

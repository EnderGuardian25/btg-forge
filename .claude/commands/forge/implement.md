---
description: Execute tasks TDD-style — G3 gate → RED test → GREEN impl → refactor → one commit per task.
argument-hint: <feature-name or task-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:implement

## Contract
- **Reads:** `changes/<feature>/tasks.md`, the relevant `plan.md`/`stories/`, the codebase.
- **Writes:** source + test files per task; appends one commit per task; checks tasks off in `tasks.md`.
- **Gate:** per task, calls **G3 Test-first** (a RED test must exist and fail for the right reason)
  BEFORE any implementation is written.
- **Subagents/skills:** `tdd-engineer` (RED) → `gate` (G3) → `impl-engineer` (GREEN → refactor); the whole
  loop follows the `tdd-loop` skill (delete any impl written before its test). One commit per task.

## Process
Given `$ARGUMENTS` (a feature name, optionally with a specific task number):

0. **Precondition:** `changes/<feature>/tasks.md` must exist. If it doesn't, stop and tell the user to run
   `/forge:tasks <feature>` first — do not invent tasks here.
1. Read `changes/<feature>/tasks.md`. Select the task: the one named by id if given, else the next
   unfinished task in wave order (within a wave, `[P]` tasks may be taken in any order, but are still
   implemented and committed one at a time). A task is "finished" when its line already ends with
   `— done (commit …)`.
2. For the selected task:
   a. Dispatch `tdd-engineer` with the task's text and verify/acceptance line → get back a RED test plus
      **RED evidence**: the exact test command it ran and the failure excerpt.
   b. Call **G3 Test-first** via the `gate` subagent. Note the gate is **read-only — it cannot run tests**,
      so you must hand it the evidence to judge:
      - `artifacts` = the new/changed test file path(s), so the gate can read the assertion.
      - `checklist` (inline in the prompt) = the default G3 checklist **plus the RED evidence text**
        (command + failure excerpt) from step (a), so the gate can confirm the failure is for the right
        reason (missing behavior — not a syntax error / bad import / missing fixture) and that no
        implementation for this task predates the test.
      Append the returned verdict block verbatim to `changes/<feature>/gates.md`.
   c. **G3 = FAIL:** stop here. Report why. Do not proceed to GREEN unless a human adds a
      `Justification:` line under the block in `gates.md`.
   d. **G3 = PASS/CONCERNS:** dispatch `impl-engineer` with the RED test + task → GREEN implementation,
      then refactor. (CONCERNS proceeds but carry the noted risk into the report.)
   e. Re-run the task-scoped tests (and the full suite if fast) once more to confirm GREEN after refactor.
   f. Commit: stage exactly the files this task named (source + test). The **G4 pre-commit hook runs the
      full suite and hard-blocks a red commit** — do not bypass it with `--no-verify`. Conventional commit
      message, e.g. `feat: <task summary>`, with a body noting the test added and any refactor — plus a
      note if the `tdd-loop` delete-rule fired. RED/GREEN/refactor land together as **one commit per
      task**, never split across commits.
3. Mark the task done in `tasks.md` — append `— done (commit <short-sha>)` to its line — as part of the
   same commit.
4. Report back: task id, RED evidence excerpt, GREEN confirmation, G3 verdict, commit hash.
5. If the caller asked to run the whole feature and tasks remain, continue to the next task; otherwise
   stop after the one task.

## Rules
- Never dispatch `impl-engineer` before G3 has evaluated the RED test.
- Never bundle two tasks into one commit, and never split one task's RED/GREEN/refactor across commits.
- Follow the `tdd-loop` skill's delete-pre-test-code rule whenever either agent flags leftover impl.

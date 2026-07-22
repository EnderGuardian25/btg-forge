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

1. Read `changes/<feature>/tasks.md`. Select the task: the one named by id if given, else the next
   unchecked task in wave order (within a wave, `[P]` tasks may be taken in any order, but are still
   implemented and committed one at a time).
2. For the selected task:
   a. Dispatch `tdd-engineer` with the task's text and verify/acceptance line → get back a RED test +
      confirmation.
   b. Call **G3 Test-first** via the `gate` subagent: `artifacts` = the new test + its failure output;
      checklist = the default G3 checklist (RED exists, fails for the right reason, no pre-test impl
      snuck in). Append the verdict block to `changes/<feature>/gates.md`.
   c. **G3 = FAIL:** stop here. Report why. Do not proceed to GREEN unless a human adds a
      `Justification:` line under the block in `gates.md`.
   d. **G3 = PASS/CONCERNS:** dispatch `impl-engineer` with the RED test + task → GREEN implementation,
      then refactor.
   e. Re-run the task-scoped tests (and the full suite if fast) once more to confirm GREEN after refactor.
   f. Commit: stage exactly the files this task named (source + test). Conventional commit message, e.g.
      `feat: <task summary>` with a body noting the test added and any refactor — RED/GREEN/refactor land
      together as **one commit per task**, not split across commits.
3. Mark the task done in `tasks.md` — append `— done (commit <short-sha>)` to its line — as part of the
   same commit.
4. Report back: task id, RED confirmation excerpt, GREEN confirmation, gate verdict, commit hash.
5. If the caller asked to run the whole feature and tasks remain, continue to the next task; otherwise
   stop after the one task.

## Rules
- Never dispatch `impl-engineer` before G3 has evaluated the RED test.
- Never bundle two tasks into one commit, and never split one task's RED/GREEN/refactor across commits.
- Follow the `tdd-loop` skill's delete-pre-test-code rule whenever either agent flags leftover impl.

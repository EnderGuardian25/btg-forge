---
description: Execute tasks TDD-style — G3 gate → RED test → GREEN impl → refactor → one commit per task.
argument-hint: <feature-name or task-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:implement

## Contract
- **Reads:** `changes/<feature>/tasks.md` (incl. per-task `tier:` and the `## Execution` mode), the
  relevant `plan.md`/`stories/`, the codebase.
- **Writes:** source + test files per task; appends one commit per task; checks tasks off in `tasks.md`.
- **Gate:** per task, calls **G3 Test-first** (a RED test must exist and fail for the right reason)
  BEFORE any implementation is written.
- **Subagents/skills:** `gate` (G3) always. RED→GREEN is run either **in-session** or via `tdd-engineer`
  (RED) → `impl-engineer` (GREEN → refactor) subagents, per the chosen execution mode. The whole loop
  follows the `tdd-loop` skill (delete any impl written before its test). One commit per task.

## Execution modes
Read the `## Execution` section of `tasks.md` for the mode chosen at `/forge:tasks` time. If it is missing
(older task list), ask the user now (in-session vs subagent-driven) with a recommendation from the plan
triage, and write the answer back into `tasks.md` before proceeding.

- **In-session** — the main session performs the task's RED→GREEN→refactor directly (no per-task subagent
  dispatch). G3 is still called on the RED test. Lower overhead; best for LOW/MED features.
- **Subagent-driven** — dispatch `tdd-engineer` then `impl-engineer` as subagents, **selecting the model
  from the task's `tier`**. `[P]` tasks within a wave may be dispatched in parallel (still one commit
  each, in the order they complete).

**Model tier → model (canonical; the review commands reuse this exact mapping):**

| tier | model | when |
|------|-------|------|
| LOW  | `haiku`  | mechanical / boilerplate / config / trivial getters |
| MED  | `sonnet` | ordinary feature work (default) |
| HIGH | `opus`   | tricky logic, subtle tests, concurrency, security-sensitive |

Pass the resolved model as the subagent's `model` override. If a task has no `tier:` tag, treat it as MED.
In-session mode ignores the table (the session model runs everything) but still records tiers for audit.

## Process
Given `$ARGUMENTS` (a feature name, optionally with a specific task number):

0. **Precondition:** `changes/<feature>/tasks.md` must exist. If it doesn't, stop and tell the user to run
   `/forge:tasks <feature>` first — do not invent tasks here.
1. Read `changes/<feature>/tasks.md`. Select the task: the one named by id if given, else the next
   unfinished task in wave order (within a wave, `[P]` tasks may be taken in any order, but are still
   implemented and committed one at a time). A task is "finished" when its line already ends with
   `— done (commit …)`.
2. For the selected task (resolve the task's `tier` → model per the table above; **subagent-driven** uses
   it, **in-session** does the same steps directly in the main session):
   a. Produce the RED test + **RED evidence** (the exact test command run and the failure excerpt):
      - **subagent-driven:** dispatch `tdd-engineer` with `model` = the resolved tier model, passing the
        task's text and verify/acceptance line.
      - **in-session:** write the one failing test yourself and run it to capture the evidence.
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
   d. **G3 = PASS/CONCERNS:** make it GREEN, then refactor. (CONCERNS proceeds but carry the noted risk.)
      - **subagent-driven:** dispatch `impl-engineer` with `model` = the resolved tier model, given the
        RED test + task.
      - **in-session:** write the minimal implementation yourself, then refactor.
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
   stop after the one task. In **subagent-driven** mode, `[P]` tasks in the current wave may be dispatched
   concurrently, but each still gets its own G3 → GREEN → single commit, and a wave completes before the
   next begins. **In-session** mode runs tasks strictly one at a time.

## Rules
- Never write (or dispatch) implementation before G3 has evaluated the RED test — in either mode.
- Never bundle two tasks into one commit, and never split one task's RED/GREEN/refactor across commits.
- Follow the `tdd-loop` skill's delete-pre-test-code rule whenever leftover impl is flagged.
- The mode changes *who executes*, never the discipline: RED→G3→GREEN→refactor→one commit holds for both.

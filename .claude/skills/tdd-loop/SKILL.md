---
name: tdd-loop
description: Red-green-refactor discipline for /forge:implement — write a failing test first, make it pass with minimal code, then refactor. Delete any implementation written before its test.
---

# TDD Loop (Red → Green → Refactor)

This is the shared discipline `tdd-engineer`, `impl-engineer`, and `/forge:implement` all follow for every
task. It exists so **G3 (Test-first)** can never be gamed: no implementation code enters the repo without
a failing test that demanded it first.

## The loop, per task

### 1. RED — tdd-engineer
- Before anything else: check whether implementation for this task already exists with no covering test.
  If so — **do not write a test around it** — see "Pre-test code" below.
- Write exactly ONE failing test for the task's acceptance/verify line. One behavior, one test.
- Run it. It must fail. Read the failure output and confirm it fails for the *intended* reason:
  - **Good RED:** assertion mismatch, missing export/route/function the behavior needs.
  - **Bad RED:** syntax error, wrong import path, typo in the test itself, missing fixture.
- If it's a bad RED, fix the TEST (never the impl) and rerun until it fails for the right reason.
- Hand off: the test file + a one-line confirmation (command run + failure excerpt).

### 2. GREEN — impl-engineer
- Read the RED test. Implement the *minimum* code that satisfies it — no extra params, no speculative
  generalization, no untested branches.
- Run the test. It must pass. If other tests broke, fix forward — never weaken the new test to paper over
  a regression.

### 3. REFACTOR — impl-engineer
- With the suite green, clean up naming, duplication, structure.
- Re-run tests after every refactor step. Any red = revert that step immediately.
- Refactor never changes observable behavior. Wanting new behavior means a new task — stop and go back to
  RED for it.

### 4. COMMIT — /forge:implement
- One commit per task, made only after GREEN (post-refactor). Conventional commit style
  (`test:`/`feat:`/`refactor:` — see `.forge/technical-preferences.md`).

## Pre-test code (the delete rule)
If either agent finds implementation code for the current task with no failing test behind it (written
out of order — by a human, a prior broken run, or a shortcut):
1. **Delete it.**
2. Restart the task at RED with a proper failing test.
3. Note the deletion in the handoff so `/forge:implement` can mention it in the commit body.

This is non-negotiable — it's the one enforcement mechanism that makes "test-first" real instead of
aspirational.

## Anti-patterns (reject these)
- Writing the test and the impl in the same pass "to save time."
- A test that passes on its very first run — it was never RED, so it never proved it tests anything.
- Loosening an assertion instead of fixing the implementation.
- Bundling multiple tasks or behaviors into one commit.
- A refactor step that adds a new code path with no test driving it.

## Interface with G3
`/forge:implement` calls the **G3 Test-first** gate before invoking `impl-engineer`: the gate checks that
a RED test exists for the task and fails for the right reason. A G3 FAIL blocks GREEN work — restart at
RED, or the caller records a `Justification:` line in `gates.md` if a human explicitly overrides.

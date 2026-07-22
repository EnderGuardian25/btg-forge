---
description: Break the plan/stories into a numbered, wave-grouped task list with [P] parallel markers.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:tasks

## Contract
- **Reads:** `changes/<feature>/plan.md` (and `stories/*.md` if the plan's tier is HIGH),
  `changes/<feature>/spec.md`, `.forge/templates/tasks.md`.
- **Writes:** `changes/<feature>/tasks.md` — numbered tasks grouped under `### Wave N`; `[P]` marks
  parallelizable tasks; each task names the file(s) it touches + its verification step.
- **Gate:** none directly — `tasks.md` feeds **G3** later, once per task, during `/forge:implement`.
- **Subagents/skills:** none required.

## Process
0. **Precondition:** `changes/<feature>/plan.md` must exist and carry a passing/CONCERNS G1 (and, if HIGH,
   G2) verdict in `changes/<feature>/gates.md`. If `plan.md` is missing, stop and tell the user to run
   `/forge:plan <feature>` first — don't derive tasks straight from the spec.
1. Read `changes/<feature>/plan.md`. If `## Complexity Triage` says **HIGH**, also read every
   `changes/<feature>/stories/NN-*.md`.
2. Derive the unit of work:
   - **LOW/MED:** derive tasks from `## Approach` in `plan.md` plus the Given/When/Then scenarios in
     `spec.md` — one task per scenario or per cohesive file change, whichever is smaller.
   - **HIGH:** one task cluster per story's `## Acceptance` criteria, each task naming the story it
     traces back to.
3. Group into waves:
   - **Wave 1** — tasks with no dependency on another task in this feature. Mark `[P]` when more than one
     can proceed independently within the wave.
   - **Wave N+1** — tasks that depend on a completed Wave N task (an earlier interface, a shared module,
     migration ordering, etc.). Name the depended-on task so the wave boundary is auditable.
   - Number tasks continuously across waves (Wave 1: 1,2; Wave 2: 3,4…), matching
     `.forge/templates/tasks.md`.
   - Prefer more waves of few tasks over few waves of many — `/forge:implement` commits one task at a
     time, so smaller tasks stay reviewable.
4. Each task line must name the file(s) it touches and a concrete verification step (a test command, or
   "new failing test for X" as the RED step) — never a vague step like "test it."
5. Write `changes/<feature>/tasks.md` following the shape in `.forge/templates/tasks.md`.

## Rules
- Every task must be small enough for `tdd-engineer` to cover it with ONE test. If a task implies more
  than one independent behavior, split it into multiple tasks.
- `[P]` only when truly independent — no shared file, no ordering dependency within the same wave.
- Don't invent tasks beyond what `plan.md`/`stories/` justify — no scope creep past the accepted spec delta.

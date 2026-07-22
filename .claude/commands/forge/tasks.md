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
  parallelizable tasks; each task names the file(s) it touches + its verification step + a `tier:` tag;
  plus a trailing `## Execution` section recording the chosen run mode.
- **Gate:** none directly — `tasks.md` feeds **G3** later, once per task, during `/forge:implement`.
- **Subagents/skills:** none required. Asks the user one question (run mode) at the end.

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
5. **Tag each task with a complexity tier** — append ` — tier: LOW|MED|HIGH` to the task line. Start from
   the feature's `## Complexity Triage` in `plan.md` as the baseline, then bump an individual task up or
   down when it clearly differs (a fiddly algorithm or a subtle concurrency test in an otherwise MED
   feature → HIGH; a one-line config or a trivial getter → LOW). The tier drives per-task model selection
   in subagent-driven mode (see `/forge:implement`), so keep it honest.
6. Write `changes/<feature>/tasks.md` following the shape in `.forge/templates/tasks.md`.
7. **Ask the run mode.** Once the list is written, ask the user how to execute it, using `AskUserQuestion`
   with these two options and a **recommendation** derived from the plan triage:
   - **In-session** — the main session runs each task's RED→GREEN loop directly. Faster, one context;
     best for small features. *Recommend when triage is LOW/MED and there are few tasks/waves.*
   - **Subagent-driven** — each task is dispatched to dedicated `tdd-engineer`/`impl-engineer` subagents,
     with the model auto-selected per that task's `tier`, and `[P]` tasks parallelizable. Isolates context
     and scales; best for large or complex features. *Recommend when triage is HIGH, or there are many
     tasks/waves.* Lead with the recommended option and mark it `(Recommended)`.
   Record the answer verbatim in an `## Execution` section at the end of `tasks.md`:
   `Mode: in-session | subagent-driven` plus a one-line note of why it was recommended. `/forge:implement`
   reads this; if the user skips the question, default to the recommended mode and say so.

## Rules
- Every task must be small enough for `tdd-engineer` to cover it with ONE test. If a task implies more
  than one independent behavior, split it into multiple tasks.
- `[P]` only when truly independent — no shared file, no ordering dependency within the same wave.
- Don't invent tasks beyond what `plan.md`/`stories/` justify — no scope creep past the accepted spec delta.

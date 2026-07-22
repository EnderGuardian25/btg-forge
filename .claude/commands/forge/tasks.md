---
description: Break the plan/stories into a numbered, wave-grouped task list with [P] parallel markers.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:tasks — STUB (Owner: Member C)

> Skeleton stub created by Member A for parallel build. Member C fills the body.

## Contract
- **Reads:** `changes/<feature>/plan.md` (and `stories/` if HIGH), `.forge/templates/tasks.md`.
- **Writes:** `changes/<feature>/tasks.md` — numbered tasks grouped under `### Wave N`; `[P]` marks
  parallelizable tasks; each task names the file(s) it touches + its verification step.
- **Gate:** none directly (feeds G3 at implement time).
- **Subagents/skills:** none required.

TODO(C): implement.

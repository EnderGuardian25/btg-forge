---
description: Execute tasks TDD-style — G3 gate → RED test → GREEN impl → refactor → one commit per task.
argument-hint: <feature-name or task-id>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:implement — STUB (Owner: Member C)

> Skeleton stub created by Member A for parallel build. Member C fills the body.

## Contract
- **Reads:** `changes/<feature>/tasks.md`, the story/plan, the codebase.
- **Writes:** source + test files per task; appends per-task commits.
- **Gate:** per task, call **G3 Test-first** (a RED test must exist) BEFORE writing impl.
- **Subagents/skills:** `tdd-engineer` (RED) → `impl-engineer` (GREEN → refactor); follows the
  `tdd-loop` skill (delete any impl written before its test). One commit per task.

TODO(C): implement.

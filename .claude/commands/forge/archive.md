---
description: Merge spec deltas into specs/, append learnings/patterns, and move the change to archive/.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:archive — STUB (Owner: Member D)

> Skeleton stub created by Member A for parallel build. Member D fills the body.

## Contract
- **Reads:** `changes/<feature>/spec.md` (delta), `.forge/specs/**`.
- **Writes:** applies ADDED/MODIFIED/REMOVED into `.forge/specs/<domain>/spec.md` (new current truth);
  appends to `.forge/learnings.md` and `.forge/patterns.md`; moves the change to `changes/archive/`.
- **Gate:** none.
- **Subagents/skills:** none required.

TODO(D): implement (stretch).

---
description: Resolve [NEEDS CLARIFICATION] markers in a delta spec interactively, then re-run G0.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:clarify — STUB (Owner: Member B)

> Skeleton stub created by Member A for parallel build. Member B fills the body.

## Contract
- **Reads:** `changes/<feature>/spec.md`.
- **Writes:** the same `spec.md`, replacing each `[NEEDS CLARIFICATION: …]` with a resolved decision.
- **Gate:** re-run **G0** after resolving.
- **Subagents/skills:** `gate`.

TODO(B): implement.

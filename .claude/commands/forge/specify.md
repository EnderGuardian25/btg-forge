---
description: Turn a feature request into a delta spec (ADDED/MODIFIED/REMOVED, Given-When-Then) and run G0.
argument-hint: <feature-name or short description>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:specify — STUB (Owner: Member B)

> Skeleton stub created by Member A for parallel build. Member B fills the body.

## Contract
- **Reads:** `.forge/specs/**` (current truth), `.forge/templates/spec.md`, `.forge/constitution.md`.
- **Writes:** `changes/<NNN-feature>/proposal.md` + delta `spec.md` with `## ADDED Requirements` /
  `## MODIFIED Requirements` / `## REMOVED Requirements`; each requirement lists Given/When/Then scenarios;
  mark gaps with `[NEEDS CLARIFICATION: …]`.
- **Gate:** ends by calling **G0 Spec-clarity** via the `gate` subagent; append the verdict to
  `changes/<NNN-feature>/gates.md`.
- **Subagents/skills:** `gate`.

TODO(B): implement.

---
description: Quote each acceptance line from spec.md and check it against the implementation → verify-report.md.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:verify — STUB (Owner: Member D)

> Skeleton stub created by Member A for parallel build. Member D fills the body.

## Contract
- **Reads:** `changes/<feature>/spec.md` (acceptance scenarios), the implementation + tests.
- **Writes:** `changes/<feature>/verify-report.md` — quotes each **exact** `spec.md` acceptance line and
  marks it met / unmet with evidence.
- **Gate:** feeds **G4 Quality** (an unmet acceptance line is a FAIL condition).
- **Subagents/skills:** `gate`, `qa-gate`.

TODO(D): implement.

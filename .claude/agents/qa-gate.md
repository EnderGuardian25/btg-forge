---
name: qa-gate
description: Emit the final quality verdict (PASS/CONCERNS/FAIL) from the reviewer's findings + verify-report.
tools: Read, Grep, Glob
model: sonnet
---

# qa-gate — STUB (Owner: Member D)

> Skeleton stub created by Member A. Member D fills role/inputs/outputs/rules.

- **Inputs:** `reviewer` findings, `changes/<feature>/verify-report.md`.
- **Outputs:** a `### G4|G5 — PASS|CONCERNS|FAIL` verdict block (same shape as the `gate` contract).
- **Rules:** FAIL on any unmet acceptance line or Stage-1 spec violation; CONCERNS for advisory quality issues.

TODO(D): implement.

---
name: po
description: BMAD tier — run the PO master checklist (G2) and shard the PRD/architecture into story files.
tools: Read, Write, Grep, Glob
model: sonnet
---

# po — STUB (Owner: Member B)

> Skeleton stub created by Member A. Member B fills role/inputs/outputs/rules.

- **Inputs:** `changes/<feature>/prd.md`, `architecture.md`, `spec.md`.
- **Outputs:** sharded `changes/<feature>/stories/NN-*.md` (Context / Acceptance / Implementation notes /
  Prior Dev/QA notes); a G2 verdict via `gate`.
- **Rules:** block until PRD ⇄ architecture ⇄ spec align.

TODO(B): implement (stretch).

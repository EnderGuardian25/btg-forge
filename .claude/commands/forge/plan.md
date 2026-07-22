---
description: Triage complexity, write a Lite plan (LOW/MED) or escalate to BMAD (HIGH), then run G1 and G2.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:plan — STUB (Owner: Member B)

> Skeleton stub created by Member A for parallel build. Member B fills the body.

## Contract
- **Reads:** `changes/<feature>/spec.md`, `.forge/constitution.md`, `.forge/technical-preferences.md`,
  `.forge/templates/plan.md`.
- **Writes:** `changes/<feature>/plan.md` with `## Complexity Triage` (score + LOW/MED/HIGH) ·
  `## Approach` · `## Tech choices` · `## Risks`. On **HIGH**, dispatch `analyst → pm → architect → po`
  to produce `prd.md` + `architecture.md` + sharded `stories/NN-*.md`.
- **Gate:** call **G1 Constitution/Simplicity**, then **G2 PO/Plan-review**; append both verdicts.
- **Subagents/skills:** `gate`; on HIGH also `analyst`, `pm`, `architect`, `po`.

TODO(B): implement triage + Lite path (must-have) and BMAD escalation (stretch).

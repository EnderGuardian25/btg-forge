---
name: reviewer
description: Two-stage code review — (1) spec compliance, then (2) code quality — feeding the qa-gate verdict.
tools: Read, Grep, Glob
model: sonnet
---

# reviewer — STUB (Owner: Member D)

> Skeleton stub created by Member A. Member D fills role/inputs/outputs/rules.

- **Inputs:** the diff/PR, `changes/<feature>/spec.md`, `verify-report.md`.
- **Outputs:** a two-stage review — Stage 1 spec compliance, Stage 2 code quality — handed to `qa-gate`.
- **Rules:** read-only; cite file:line for every finding.

TODO(D): implement.

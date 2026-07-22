---
description: G5 merge gate — on a GitHub PR into main, post a summary + reviewer/qa-gate verdict; escalate if blocked.
argument-hint: <PR#>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:pr-review — STUB (Owner: Member D)

> Skeleton stub created by Member A for parallel build. Member D fills the body.

## Contract
- **Reads:** the PR via `gh` (title/body/files/checks/diff/mergeable), `changes/<feature>/`.
- **Writes:** a PR comment (summary + verdict) and the `### G5 — …` block appended to
  `changes/<feature>/gates.md`.
- **Gate:** **G5 Merge** via `gate`; runs `reviewer` (two-stage) + `qa-gate`.
- **Subagents/skills:** `pr-reviewer` (which invokes the **`github-escalation`** skill whenever the
  merge gate is blocked). **Never auto-merges or auto-resolves a semantic conflict.**

TODO(D): implement. Wiring to `github-escalation` is already declared in `agents/pr-reviewer.md`.

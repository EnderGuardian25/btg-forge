# BTG Forge

An in-house, **gate-driven, spec-driven developer** packaged for **Claude Code** — a set of `.claude/`
slash-commands, subagents, skills, and hooks, backed by a per-repo `.forge/` state folder. Lightweight by
default; escalates to BMAD-level planning only when complexity warrants; enforces TDD red-green-refactor in
the middle; ends with a human-approved PR-review merge gate on GitHub.

## Pipeline

```
/forge:init
   │
/forge:specify ─▶ [G0 Spec-clarity] ─▶ /forge:clarify
   │
/forge:plan ─▶ [G1 Constitution/Simplicity]
   │   └─ complexity triage: LOW/MED → Lite plan.md
   │                          HIGH   → BMAD (analyst→pm→architect→po) → prd/architecture + sharded stories
   ▼
[G2 PO / Plan-review] ─▶ /forge:tasks (waves, [P] parallel)
   ▼
[G3 Test-first] ─▶ /forge:implement ── per task: tdd-engineer (RED) → impl-engineer (GREEN → refactor) → commit
   ▼
[G4 Quality] (pre-commit hook: tests green, hard block) ─▶ /forge:analyze + /forge:verify
   ▼
/forge:archive (merge spec deltas into specs/, write learnings/patterns)
   ▼
[G5 Merge] ─▶ /forge:pr-review (GitHub PR → main: summary + review + conflict proposals, human-approved)
```

Every gate returns **`PASS`** · **`CONCERNS`** (advisory) · **`FAIL`** (blocks unless a `Justification:`
is recorded in `changes/<feature>/gates.md`).

## Install

1. Copy the `.claude/` directory into your repo (commands, agents, skills, hooks, `settings.json`).
2. Run `/forge:init` — scaffolds `.forge/` (constitution, templates, state folders) and wires the
   G4 pre-commit test gate.
3. Restart the session so the `SessionStart` hook injects the constitution + BTG Forge bootstrap.

## Layout

- `.claude/commands/forge/*` — the pipeline commands (`/forge:*`).
- `.claude/agents/*` — subagents: planning (`analyst/pm/architect/po`), execution (`tdd-engineer/
  impl-engineer`), quality (`reviewer/qa-gate`), the generic `gate`, and `pr-reviewer` (G5).
- `.claude/skills/*` — `tdd-loop`, `verification-before-completion`, `systematic-debugging`,
  `github-escalation` (the G5 blocked-merge discipline).
- `.claude/hooks/*` — `session-start.sh` (bootstrap), `pre-commit.sh` (G4 hard gate).
- `.forge/` — per-repo state: `constitution.md`, `technical-preferences.md`, `templates/`, living
  `specs/`, in-flight `changes/`, and `learnings.md` / `patterns.md`.

## Building it

This repo is being built by a 4-person team in parallel. See **`TEAM-BUILD-PLAN.md`** for the frozen
contract, work orders, and timeline, and **`CLAUDE.md`** for the working agreement (including the rule that
every member checks off their tasks in the build plan as they finish).

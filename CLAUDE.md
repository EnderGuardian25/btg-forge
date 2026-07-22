# CLAUDE.md — BTG Forge working agreement (read every session)

You are working on **BTG Forge**, a gate-driven spec-driven developer for Claude Code. The full design,
frozen contract, and per-member work orders live in **`TEAM-BUILD-PLAN.md`** — read it before editing.

## Team model (4 people, disjoint ownership)
- Members A/B/C/D each own a **disjoint set of files** and work on their own branch
  (`feat/A-spine`, `feat/B-planning`, `feat/C-tdd`, `feat/D-quality-pr`).
- **Do not edit files another member owns.** The only shared file is `.claude/settings.json` — **Member A
  owns it**; hand A your hook/registration snippet instead of editing it.
- The frozen contract in `TEAM-BUILD-PLAN.md` (directory layout, frontmatter, artifact headings, gate
  contract) is **locked** — do not change it without telling everyone.

## MANDATORY: keep the build plan current (every device, every member)
When you **complete** a task listed under your member section in `TEAM-BUILD-PLAN.md`:
1. Check its box: change `- [ ]` to `- [x]` in **your own member section only** (avoids merge conflicts).
2. Make that edit **in the same commit** as the work it describes.
3. If a task is partially done, leave it unchecked and add a trailing ` — WIP: <note>`.

This rule applies to **all members on all devices**. Treat an unchecked box as "not done"; the plan is the
single source of truth for build progress at the 0:60 integration checkpoint.

## Pipeline (shared mental model)
`init → specify [G0] → clarify → plan [G1/G2] → tasks → implement [G3] → verify [G4] → archive → pr-review [G5]`
Every gate returns **PASS · CONCERNS · FAIL**. A FAIL blocks the pipeline unless a human writes a
`Justification:` line in `changes/<feature>/gates.md` (the complexity-tracking escape hatch).

## Non-negotiables
- **Test-first** (RED before GREEN); one task → one commit.
- **Human owns the merge** — never `gh pr merge` / resolve a semantic conflict without explicit approval
  (see the `github-escalation` skill).
- Gates are honest — never hide a blocker to force a pass.

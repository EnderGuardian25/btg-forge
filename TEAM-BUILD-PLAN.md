# BTG Forge — Team Build Plan (4 people, ~90 min, divide → merge)

**What we're building:** an in-house, gate-driven **Spec-Driven Developer** packaged for **Claude Code**
(`.claude/` commands + subagents + skills + hooks) with a per-repo `.forge/` state folder. Lightweight
by default; escalates to **BMAD-level planning only when complexity warrants**; enforces **TDD
red-green-refactor in the middle**; and ends with a **PR-review merge gate** on GitHub.

**Working model:** each person owns a **disjoint set of files** (no two people edit the same file), works
on their **own git branch**, and we **merge at the 60-minute checkpoint**. The frozen contract below is
what lets us build in parallel without blocking each other — **do not change it after 0:12 without telling
everyone.**

---

## The gate-driven pipeline (shared mental model)

```
/forge:init
   │
/forge:specify ─▶ [G0 Spec-clarity] ─▶ /forge:clarify
   │
/forge:plan ─▶ [G1 Constitution/Simplicity]
   │   └─ complexity triage: LOW/MED → Lite plan.md
   │                          HIGH   → BMAD tier (analyst→pm→architect→po) → prd/architecture + sharded stories
   ▼
[G2 PO / Plan-review] ─▶ /forge:tasks (waves, [P] parallel)
   ▼
[G3 Test-first] ─▶ /forge:implement  ── per task: tdd-engineer (RED) → impl-engineer (GREEN → refactor) → commit
   ▼
[G4 Quality] (pre-commit hook: tests green, hard block) ─▶ /forge:analyze + /forge:verify
   ▼
/forge:archive (merge spec deltas into specs/, write learnings/patterns)
   ▼
[G5 Merge] ─▶ /forge:pr-review  (GitHub PR → main: summary + review + conflict proposals, human-approved)
```

**Gate verdict format (every gate returns this):** `PASS` · `CONCERNS` (advisory, proceed with noted
risk) · `FAIL` (blocks — may only proceed if a justification is written to `changes/<feature>/gates.md`).

---

## FROZEN CONTRACT — agree by 0:12, then don't touch

### 1. Directory layout
```
.claude/
  commands/forge/  init.md specify.md clarify.md plan.md tasks.md implement.md analyze.md verify.md archive.md pr-review.md
  agents/            analyst.md pm.md architect.md po.md tdd-engineer.md impl-engineer.md reviewer.md qa-gate.md gate.md pr-reviewer.md
  skills/            tdd-loop/SKILL.md  verification-before-completion/SKILL.md  systematic-debugging/SKILL.md  github-escalation/SKILL.md
  hooks/             session-start.sh  pre-commit.sh
  settings.json
.forge/
  constitution.md  technical-preferences.md  learnings.md  patterns.md
  specs/<domain>/spec.md                 # CURRENT TRUTH (living)
  changes/<NNN-feature>/                  # one change per unit of work
     proposal.md  spec.md  plan.md  tasks.md  stories/  verify-report.md  gates.md
     prd.md architecture.md              # BMAD tier only
  changes/archive/
```

### 2. Command file frontmatter (`.claude/commands/forge/*.md`)
```yaml
---
description: <one line>
argument-hint: <feature-name or PR#>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---
# body: the prompt. Must state: which artifacts it READS, which it WRITES, which gate it calls, which subagents/skills it invokes.
```

### 3. Subagent frontmatter (`.claude/agents/*.md`)
```yaml
---
name: <kebab-name>
description: <when to use this agent — one line>
tools: Read, Grep, Glob        # planning/gate agents are read-mostly; tdd/impl get Write, Edit, Bash
model: sonnet                  # inherit unless a reason to override
---
# body: role, inputs (which files), outputs (which files/verdict), and rules.
```

### 4. Artifact section headings (fixed — every stage reads the previous stage by these)
- **spec.md (delta):** `## ADDED Requirements` / `## MODIFIED Requirements` / `## REMOVED Requirements`; each requirement lists scenarios in **Given / When / Then**. `[NEEDS CLARIFICATION: …]` marks gaps.
- **plan.md:** `## Complexity Triage` (score + LOW/MED/HIGH) · `## Approach` · `## Tech choices` · `## Risks`.
- **tasks.md:** numbered list; `[P]` = parallelizable; grouped under `### Wave N`; each task names the file(s) it touches + its verification step.
- **story file (stories/NN-*.md):** `## Context` · `## Acceptance` · `## Implementation notes` · `## Prior Dev/QA notes`.
- **gate verdict block (appended to gates.md):** `### <GATE> — <PASS|CONCERNS|FAIL>` + bullet reasons (+ justification if a FAIL is overridden).

### 5. Gate contract (Member A owns `gate.md`; everyone calls it)
Input: a gate id + the artifact path(s) + the checklist. Output: the verdict block above. Callers append
the block to `changes/<feature>/gates.md`. A `FAIL` stops the pipeline unless the caller records a
`Justification:` line.

---

## Git workflow

- Branches: `feat/A-spine`, `feat/B-planning`, `feat/C-tdd`, `feat/D-quality-pr`.
- Commit small, push often. Because ownership is disjoint, conflicts should be near-zero (only
  `settings.json` is shared — **Member A owns it; others hand A their hook/registration snippet**).
- **Merge at 0:60:** everyone opens a PR into `main`; **Member A integrates**. We **dogfood `pr-reviewer`**
  to summarize and gate each PR.
- **Track progress in this file (all devices):** when you finish a task, flip its `- [ ]` to `- [x]` in
  **your own member section** and commit that edit alongside the work. This rule is enforced by `CLAUDE.md`,
  which every member's session loads — so all four devices keep the plan current automatically.

---

## Timeline (90 minutes)

| Time | Activity | Who |
|---|---|---|
| **0:00–0:12** | **Contract freeze.** Read this doc top-to-bottom together. A creates the empty folder skeleton + `settings.json` + frontmatter stub files and pushes to `main` so everyone branches from a shared skeleton. | All (A leads) |
| **0:12–0:60** | **Parallel build** on own branch against the frozen contract. Stub any cross-stream call. | A / B / C / D |
| **0:60–0:75** | **Integrate.** Everyone PRs into `main`; A merges; dogfood `pr-reviewer` on the merges; wire commands→gates→subagents→skills. | All (A integrates) |
| **0:75–0:90** | **Live demo + polish.** Run the full pipeline on the demo feature end-to-end; fix breakages; finish README. | All (D drives) |

> The 0:00–0:12 freeze is the critical dependency — every other task is blocked until the skeleton +
> interfaces exist. Keep it strict.

---

## Scope: MUST-HAVE core vs STRETCH

**90 minutes is tight for 10 commands + 10 agents + 3 skills + 2 hooks.** Build the MUST-HAVE core first —
it is the smallest set that demos the full spec→plan→TDD→verify→PR loop end-to-end. Only start STRETCH
items once your must-haves are green. **Cut stretch without guilt** — a working thin loop beats a broken
wide one.

| Member | MUST-HAVE (build first) | STRETCH (only if core is done) |
|---|---|---|
| **A** | folder skeleton + stubs, `settings.json`, `init.md`, `constitution.md`, `gate.md`, `session-start.sh`, `pre-commit.sh` | `technical-preferences.md` (BISTEC defaults), full `README.md` |
| **B** | `specify.md` (delta spec + G0), `plan.md` (triage + Lite path + G1) | `clarify.md`, G2 PO gate, BMAD quartet (`analyst/pm/architect/po`) + `prd/architecture` + sharding |
| **C** | `tasks.md`, `implement.md`, `tdd-loop/SKILL.md`, `tdd-engineer.md`, `impl-engineer.md`, G3 wiring | wave grouping polish, `systematic-debugging` skill, mid-task QA checks |
| **D** | `verify.md` (spec-line quoting), `qa-gate.md`, `pr-review.md` + `pr-reviewer.md` (G5), `github-escalation` skill, demo target | `analyze.md`, `archive.md` (delta merge + learnings/patterns), `reviewer.md` two-stage, conflict-resolution proposal |

**MUST-HAVE demo loop that must work:** `init → specify → plan (Lite) → tasks → implement (RED→GREEN) →
verify → pr-review`. Everything else (clarify, analyze, archive, full BMAD escalation, two-stage review,
conflict proposals) is a bonus to show if time allows.

---

## Individual work orders

### Member A — Spine, Standards & Gates *(integrator)*
**Owns:** `.forge/` layout, all artifact **templates**, `constitution.md`, `technical-preferences.md`,
`hooks/session-start.sh`, `hooks/pre-commit.sh`, `settings.json`, `commands/forge/init.md`,
`agents/gate.md`, top-level `README.md`.
**Tasks**
- [x] 0:00–0:12 — create folder skeleton + stub every command/agent file with frontmatter; push to `main`. *(all 10 commands, 10 agents, 4 skills, hooks, settings, .forge/ tree + templates)*
- [x] `init.md`: scaffolds `.forge/` in a target repo, writes a starter `constitution.md`.
- [x] `constitution.md` + `technical-preferences.md`: BISTEC defaults (stack, conventions, anti-patterns).
- [x] `gate.md`: generic gate subagent — takes gate id + artifact + checklist → returns the verdict block; documents the complexity-tracking escape hatch.
- [x] `session-start.sh`: inject constitution + "you are running BTG Forge" bootstrap.
- [x] `pre-commit.sh`: **G4** — run tests; non-zero exit blocks commit.
- [x] `README.md`: install + the pipeline diagram above.
- [x] *(bonus)* artifact templates in `.forge/templates/` (spec/plan/tasks/story/gates/proposal/verify-report) so B/C/D write to a shared shape.
- [x] *(bonus)* `CLAUDE.md` working agreement + the cross-device "check off your tasks" rule.
- [x] *(wiring)* `pr-reviewer.md` now invokes the `github-escalation` skill whenever the G5 gate is blocked. *(D still owns the `pr-review.md` body.)*
**Done when:** `/forge:init` scaffolds a clean repo, the session hook fires, and `gate.md` returns a valid verdict on a sample artifact. ✅ skeleton pushed to `main` — B/C/D can branch.

### Member B — Planning tier (spec-kit + BMAD + OpenSpec deltas)
**Owns:** `commands/forge/specify.md`, `clarify.md`, `plan.md`; `agents/analyst.md`, `pm.md`,
`architect.md`, `po.md`; PRD/architecture/story templates.
**Tasks**
- [ ] `specify.md`: create `changes/<NNN-feature>/` + `proposal.md` + delta `spec.md` (ADDED/MODIFIED/REMOVED, Given-When-Then, `[NEEDS CLARIFICATION]`). Ends by calling **G0**.
- [ ] `clarify.md`: resolve `[NEEDS CLARIFICATION]` interactively; re-run G0.
- [ ] `plan.md`: `## Complexity Triage` → LOW/MED writes a Lite `plan.md`; HIGH dispatches `analyst→pm→architect→po`. Ends by calling **G1** then **G2** (PO master checklist).
- [ ] BMAD subagents: `analyst` (brief), `pm` (PRD: FRs/NFRs/epics/stories), `architect` (architecture doc), `po` (checklist gate + shard docs into `stories/`).
**Done when:** a simple feature stays Lite through G1/G2; a deliberately complex one escalates and produces `prd.md` + `architecture.md` + sharded `stories/`, and the PO gate blocks until they align.

### Member C — TDD & execution core (superpowers + specclaw)
**Owns:** `commands/forge/tasks.md`, `implement.md`; `agents/tdd-engineer.md`, `impl-engineer.md`;
`skills/tdd-loop/SKILL.md`.
**Tasks**
- [ ] `tasks.md`: read plan/stories → emit `tasks.md` with `[P]` markers grouped into `### Wave N`, each task naming files + a verification step.
- [ ] `tdd-loop/SKILL.md`: red-green-refactor discipline; **delete any impl written before its test**.
- [ ] `tdd-engineer.md`: writes ONE failing test (RED); asserts it fails for the right reason.
- [ ] `impl-engineer.md`: minimal code to GREEN, then refactor; no new behavior without a test.
- [ ] `implement.md`: per task → call **G3** (a RED test exists) → tdd-engineer → impl-engineer → one commit per task (per-task commit discipline).
**Done when:** `/forge:implement` on one task visibly goes RED → GREEN → refactor with a commit per task, and G3 blocks impl when no failing test exists.

### Member D — Quality, PR review & demo (specclaw + superpowers + gates)
**Owns:** `commands/forge/analyze.md`, `verify.md`, `archive.md`, `pr-review.md`;
`agents/reviewer.md`, `qa-gate.md`, `pr-reviewer.md`; `skills/github-escalation/SKILL.md`;
**the demo target app + running the demo**.
**Tasks**
- [ ] `analyze.md`: cross-artifact consistency (spec⇄plan⇄tasks) → CRITICAL/WARNING/SUGGESTION (advisory).
- [ ] `verify.md`: quote **exact `spec.md` acceptance lines** and check each → `verify-report.md`.
- [ ] `reviewer.md`: two-stage review (spec compliance → code quality). `qa-gate.md`: PASS/CONCERNS/FAIL.
- [ ] `archive.md`: merge spec deltas into `specs/`; append `learnings.md` / `patterns.md`; move change to `archive/`.
- [ ] **`pr-review.md` + `pr-reviewer.md` (G5):** on a GitHub PR into `main` (via `gh`): post a **summary**, run reviewer + qa-gate → post `PASS/CONCERNS/FAIL`, detect conflicts and **propose per-hunk resolutions with rationale for a human to approve** (never auto-commit a resolution).
- [x] **`github-escalation/SKILL.md`:** the discipline the G5 gate follows when blocked (FAIL/CONCERNS, red checks, semantic conflict, spec drift) — gather context via `gh`, post a structured escalation summary + options to the PR and `gates.md`, then **stop and wait for a human choice**. Never merges or resolves semantic conflicts autonomously. *(Authored + ✅ wired by A: `agents/pr-reviewer.md` invokes it. D still owns the `pr-review.md` command body.)*
- [ ] Pre-stage the **demo feature** by ~0:50 so the final demo isn't invented live.
**Done when:** `/forge:verify` produces a report quoting spec lines, `qa-gate` returns a verdict, and `/forge:pr-review <PR#>` posts a summary + verdict + a proposed conflict resolution on a real GitHub PR.

---

## Demo script (0:75–0:90)
1. `/forge:init` in a scratch repo → `.forge/` scaffolded, hook fires.
2. `/forge:specify "add a /health endpoint"` → delta spec + **G0 PASS**.
3. `/forge:plan` → stays **Lite** (show triage), **G1/G2 PASS**.
4. `/forge:tasks` → waves with `[P]`.
5. `/forge:implement` → **G3** → RED → GREEN → refactor → commit.
6. `/forge:verify` → report quotes spec lines; `qa-gate` PASS.
7. Open a PR → `/forge:pr-review` posts summary + **G5** verdict (+ a conflict-resolution proposal if we stage one).
8. *(Stretch)* re-run `/forge:plan` on a complex feature to show the **BMAD escalation**.

## Sources cheat-sheet (what each piece borrows)
- **spec-kit** → staged pipeline, constitution, templates-as-guardrails, `[P]` / `[NEEDS CLARIFICATION]`, analyze.
- **BMAD** → complexity escalation to analyst/pm/architect/po, PRD+architecture, sharded stories, PO checklist gate, qa-gate PASS/CONCERNS/FAIL.
- **superpowers** → skills + session-start bootstrap, TDD red-green-refactor (delete pre-test code), two-stage review, verification-before-completion.
- **specclaw** → proposal→PR artifact chain, spec-line-quoting verify, wave commits, learnings/patterns feedback.
- **OpenSpec** → delta specs (ADDED/MODIFIED/REMOVED + Given-When-Then), current-truth `specs/` vs proposed `changes/`, archive merges deltas back.
- **gate-driven dev** → the gate spine (G0–G5), PASS/CONCERNS/FAIL, pre-commit hard gate, complexity-tracking escape hatch.

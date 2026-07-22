---
description: Triage complexity, write a Lite plan (LOW/MED) or escalate to BMAD (HIGH), then run G1 and G2.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:plan — triage complexity, write a Lite plan, run G1/G2

## Contract
- **Reads:** `changes/<feature>/spec.md`, `.forge/constitution.md`, `.forge/technical-preferences.md`,
  `.forge/templates/plan.md`.
- **Writes:** `changes/<feature>/plan.md` with `## Complexity Triage` (score + LOW/MED/HIGH) ·
  `## Approach` · `## Tech choices` · `## Risks`. On **HIGH**, dispatch `analyst → pm → architect → po`
  to produce `prd.md` + `architecture.md` + sharded `stories/NN-*.md`.
- **Gate:** call **G1 Constitution/Simplicity**, then **G2 PO/Plan-review**; append both verdicts.
- **Subagents/skills:** `gate`; on HIGH also `analyst`, `pm`, `architect`, `po`.

## Steps

1. **Locate the feature.** `$ARGUMENTS` names the feature (slug or `NNN-slug`) — resolve to the
   `changes/<NNN-feature>/` directory (glob-match if only the slug was given). Read its `spec.md`.
   If `spec.md` doesn't exist, stop and tell the user to run `/forge:specify` first.

2. **Complexity triage.** Score 0-10 from these signals in the spec + repo:
   - +1 per ADDED/MODIFIED requirement beyond the first (many requirements = more surface).
   - +2 if any requirement implies a new external dependency or service integration.
   - +2 if any requirement touches a cross-cutting concern (auth, data model/migration, shared
     infra/config used by multiple features).
   - +2 if any requirement has non-trivial non-functional targets (perf, security, compliance).
   - +1 if any `[NEEDS CLARIFICATION]` marker remains unresolved (should be rare post-G0, but count
     it — unclear scope inflates complexity).
   Tier: **LOW** 0-3, **MED** 4-6, **HIGH** 7+. Write the score and a one-line rationale citing which
   signals fired.

3. **LOW/MED — Lite path (must-have).** Write `changes/<feature>/plan.md` from
   `.forge/templates/plan.md`:
   - `## Complexity Triage` — score/tier + rationale from step 2.
   - `## Approach` — a few bullets: what gets built, in what order, referencing the spec's
     Given/When/Then scenarios directly (one bullet can cover multiple related requirements).
   - `## Tech choices` — defer to `.forge/technical-preferences.md` defaults; only call out a
     choice here if this feature needs something the defaults don't cover.
   - `## Risks` — real risks + a one-line justification for any new dependency/abstraction per the
     constitution's Simplicity budget (§ "Simplicity budget (G1)").

4. **HIGH — BMAD escalation (stretch, not implemented in this pass).** If triage lands HIGH, write
   the Complexity Triage section honestly (don't downgrade the score to dodge escalation), then add
   a clearly marked note under `## Approach`:
   `> BMAD escalation (analyst → pm → architect → po) is not wired yet in this build — proceeding
   with a Lite plan despite HIGH triage. Flag for manual PRD/architecture review.`
   Still produce the rest of the Lite plan so the pipeline isn't blocked, and let G1 surface the
   unjustified complexity honestly rather than hiding it.

5. **G1 — Constitution/Simplicity.** Dispatch `gate` with `gate=G1 Constitution/Simplicity`,
   `artifacts=changes/<feature>/plan.md changes/<feature>/spec.md .forge/constitution.md`. Append
   the verdict to `gates.md`.

6. **G2 — PO/Plan-review.** Since the `po` subagent is stretch/unbuilt, run G2 directly via `gate`
   with `gate=G2 PO/Plan-review`, `artifacts=changes/<feature>/plan.md changes/<feature>/spec.md`,
   and this checklist: "every ADDED/MODIFIED requirement in spec.md has at least one corresponding
   bullet in plan.md's Approach; the plan doesn't introduce scope beyond the spec's Out of scope
   line in proposal.md." Append the verdict.

7. **Report.** Print the tier, both verdicts, and the next command (`/forge:tasks <feature>`) if
   neither gate FAILed; otherwise tell the user which gate blocked and that a `Justification:` line
   in `gates.md` is needed to proceed anyway.

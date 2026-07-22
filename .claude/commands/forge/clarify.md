---
description: Resolve [NEEDS CLARIFICATION] markers in a delta spec interactively, then re-run G0.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:clarify — resolve [NEEDS CLARIFICATION] markers, then re-run G0

## Contract
- **Reads:** `changes/<feature>/spec.md`.
- **Writes:** the same `spec.md`, replacing each `[NEEDS CLARIFICATION: …]` with a resolved decision.
- **Gate:** re-run **G0** after resolving.
- **Subagents/skills:** `gate`.

## Steps

1. **Locate the feature.** `$ARGUMENTS` names the feature (slug or `NNN-slug`) — resolve to
   `changes/<NNN-feature>/spec.md` (glob-match on the slug if needed). If it doesn't exist, stop and
   tell the user to run `/forge:specify` first.

2. **Collect the open questions.** Grep the spec for every `[NEEDS CLARIFICATION: …]` marker. If there
   are none, report "no open clarifications" and stop — nothing to do. Keep the surrounding requirement
   (R-<n> + its Given/When/Then) with each marker so each question has context.

3. **Ask the user — one question per marker.** Use the AskUserQuestion tool. For each marker, present
   the requirement it belongs to and the specific question, with 2-4 concrete answer options plus room
   for a custom answer. Ask them in a single batch where possible so the user resolves them together.
   Do NOT guess a resolution — the whole point of a marker is that the decision is the user's.

4. **Apply the decisions.** For each marker, replace the `[NEEDS CLARIFICATION: …]` line with the
   resolved decision folded into the requirement: tighten the Given/When/Then, or add a short
   `- **Decided:** <resolution>` bullet under the scenario so the trail is visible. Remove the marker
   entirely — a resolved question leaves no marker behind.

5. **Re-run G0.** Dispatch the `gate` subagent with `gate=G0 Spec-clarity`,
   `artifacts=changes/<feature>/spec.md`. Append the new verdict block to `changes/<feature>/gates.md`
   (this is a second G0 entry — the pipeline keeps both so the resolution is auditable).

6. **Report.** Print how many markers were resolved and the new G0 verdict. If G0 now PASSes, tell the
   user the next command is `/forge:plan <feature>`. If it still FAILs, show which criterion is unmet.

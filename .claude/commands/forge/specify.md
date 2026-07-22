---
description: Turn a feature request into a delta spec (ADDED/MODIFIED/REMOVED, Given-When-Then) and run G0.
argument-hint: <feature-name or short description>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:specify — turn a feature request into a delta spec

## Contract
- **Reads:** `.forge/specs/**` (current truth), `.forge/templates/spec.md`, `.forge/templates/proposal.md`,
  `.forge/templates/gates.md`, `.forge/constitution.md`.
- **Writes:** `changes/<NNN-feature>/proposal.md` + delta `spec.md` with `## ADDED Requirements` /
  `## MODIFIED Requirements` / `## REMOVED Requirements`; each requirement lists Given/When/Then scenarios;
  mark gaps with `[NEEDS CLARIFICATION: …]`.
- **Gate:** ends by calling **G0 Spec-clarity** via the `gate` subagent; append the verdict to
  `changes/<NNN-feature>/gates.md`.
- **Subagents/skills:** `gate`.

## Steps

1. **Resolve `<NNN-feature>`.** Take `$ARGUMENTS` as the feature description. Derive a short kebab-case
   slug from it (e.g. "add a /health endpoint" → `health-endpoint`). List `changes/` for existing
   `NNN-*` directories, take the highest `NNN` + 1 (zero-padded to 3 digits; start at `001` if none
   exist). The feature directory is `changes/<NNN>-<slug>/`.

2. **Read current truth.** Glob `.forge/specs/**/spec.md` and read any that look related to this
   feature's domain (by directory name or keyword match) — this is context for whether requirements
   are ADDED (new capability) or MODIFIED/REMOVED (change existing behavior). If `.forge/specs/` is
   empty (fresh repo, `.gitkeep` only), everything is ADDED. Also read `.forge/constitution.md` for
   principles that shape scope (e.g. don't propose scope beyond what was asked).

3. **Write `proposal.md`** from the `.forge/templates/proposal.md` shape:
   - `## Why` — 2-3 sentences restating the request as a problem/need.
   - `## What changes` — the high-level shape (which requirements will be ADDED/MODIFIED/REMOVED).
   - `## Out of scope` — call out adjacent things deliberately excluded, so scope doesn't creep later.

4. **Write the delta `spec.md`** from `.forge/templates/spec.md`:
   - One `### R-<n>: <title>` block per requirement under the correct section
     (`## ADDED Requirements` / `## MODIFIED Requirements` / `## REMOVED Requirements`). Number `R-`
     ids sequentially starting at 1 within this delta (they get their final identity when archived).
   - Every requirement (ADDED or MODIFIED) needs at least one **Given/When/Then** scenario. A REMOVED
     requirement needs a one-line reason instead of a scenario.
   - If a requirement is genuinely ambiguous (undefined error behavior, unclear input shape, missing
     non-functional target), do NOT guess — add an inline `[NEEDS CLARIFICATION: <specific question>]`
     marker right after that requirement's scenarios, and leave the rest of the spec as strong as
     possible around it. Do not pepper the whole doc with markers — only where a real decision is
     blocked.
   - Delete unused `## MODIFIED`/`## REMOVED` section content (leave the heading, drop the
     placeholder comment) if this feature is purely additive.

5. **Call G0.** Dispatch the `gate` subagent with `gate=G0 Spec-clarity`,
   `artifacts=changes/<NNN-feature>/spec.md`. Create `changes/<NNN-feature>/gates.md` from
   `.forge/templates/gates.md` if it doesn't exist yet, then append the returned verdict block.

6. **Report.** Print the file paths written and the G0 verdict. If `FAIL` (unresolved
   `[NEEDS CLARIFICATION]` or malformed sections), tell the user to run `/forge:clarify <feature>`
   next. If `PASS`/`CONCERNS`, tell them the next command is `/forge:plan <feature>`.

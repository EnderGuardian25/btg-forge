# Project Constitution — BTG Forge (starter)

> The constitution is the non-negotiable ruleset every gate checks against. Teams edit it per project.
> `/forge:init` copies this into a target repo; `session-start.sh` injects it into every session.

## Principles
1. **Spec is truth.** Code serves an accepted spec requirement (Given/When/Then). No requirement, no code.
2. **Test-first.** Every behavior change starts as a failing test (RED) before implementation (GREEN).
3. **Simplest thing that works.** Escalate to heavier planning (BMAD) only when complexity truly warrants it.
4. **Gates are honest.** A blocker is surfaced, never hidden to force a pass. Overriding a FAIL requires a
   written `Justification:` in `gates.md`.
5. **Small, reversible steps.** One task = one commit. Prefer changes that are easy to undo.
6. **Human owns the merge.** No merge to `main` or semantic-conflict resolution without explicit approval.

## Simplicity budget (G1)
- Prefer existing patterns over new abstractions. New dependency, new service, or new cross-cutting
  abstraction each needs a one-line justification in `plan.md` `## Risks`.

## Definition of Done
- Tests green (G4 pre-commit passes) · every spec acceptance line verified (G4/verify) ·
  reviewer + qa-gate = PASS (G5) · spec delta archived into `specs/`.

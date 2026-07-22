---
description: Merge spec deltas into specs/, append learnings/patterns, and move the change to archive/.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:archive — fold the accepted change back into current truth (Member D)

Runs after the change has merged. Applies the delta `spec.md` to the living `.forge/specs/` (the new current
truth), records what we learned, and retires the change folder.

## Reads
- `changes/<feature>/spec.md` (the ADDED/MODIFIED/REMOVED delta), `proposal.md`, `verify-report.md`, `gates.md`.
- `.forge/specs/**` (current truth).

## Writes
- `.forge/specs/<domain>/spec.md` — apply the delta:
  - **ADDED** → insert the requirement.
  - **MODIFIED** → replace the existing requirement's text (keep its id stable).
  - **REMOVED** → delete the requirement.
- `.forge/learnings.md` — append a dated entry: what was tricky, what we'd do differently.
- `.forge/patterns.md` — append any reusable pattern this change established.
- Moves `changes/<feature>/` → `changes/archive/<feature>/`.

## Steps
1. **Refuse to archive an unfinished change:** `verify-report.md` must be all MET and `gates.md` must show a
   G5 PASS (or a recorded `Justification:`). If not, stop and say why.
2. Pick the target `specs/<domain>/` from the requirement ids / proposal; create it if the domain is new.
3. Apply ADDED/MODIFIED/REMOVED against current truth; keep requirement ids stable.
4. Append learnings + patterns — skip a section if there's nothing genuinely new (no filler).
5. `git mv` the change folder into `changes/archive/`.
6. Print a summary: requirements added/modified/removed, files touched, learnings recorded.

## Gate
None.

## Subagents/skills
None required.

---
description: Scaffold the .forge/ state folder + gates + hooks into the current repo so BTG Forge can run.
argument-hint: (none)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:init — scaffold BTG Forge into this repo (Member A)

Bootstraps a target repository so the rest of the pipeline has somewhere to write. Idempotent: never
overwrite an existing file — report what already exists and only create what's missing.

## Reads
- `.forge/templates/*` (this repo's canonical artifact templates), if present.

## Writes (only if missing)
- `.forge/constitution.md` — starter constitution (copy from `.forge/templates/constitution.md` if it
  exists, else the built-in default below).
- `.forge/technical-preferences.md` — BISTEC stack/convention defaults.
- `.forge/learnings.md`, `.forge/patterns.md` — empty feedback logs (header only).
- `.forge/specs/.gitkeep`, `.forge/changes/.gitkeep`, `.forge/changes/archive/.gitkeep`.

## Steps
1. Create the `.forge/` tree above (skip anything that exists).
2. Write a starter `.forge/constitution.md` if absent. Keep it short — teams edit it after.
3. Wire the **G4 pre-commit hard gate**: `ln -sf ../../.claude/hooks/pre-commit.sh .git/hooks/pre-commit`
   (on Windows without symlink support, `cp` it and note that it must be re-copied after edits).
4. Confirm the SessionStart hook is registered in `.claude/settings.json` (Member A owns it).
5. Print a summary: what was created, what already existed, and the next command (`/forge:specify`).

## Gate
None — `init` runs before the gate spine exists. It just prepares the ground.

## Starter constitution (built-in default, if no template)
See `.forge/constitution.md` in this repo for the canonical content.

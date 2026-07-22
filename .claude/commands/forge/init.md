---
description: Scaffold the .forge/ state folder + gates + hooks into the current repo so BTG Forge can run.
argument-hint: (none)
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# /forge:init — scaffold BTG Forge into this repo (Member A)

Bootstraps the current repository so the rest of the pipeline has somewhere to write. **Idempotent:**
never overwrite an existing file — report what already existed and only create what's missing.

The framework ships a complete starter `.forge/` skeleton bundled at **`.claude/templates/forge/`** (copied
in when the user installs `.claude/`). `init` copies that skeleton into `./.forge/`, then wires the hooks.

## Reads
- `.claude/templates/forge/**` — the bundled starter skeleton (constitution, technical-preferences,
  learnings, patterns, artifact `templates/`, and empty state dirs).

## Writes (only if missing)
- `.forge/constitution.md`, `.forge/technical-preferences.md`, `.forge/learnings.md`, `.forge/patterns.md`
- `.forge/templates/*` — the artifact templates B/C/D commands read from
- `.forge/specs/.gitkeep`, `.forge/changes/.gitkeep`, `.forge/changes/archive/.gitkeep`
- `.git/hooks/pre-commit` — the G4 test gate (see step 3)

## Steps
1. **Scaffold `.forge/`.** Recursively copy the bundled skeleton into `.forge/`, skipping any file that
   already exists (idempotent):
   ```bash
   mkdir -p .forge
   cp -rn .claude/templates/forge/. .forge/ 2>/dev/null || cp -r .claude/templates/forge/. .forge/
   ```
   (`cp -n` = no-clobber. If a file exists, leave the user's version untouched.)
   If `.claude/templates/forge/` is somehow absent, fall back to writing a minimal `.forge/constitution.md`
   from the built-in default below and report the missing bundle.

2. **Report** what was created vs what already existed (list both).

3. **Wire the G4 pre-commit hard gate.** Point git at the tracked hook script. Prefer a symlink; fall back
   to a copy on platforms/filesystems without symlink support (e.g. Windows):
   ```bash
   mkdir -p .git/hooks
   if ln -sf ../../.claude/hooks/pre-commit.sh .git/hooks/pre-commit 2>/dev/null; then
     echo "linked pre-commit hook"
   else
     cp .claude/hooks/pre-commit.sh .git/hooks/pre-commit && echo "copied pre-commit hook (re-run init after editing it)"
   fi
   chmod +x .git/hooks/pre-commit 2>/dev/null || true
   ```
   Note to the user: the hook auto-detects `npm test` / `pytest`, or honors `FORGE_TEST_CMD`.

3b. **Protect the hooks from CRLF corruption.** The hooks are bash scripts; a Windows checkout will rewrite
   them to CRLF and break execution unless `.gitattributes` pins them to LF. Append the guard if missing
   (idempotent):
   ```bash
   touch .gitattributes
   grep -q 'eol=lf' .gitattributes || printf '\n# BTG Forge: keep shell hooks LF so they run on Windows\n*.sh text eol=lf\n' >> .gitattributes
   ```

4. **Confirm the SessionStart hook** is registered in `.claude/settings.json` (Member A owns it). If the
   `SessionStart` entry is missing, tell the user to reinstall `.claude/settings.json` — do not silently
   rewrite it.

5. **Print next steps:** restart the session so the bootstrap fires, then run
   `/forge:specify "<feature>"`.

## Gate
None — `init` runs before the gate spine exists. It just prepares the ground.

## Built-in fallback constitution (only if the bundled skeleton is missing)
```
# Project Constitution (starter)
1. Spec is truth.  2. Test-first (RED before GREEN).  3. Simplest thing that works.
4. Gates are honest — override a FAIL only with a written Justification in gates.md.
5. Small, reversible steps (one task = one commit).  6. Human owns the merge.
```

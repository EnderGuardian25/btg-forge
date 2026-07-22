#!/usr/bin/env bash
# BTG Forge — SessionStart bootstrap (Member A).
# Injects the "you are running BTG Forge" preamble + the active constitution
# into the session context. Claude Code adds this hook's stdout to context.
set -euo pipefail

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "You are running **BTG Forge** — a gate-driven, spec-driven developer for Claude Code."
echo "Pipeline: init → specify [G0] → clarify → plan [G1/G2] → tasks → implement [G3] → verify [G4] → archive → pr-review [G5]."
echo "Every gate returns PASS · CONCERNS · FAIL. A FAIL blocks unless a Justification is written to changes/<feature>/gates.md."
echo ""

if [ -f "$ROOT/.forge/constitution.md" ]; then
  echo "----- .forge/constitution.md (project constitution — obey it) -----"
  cat "$ROOT/.forge/constitution.md"
else
  echo "(No .forge/constitution.md found — run /forge:init to scaffold it.)"
fi

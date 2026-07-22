#!/usr/bin/env bash
# BTG Forge — G4 pre-commit hard gate (Member A).
# Runs the project's test command; a non-zero exit BLOCKS the commit.
# Install into a repo with:  ln -sf ../../.claude/hooks/pre-commit.sh .git/hooks/pre-commit
# (or /forge:init wires it automatically).
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Resolve the test command: FORGE_TEST_CMD env wins, else auto-detect.
if [ -n "${FORGE_TEST_CMD:-}" ]; then
  CMD="$FORGE_TEST_CMD"
elif [ -f "$ROOT/package.json" ] && grep -q '"test"' "$ROOT/package.json"; then
  CMD="npm test --silent"
elif [ -f "$ROOT/pyproject.toml" ] || [ -f "$ROOT/pytest.ini" ]; then
  CMD="pytest -q"
else
  echo "[G4] No test command detected (set FORGE_TEST_CMD) — skipping test gate."
  exit 0
fi

echo "[G4] Running tests before commit:  $CMD"
if ! eval "$CMD"; then
  echo ""
  echo "[G4] ❌ Tests failed — commit BLOCKED. Fix tests, or bypass only with an explicit --no-verify + a Justification in gates.md."
  exit 1
fi
echo "[G4] ✅ Tests green — commit allowed."
exit 0

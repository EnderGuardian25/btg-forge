#!/usr/bin/env bash
# BTG Forge — spine smoke test (Member A).
# Repeatable check that the infrastructure A owns is sound. Run before the 0:60
# integration merge, or any time after editing hooks/settings/frontmatter.
#   bash scripts/forge-smoke.sh
# Exits non-zero if any check fails. NOTE: the gate-agent verdict check is
# manual (it needs Claude) — see the reminder printed at the end.
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
fail=0
pass() { echo "  ✅ $1"; }
bad()  { echo "  ❌ $1"; fail=1; }

echo "== 1. settings.json is valid JSON =="
if python -c "import json;json.load(open('.claude/settings.json'))" 2>/dev/null \
   || node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'))" 2>/dev/null; then
  pass "settings.json parses"
else
  bad "settings.json is not valid JSON (or no python/node available)"
fi

echo "== 2. every command/agent/skill has a frontmatter block =="
n=0
for f in .claude/commands/forge/*.md .claude/agents/*.md .claude/skills/*/SKILL.md; do
  n=$((n+1))
  if [ "$(head -1 "$f")" = "---" ] && [ "$(grep -c '^---$' "$f")" -ge 2 ]; then :; else
    bad "bad frontmatter: $f"
  fi
done
[ "$fail" = 0 ] && pass "$n files have valid frontmatter delimiters"

echo "== 3. session-start.sh emits bootstrap + constitution =="
out="$(CLAUDE_PROJECT_DIR="$ROOT" bash .claude/hooks/session-start.sh 2>/dev/null)"
echo "$out" | grep -q "running \*\*BTG Forge\*\*" && echo "$out" | grep -q "Project Constitution" \
  && pass "session-start.sh injects the constitution" \
  || bad "session-start.sh output missing bootstrap or constitution"

echo "== 4. pre-commit.sh blocks on failing tests, passes otherwise =="
FORGE_TEST_CMD="false" bash .claude/hooks/pre-commit.sh >/dev/null 2>&1
[ $? -ne 0 ] && pass "pre-commit blocks when tests fail (exit != 0)" || bad "pre-commit did NOT block a failing test"
FORGE_TEST_CMD="true" bash .claude/hooks/pre-commit.sh >/dev/null 2>&1
[ $? -eq 0 ] && pass "pre-commit allows when tests pass (exit 0)" || bad "pre-commit blocked a passing test"

echo ""
if [ "$fail" = 0 ]; then
  echo "SMOKE: ✅ all automated spine checks passed."
else
  echo "SMOKE: ❌ one or more spine checks failed (see above)."
fi
echo "MANUAL: run the 'gate' subagent on .forge/templates/spec.md (or a real spec)"
echo "        and confirm it returns a well-formed '### <gate> — PASS|CONCERNS|FAIL' block."
exit $fail

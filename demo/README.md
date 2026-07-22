# BTG Forge demo — add a `/health` endpoint

A minimal, **zero-dependency** Node target app used to demo the full BTG Forge loop end-to-end. The planning
artifacts for the `003-health` feature are **pre-staged** (spec → plan → tasks, with G0–G2 already PASS) so
the live demo starts at the interesting part: **TDD implement → verify → PR review**.

## The app (`health-app/`)
- `src/server.js` — a plain Node `http` handler. Serves `GET /` today; **no `/health` route yet.**
- `test/root.test.js` — a passing base test (proves the suite runs).
- `package.json` — `npm test` → `node --test`, `npm start` → runs the server. No install needed.

## Pre-staged feature (`health-app/.forge/changes/003-health/`)
`proposal.md` · `spec.md` (R-1: `GET /health` → `200 {"status":"ok"}`) · `plan.md` (triage LOW) ·
`tasks.md` · `gates.md` (G0 / G1 / G2 PASS). `verify-report.md` is produced live by `/forge:verify`.

## Run the demo
```sh
cd demo/health-app
npm test                      # base suite is green

/forge:implement 003-health   # G3: tdd-engineer writes the RED /health test → impl-engineer GREEN → refactor → commit
npm test                      # now includes the health test — green

/forge:verify 003-health      # quotes R-1's acceptance line, marks it MET → verify-report.md; G4 / qa-gate PASS
# open a PR into main, then:
/forge:pr-review <PR#>        # G5: summary + reviewer/qa-gate verdict; escalates via github-escalation if blocked
```

Expected end state: `GET /health` → `200 {"status":"ok"}`, `verify-report.md` all MET, G4 and G5 PASS.

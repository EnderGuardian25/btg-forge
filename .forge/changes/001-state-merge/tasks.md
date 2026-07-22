# Tasks — 001-state-merge

> `[P]` = parallelizable. Each task names the file(s) it touches and its verification step.

### Wave 1
1. Add the failing tests for `mergeState` (RED) — files: `backend/test/merge.test.js` — verify: `npm test` fails because `mergeState` is not exported yet (right reason, not a syntax error). Covers R-1 (union), R-2 (done=true wins), R-3 (learning OR + track incoming).

### Wave 2
2. Implement + export `mergeState(existing, incoming)` (GREEN) — files: `backend/src/worker.js` — verify: `npm test` passes all three cases.
3. Wire `npm test` → `node --test` — files: `backend/package.json` — verify: `npm test` runs the new test file (not "missing script: test").

### Wave 3
4. Use `mergeState` in `handlePutState` (read existing → normalise incoming → merge → persist) — files: `backend/src/worker.js` — verify: `npm test` still green; existing smoke-test contract (`ok:true`, sizes) unchanged.

# Tasks — 003-health

> `[P]` = parallelizable. Each task names the file(s) it touches and its verification step.

### Wave 1
1. Add the failing test for `GET /health` (RED) — files: `test/health.test.js` — verify: `npm test` fails on the health case for the right reason (route returns 404, not 200).
2. Implement the `GET /health` route (GREEN) — files: `src/server.js` — verify: `npm test` passes (all cases green).

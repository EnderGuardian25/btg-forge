# Plan — 001-state-merge

## Complexity Triage
- **Score:** 2/10 · **Tier:** LOW
- **Rationale:** three requirements, but all satisfied by one new pure function (`mergeState`) plus a
  small change to one existing handler (`handlePutState`) and one new test file. No new dependencies
  (Node's built-in `node:test`), no cross-cutting concerns, no data-model migration.
- LOW → this Lite plan is enough. No BMAD escalation.

## Approach
- Add a pure function `mergeState(existing, incoming)` to `backend/src/worker.js`:
  - **queue** — union by `url`; on the same url, `done` is OR'd (done=true wins), `title`/`src` taken
    from incoming (freshest). Covers R-1, R-2.
  - **learning** — union of keys; per-key value is OR'd (once true, stays true). Covers R-3 (learning).
  - **track** — incoming value wins. Covers R-3 (track).
  - **updatedAt** — set fresh at merge time.
- Change `handlePutState`: read existing state from KV (fall back to `DEFAULT_STATE` if empty/malformed),
  `normaliseState(incoming)` as today, then `mergeState(existing, normalised)`, then persist the merged
  result. Response reports merged sizes.
- Add `backend/test/merge.test.js` — first real unit tests for the backend, one per requirement, using
  `node:test` + `node:assert`. Wire `npm test` → `node --test`.

## Tech choices
- Node built-in `node:test` + `node:assert` — zero new dependencies, matches the repo's
  "no framework, no build step" ethos (`.forge/technical-preferences.md` says use the repo's existing
  runner; there is none yet, so the lightest zero-dep option is the right default).
- Keep `normaliseState` unchanged — it still validates/clamps incoming before merge.

## Risks
- Malformed existing JSON in KV could throw on read — mitigate by treating a parse failure as
  `DEFAULT_STATE` (don't 500). This is the only real edge; no new dependency or abstraction introduced.

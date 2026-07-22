# Plan — 003-health

## Complexity Triage
- **Score:** 1/10 · **Tier:** LOW
- **Rationale:** one route, one file (`src/server.js`), no new dependencies, no cross-cutting concerns.
- LOW → this Lite plan is enough. No BMAD escalation.

## Approach
- Add a `GET /health` branch to the existing request `handler` in `src/server.js`.
- Return `200` with `Content-Type: application/json` and body `{"status":"ok"}`.

## Tech choices
- Plain Node `http` handler — matches the existing app; no framework or deps
  (see `.forge/technical-preferences.md`).

## Risks
- None material. The endpoint is public and side-effect free.

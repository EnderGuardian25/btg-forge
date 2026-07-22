# Proposal — 003-health

## Why
Ops and uptime monitors need a cheap, dependency-free way to confirm the service is alive. Today there is no
endpoint that reports liveness without exercising a real route.

## What changes
Add a `GET /health` route that returns `200` with JSON body `{"status":"ok"}`. See the spec delta
(`spec.md`, R-1).

## Out of scope
- Deep/readiness checks (DB, downstream dependencies) — liveness only.
- Auth on the endpoint — it stays public.

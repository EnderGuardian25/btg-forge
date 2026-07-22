# Proposal — 001-state-merge

## Why
The dashboard's sync backend (`backend/src/worker.js` in personal-dashboard) replaces the entire saved
state on every `PUT /api/state`. When two devices sync, the last writer wins and the other device's
queue additions and learning-path progress are silently lost. Users need cross-device changes to
combine, not clobber.

## What changes
On `PUT /api/state`, the worker reads the existing state and **merges** the incoming state into it
before persisting, instead of overwriting. Merge rules: queue is unioned by `url` (done=true wins on
conflict), learning flags are OR'd per key (once true, stays true), and `track` takes the incoming
value (the last user's active filter). See the spec delta (`spec.md`, R-1/R-2/R-3).

## Out of scope
- Per-item timestamps or a full CRDT — a deterministic field-merge is enough for this data.
- Frontend changes — `index.html` already sends full state; no client change needed.
- Deleting queue items across devices — union only adds/keeps; removal sync is a separate concern.

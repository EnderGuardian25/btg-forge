# Spec delta — 001-state-merge

> Delta against current truth in `.forge/specs/`. Only describe what CHANGES.

## ADDED Requirements

### R-1: Queue is unioned on merge
- **Given** the saved state has a queue item with url `A` and the incoming PUT has a queue item with url `B`
- **When** the client sends `PUT /api/state` with the incoming state
- **Then** the persisted queue contains both `A` and `B` (no item is dropped)

### R-2: Done flag survives merge (done=true wins)
- **Given** the saved state has queue item url `A` with `done:false` and the incoming PUT has the same url `A` with `done:true` (or vice versa)
- **When** the client sends `PUT /api/state`
- **Then** the persisted queue has exactly one item for url `A` with `done:true`

### R-3: Learning flags are OR'd; track takes incoming
- **Given** the saved state has `learning: {"learn-1": true}` and `track: "cyber"`, and the incoming PUT has `learning: {"learn-1": false, "learn-2": true}` and `track: "design"`
- **When** the client sends `PUT /api/state`
- **Then** the persisted `learning` is `{"learn-1": true, "learn-2": true}` (once true, stays true) and `track` is `"design"` (incoming wins)

## MODIFIED Requirements
<!-- none -->

## REMOVED Requirements
<!-- none -->

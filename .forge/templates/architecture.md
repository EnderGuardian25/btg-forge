# Architecture — <NNN-feature>

> BMAD tier (HIGH complexity only). Produced by the `architect` agent from the PRD.
> Honors `.forge/constitution.md` and `.forge/technical-preferences.md`; every added complexity is
> justified here or it belongs in the Lite plan instead.

## Context
<how this feature fits the existing system; what it touches, what it leaves alone>

## Components
### <component name>
- **Responsibility:** <single responsibility>
- **Location:** `<path/dir>`
- **Interfaces:** <inputs/outputs, public functions/endpoints>
- **Traces:** FR-<n> / NFR-<n>

<!-- one block per new or modified component -->

## Data Model
<new/changed entities, fields, relationships. Note any migration. "None" if stateless.>

## Key Decisions
### D-1: <decision title>
- **Choice:** <what was chosen>
- **Alternatives considered:** <what was rejected and why>
- **Justification:** <ties to a constitution principle or a PRD requirement>

## Risks & Mitigations
- <risk> → <mitigation>

## Sequencing
<the order components must be built so tasks.md can wave them correctly>

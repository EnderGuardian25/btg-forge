# Technical Preferences — BISTEC defaults (starter)

> Stack defaults the `architect`/`plan` stages assume unless a change overrides them. Edit per project.

## Stack
- **Language/runtime:** TypeScript on Node LTS (fallback: Python 3.12) — match the target repo.
- **Testing:** the repo's existing runner (Jest/Vitest for TS, pytest for Python). Tests colocated or in `tests/`.
- **Formatting/lint:** the repo's existing config (Prettier/ESLint, ruff/black). Do not introduce new tooling silently.

## Conventions
- Conventional commits (`feat:`, `fix:`, `test:`, `refactor:`, `chore:`).
- One task → one commit. Small PRs into `main`.
- File names match surrounding code; no drive-by renames.

## Anti-patterns (flag in review)
- Impl written before a test. · Broad `any`/untyped boundaries. · New dependency without justification.
- Silent scope creep beyond the accepted spec delta.

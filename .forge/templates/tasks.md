# Tasks — <NNN-feature>

> `[P]` = parallelizable (no dependency on another task in the same wave).
> Each task names the file(s) it touches, its verification step, and a `tier:` (LOW/MED/HIGH)
> that drives per-task model selection in subagent-driven mode.

### Wave 1
1. <task> — files: `<path>` — verify: `<test/command>` — tier: MED
2. [P] <task> — files: `<path>` — verify: `<test/command>` — tier: LOW

### Wave 2
3. <task> — files: `<path>` — verify: `<test/command>` — tier: HIGH

## Execution
Mode: <in-session | subagent-driven>
Why: <one line — e.g. "triage LOW + 3 tasks → in-session recommended">

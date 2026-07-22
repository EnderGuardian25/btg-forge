# Tasks — <NNN-feature>

> `[P]` = parallelizable (no dependency on another task in the same wave).
> Each task names the file(s) it touches and its verification step.

### Wave 1
1. <task> — files: `<path>` — verify: `<test/command>`
2. [P] <task> — files: `<path>` — verify: `<test/command>`

### Wave 2
3. <task> — files: `<path>` — verify: `<test/command>`

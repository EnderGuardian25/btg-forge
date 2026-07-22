# Forge Dashboard

A zero-dependency dashboard that visualizes BTG Forge pipeline state — per-feature gate status,
traceability matrix, and repo overview stats — served on GitHub Pages and **rebuilt on every push
to `main`**.

## How it works

1. `generate.mjs` walks every `.forge/changes/<NNN-feature>/` in the repo (plus any under `demo/**`),
   parses `gates.md` / `spec.md` / `plan.md` / `tasks.md` / `verify-report.md`, and writes `data.json`.
2. `index.html` fetches `data.json` and renders it (static, no build step, theme-aware).
3. `.github/workflows/dashboard.yml` runs the generator, stamps the build time, and deploys the
   `dashboard/` folder to Pages — triggered on push to `main` touching `.forge/`, `demo/`, or
   `dashboard/`. This is the "timely sync": the dashboard reflects merged state within ~1 minute.

## Run locally

```bash
node dashboard/generate.mjs          # regenerate data.json from current .forge state
cd dashboard && python -m http.server 8000   # then open http://localhost:8000
```

## Enabling Pages (one-time, repo settings)

Settings → Pages → Build and deployment → Source: **GitHub Actions**. The workflow does the rest.
Deployed URL: `https://<owner>.github.io/btg-forge/`.

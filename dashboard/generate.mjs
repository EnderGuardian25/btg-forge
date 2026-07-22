#!/usr/bin/env node
// BTG Forge dashboard generator.
// Scans every `.forge/changes/<NNN-feature>/` in the repo (the live pipeline state) plus any under
// `demo/**/.forge/changes/`, parses the forge artifacts, and writes `dashboard/data.json`.
// Zero dependencies — plain Node fs. Run: `node dashboard/generate.mjs` (from repo root).

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GATES = ["G0", "G1", "G2", "G3", "G4", "G5"];

// --- filesystem walk -------------------------------------------------------

/** Find every directory named `changes` that sits directly under a `.forge` dir. */
function findChangeRoots(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name === "node_modules" || e.name === ".git") continue;
    const full = join(dir, e.name);
    if (e.name === "changes" && dir.endsWith(".forge")) {
      out.push(full);
    } else {
      findChangeRoots(full, out);
    }
  }
  return out;
}

/** A feature is a `NNN-slug` directory inside a changes root (excluding `archive`). */
function findFeatureDirs(changesRoot) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(changesRoot, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name === "archive") {
      // Archived features live one level deeper; mark them archived.
      for (const a of readdirSync(join(changesRoot, e.name), { withFileTypes: true })) {
        if (a.isDirectory() && /^\d{3}-/.test(a.name)) {
          out.push({ dir: join(changesRoot, e.name, a.name), archived: true });
        }
      }
      continue;
    }
    if (/^\d{3}-/.test(e.name)) out.push({ dir: join(changesRoot, e.name), archived: false });
  }
  return out;
}

function read(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

// --- artifact parsers ------------------------------------------------------

/** Parse gates.md → [{ gate, id, verdict, reasons[], justified }]. */
function parseGates(md) {
  if (!md) return [];
  const out = [];
  const lines = md.split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    const h = line.match(/^###\s+(G\d)\b(.*?)—\s*(PASS|CONCERNS|FAIL)\s*$/i);
    if (h) {
      cur = {
        id: h[1].toUpperCase(),
        gate: (h[1] + h[2]).trim(),
        verdict: h[3].toUpperCase(),
        reasons: [],
        justified: false,
      };
      out.push(cur);
      continue;
    }
    if (!cur) continue;
    if (/^Justification:/i.test(line.trim())) {
      cur.justified = true;
      continue;
    }
    const b = line.match(/^\s*-\s+(.*)$/);
    if (b) cur.reasons.push(b[1].trim());
  }
  return out;
}

/** Parse spec.md → { requirements: [{id,title,section,clarifications[]}], needsClarification }. */
function parseSpec(md) {
  if (!md) return { requirements: [], needsClarification: 0 };
  const reqs = [];
  let section = null;
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    const sec = line.match(/^##\s+(ADDED|MODIFIED|REMOVED)\s+Requirements/i);
    if (sec) {
      section = sec[1].toUpperCase();
      continue;
    }
    const r = line.match(/^###\s+(R-\d+):\s*(.*)$/);
    if (r) reqs.push({ id: r[1], title: r[2].trim(), section: section || "ADDED", clarifications: [] });
  }
  const clar = (md.match(/\[NEEDS CLARIFICATION:[^\]]*\]/g) || []).length;
  return { requirements: reqs, needsClarification: clar };
}

/** Parse plan.md → { score, tier }. */
function parsePlan(md) {
  if (!md) return null;
  const score = md.match(/\*\*Score:\*\*\s*(\d+)\s*\/\s*10/i);
  const tier = md.match(/\*\*Tier:\*\*\s*(LOW|MED|HIGH)/i);
  return {
    score: score ? Number(score[1]) : null,
    tier: tier ? tier[1].toUpperCase() : null,
  };
}

/** Parse tasks.md → { waves: [{n, tasks:[{num,parallel,text,files[],verify}]}], count }. */
function parseTasks(md) {
  if (!md) return { waves: [], count: 0 };
  const waves = [];
  let cur = null;
  let count = 0;
  for (const line of md.split(/\r?\n/)) {
    const w = line.match(/^###\s+Wave\s+(\d+)/i);
    if (w) {
      cur = { n: Number(w[1]), tasks: [] };
      waves.push(cur);
      continue;
    }
    const t = line.match(/^\s*(\d+)\.\s+(\[P\]\s*)?(.*)$/);
    if (t && cur) {
      count++;
      const text = t[3];
      const files = (text.match(/files:\s*([^—]+)/i)?.[1] || "")
        .split(/[,`]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const verify = text.match(/verify:\s*(.+)$/i)?.[1]?.trim() || null;
      cur.tasks.push({
        num: Number(t[1]),
        parallel: Boolean(t[2]),
        text: text.split("—")[0].trim(),
        files,
        verify,
      });
    }
  }
  return { waves, count };
}

/** Parse verify-report.md → { checks:[{line,req,met}], met, total }.
 *  Tolerates an optional `R-<n>:` prefix before the quoted acceptance line. */
function parseVerify(md) {
  if (!md) return null;
  const checks = [];
  for (const line of md.split(/\r?\n/)) {
    // - [x] R-1: "acceptance line" — **MET** — evidence…   (R-<n>: prefix optional)
    const c = line.match(/^\s*-\s*\[.\]\s*(?:(R-\d+):\s*)?"(.+?)"\s*—\s*\*\*(MET|UNMET)\*\*/i);
    if (c) checks.push({ req: c[1] || null, line: c[2], met: c[3].toUpperCase() === "MET" });
  }
  return { checks, met: checks.filter((c) => c.met).length, total: checks.length };
}

// --- pipeline stage inference ---------------------------------------------

const STAGE_ORDER = ["specify", "clarify", "plan", "tasks", "implement", "verify", "archive", "pr-review"];

function inferStage(feat) {
  if (feat.archived) return "archived";
  const gateIds = new Set(feat.gates.map((g) => g.id));
  if (gateIds.has("G5")) return "pr-review";
  if (feat.verify) return "verify";
  if (gateIds.has("G3")) return "implement";
  if (feat.tasks.count > 0) return "tasks";
  if (gateIds.has("G1") || gateIds.has("G2")) return "plan";
  if (feat.spec.requirements.length > 0) return "specify";
  return "init";
}

function nextCommand(stage, slug) {
  const map = {
    init: `/forge:specify "<idea>"`,
    specify: `/forge:plan ${slug}`,
    plan: `/forge:tasks ${slug}`,
    tasks: `/forge:implement ${slug}`,
    implement: `/forge:verify ${slug}`,
    verify: `/forge:pr-review <PR#>`,
    "pr-review": `/forge:archive ${slug}`,
    archived: "—",
  };
  return map[stage] || "—";
}

// --- build -----------------------------------------------------------------

function worstVerdict(gates) {
  if (gates.some((g) => g.verdict === "FAIL" && !g.justified)) return "FAIL";
  if (gates.some((g) => g.verdict === "CONCERNS")) return "CONCERNS";
  if (gates.length) return "PASS";
  return "—";
}

const features = [];
for (const changesRoot of findChangeRoots(REPO_ROOT)) {
  for (const { dir, archived } of findFeatureDirs(changesRoot)) {
    const slug = dir.split(/[\\/]/).pop();
    const gates = parseGates(read(join(dir, "gates.md")));
    const spec = parseSpec(read(join(dir, "spec.md")));
    const plan = parsePlan(read(join(dir, "plan.md")));
    const tasks = parseTasks(read(join(dir, "tasks.md")));
    const verify = parseVerify(read(join(dir, "verify-report.md")));
    const feat = {
      slug,
      path: relative(REPO_ROOT, dir).replace(/\\/g, "/"),
      isDemo: dir.replace(/\\/g, "/").includes("/demo/"),
      archived,
      gates,
      spec,
      plan,
      tasks,
      verify,
    };
    feat.stage = inferStage(feat);
    feat.next = nextCommand(feat.stage, slug);
    feat.health = worstVerdict(gates);
    features.push(feat);
  }
}

features.sort((a, b) => a.slug.localeCompare(b.slug));

// Traceability rows: R-<n> → covered-by-task? → verified?
for (const f of features) {
  const g2passed = f.gates.some((g) => g.id === "G2" && g.verdict === "PASS");
  f.trace = f.spec.requirements.map((r) => {
    const idRe = new RegExp("\\b" + r.id + "\\b");
    // Direct signal: the requirement id is named in a task line.
    const idInTask = f.tasks.waves.some((w) => w.tasks.some((t) => idRe.test(t.text)));
    // Fallback: tasks exist and G2 (which asserts task↔requirement coverage) passed.
    const inTasks = idInTask || (f.tasks.count > 0 && g2passed);

    let verified = null;
    if (f.verify) {
      const tagged = f.verify.checks.filter((c) => c.req);
      if (tagged.length) {
        // Verify checks carry R-ids → match this requirement precisely.
        const m = tagged.find((c) => c.req === r.id);
        verified = m ? m.met : false;
      } else {
        // Untagged checks → fall back to "all acceptance lines met".
        verified = f.verify.total > 0 && f.verify.met === f.verify.total;
      }
    }
    return { req: r.id, title: r.title, section: r.section, inTasks, verified };
  });
}

const stats = {
  features: features.filter((f) => !f.archived).length,
  archived: features.filter((f) => f.archived).length,
  gatesPassed: features.flatMap((f) => f.gates).filter((g) => g.verdict === "PASS").length,
  gatesConcerns: features.flatMap((f) => f.gates).filter((g) => g.verdict === "CONCERNS").length,
  gatesFailed: features.flatMap((f) => f.gates).filter((g) => g.verdict === "FAIL" && !g.justified).length,
  openClarifications: features.reduce((n, f) => n + f.spec.needsClarification, 0),
};

const data = {
  generatedAtNote: "Set by CI at build time; see workflow.",
  gateOrder: GATES,
  stageOrder: STAGE_ORDER,
  stats,
  features,
};

const outPath = join(REPO_ROOT, "dashboard", "data.json");
writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log(`[dashboard] wrote ${relative(REPO_ROOT, outPath)} — ${features.length} feature(s), ${stats.gatesPassed} gate PASS.`);

# Workshop — Phase 1 / 1.5 handoff

State as of 2026-04-18. The plan that this work executes against lives at
`~/.claude/plans/i-have-answered-the-stateful-hennessy.md` (rev 2b).

## What's done

| Commit | SHA | What |
|--------|-----|------|
| 0 | (WIP setup) | Bundle-size baseline captured in `docs/workshop/perf-baseline.md` |
| 1 | … | vitest added with one smoke test |
| 2 | … | NaN→filter audit across `barSeries`/`lineSeries`/`mapValues` |
| 3 | … | `src/scripts/registry-types.ts` — `DatasetMeta` / `DatasetConfig` / `GeoLayerConfig` / `TimeAxis` |
| 4 | `6d87e15` | `scripts/ingest/_lib.ts` — 7 defenses (HTTP 200, Content-Type, 100 MB cap, BOM strip, gzip, SHA256, header exact-match) + 18 tests |
| 5 | `1694104` | GDP dataset (RBI state GSDP, 20 states × 5 fiscal years) |
| 6 | `badb80a` | Electricity dataset (CEA per-capita kWh, 20 states × 4 years) |
| 7 | `38365ae` | Water dataset (NITI Aayog CWMI 2.0, 25 states × 2 years) |
| 11 | `cef6f7d` | MapStudio root-SVG `fill="#d7cdb5"` defends against orphan-path black (ISSUE-009 symptomatic fix) |
| 12 | `738867f` | Telangana split (`TS` code), `state-census` 18→36, uniqueness test flipped on (ISSUE-009 root fix + ISSUE-005) |
| 13 | `e1036b7` | `canonicalizeUrlParams` + `v=1` shim (ISSUE-007) |
| 14 | `08d516e` | `<RailStatus>` component with five named states (ISSUE-003) |
| 15 | `92fac37` | `migrateStateForPatch` + entity-drop Undo toast (ISSUE-004) |
| 16 | `75c63eb` | Letterhead in URL + clamp + `innerHTML`→DOM fixes (ISSUE-006) |

Test count: 70 vitest assertions across 8 files. All green.

All 7 QA issues are resolved:

- ISSUE-001 (Compare lock note) — pre-existing template gate
- ISSUE-002 (Compare hard-cap 6) — pre-existing `capFor`
- ISSUE-003 — Commit 14
- ISSUE-004 — Commit 15
- ISSUE-005 — Commit 12
- ISSUE-006 — Commit 16
- ISSUE-007 — Commit 13

Plus the Phase-1.5 live-QA finds:

- ISSUE-008 (Map × time-series metric renders gray-everywhere) — still
  present. Fix belongs in Phase 2 compatibility matrix (Decisions #42/43/44).
- ISSUE-009 (pathsByCode AP/Telangana collision) — fixed twice, symptom
  (Commit 11) + root (Commit 12).

## What's left in Phase 1

Two commits outstanding; neither blocks Phase 2:

### Commit 8 — GeoJSON vendoring + lazy-load

- Vendor `public/geo/india-districts.geojson` from `datta07/INDIAN-SHAPEFILES`
  with the upstream commit SHA pinned in `GeoLayerConfig.upstream`.
- Vendor `public/geo/india-ls-2024.geojson` from
  `shijithpk/2024_maps_supplement` with SHA pinned.
- Keep `public/india-states.geojson` eager-loaded (37 KB is fine).
- Move MapStudio + CompareStudio GeoJSON fetches to dynamic on-demand loads
  when the Map/Compare preset is first selected (the files are ~8 MB + ~4 MB).
- Add a loading skeleton to `MapStudio.astro` at the fetch site (replaces
  the current silent `await fetch`). Tick animation for the 20 s 3G worst
  case; shape the fetch site so Phase-3 Playhead doesn't have to rewrite it.

### Commit 9 — `/data` inventory page

- New route `src/pages/data/index.astro`.
- One card per committed dataset (census / state-census / loksabha /
  GDP / electricity / water). Each card shows label, source URL,
  license, refreshed date, `entityCatalog().length`, `timeAxis.kind`,
  `timeAxis.ticks.length`, and a download link to the raw file.
- One card per committed geo layer (state + the two Commit-8 additions).
- Landing section links back to data.gov.in / source repos with attribution.

## What's deferred

### Phase 2 (not started) — 2-3 weeks

- `compatibility.ts` matrix (gates §02 metric + §05 preset radios)
- Dataset + geo-layer registries with `registerDataset` / `registerLayer` + Decision-#19 validators
- Tooltip primitive + slide-over help drawer
- Rail `?` icons + per-section blurbs
- Missing-states matrix at `docs/workshop/states.md` (4 studios × 8 states)
- `docs/workshop/add-{dataset,geo,metric}.md` extension docs
- `bun run new:dataset <id>` scaffold + `examples/hello-dataset/` PR
- a11y sweep
- Decisions #42–#44 carry-ins from Phase 1.5 (URL-hydration coercion + MapStudio empty-state card)

### Phase 3 (not started) — 3-5 weeks

- `Playhead` primitive + `<PlayControl>` + `<TimeSlider>`
- Line scrub / animated Map / Bar race
- Video export (`canvas.captureStream` + `MediaRecorder`)
- Re-eval cross-dataset overlay, tilegram mode, outlier detector

### Phase 4 (deferred)

- Vidhan Sabha per-state GeoJSON
- More ministry datasets
- `registerStudio()` pluggability

## Where to pick up

- **Fresh Phase-1 session**: Commit 8 (GeoJSON vendoring) is the next
  atomic unit. Commit 9 can follow directly or be done in parallel — no
  code dependency between them.
- **Phase-2 kickoff**: start with `compatibility.ts` and wire it into
  `studio.ts`'s radio handlers. The three real tenants (state-census,
  GDP, water) already exercise `timeAxis` heterogeneity (decadal vs
  annual vs quinquennial) so the matrix design has concrete shape from
  day one.

## Housekeeping

- 5 commits are ahead of `origin/main` — not pushed. Push when ready.
- No outstanding file changes; working tree is clean.
- Registry split pattern (`.meta.ts` + `.values.ts`) is in place for all
  six datasets; Phase 2's `/data` page can import `.meta.ts` only.

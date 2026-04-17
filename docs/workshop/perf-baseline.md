# Performance baseline — The Workshop

Per-page load numbers captured against the local dev server (`http://localhost:4321`) on
2026-04-17 via the `browse` headless Chromium driver. **This is a dev-server baseline, not a
production one.** Use the numbers relationally (page-vs-page, before-vs-after a refactor),
not absolutely — a real build served over a real CDN will look different.

## How this was measured

Each URL was navigated once sequentially in the same browser session. For each page, I
collected (a) navigation timings via `performance.getEntriesByType('navigation')[0]` and
(b) paint / layout-shift timings via `getEntriesByType('paint'|'layout-shift'|
'largest-contentful-paint')`. The `⎙ Print Report` / `⤓ CSV` / `⬇ PNG` export flows were
not exercised.

**Important caveat — browser caching:** The four studios all resolve to the same Astro page
(`/tools/studio`), so the first studio load pays the full JS/CSS transfer, and subsequent
loads pull most assets from the browser cache. The `resourceTotalBytes` column makes this
obvious (1.46 MB on the first studio load, ~7 KB on the next three). This matches how real
users experience the flow — first-click cost, then near-zero.

## Headline table

| Page | DOM ready | `load` event | FCP | CLS | `transferSize` (HTML) | Resources |
|------|----------:|-------------:|----:|----:|----------------------:|----------:|
| `/tools` (landing)                  | 419 ms | **668 ms** | 436 ms | 0.00 | 136.9 KB | 22 |
| `/tools/studio?preset=bar` (cold)    |  90 ms | **143 ms** |  76 ms | 0.00 | 199.3 KB | 46 |
| `/tools/studio?preset=line` (warm)   |  30 ms | **66 ms**  |  88 ms | 0.00 | 199.3 KB | 48 |
| `/tools/studio?preset=map` (warm)    |  19 ms | **21 ms**  |  64 ms | 0.00 | 199.3 KB | 48 |
| `/tools/studio?preset=compare` (warm)|  60 ms | **62 ms**  |  56 ms | 0.00 | 199.3 KB | 48 |

Notes:

- `transferSize` is the compressed size of the HTML document itself (not the whole page).
- `Resources` counts everything the page requested (HTML, JS, CSS, fonts, images, geojson).
- **LCP was `null`** on every page. The Performance API only fires `largest-contentful-paint`
  for pages with a qualifying "large" element (image ≥ certain size, heading, etc.) above
  the fold. The studios render SVG/canvas below an above-fold header, which likely evades
  the heuristic. Not a bug — just a metric-shape quirk.

## Per-page breakdown

### `/tools` — Landing (4 cards)

```
ttfb          5 ms
domParse    392 ms   ← bulk of total cost here
domReady    419 ms
load        668 ms   ← slowest page in the set (because it's the first hit)
FCP         436 ms
CLS           0.00
HTML        136.9 KB
Total res   ~954 KB across 22 resources
```

### `/tools/studio?preset=bar` — Bar Studio

```
ttfb          4 ms
domParse      9 ms
domReady     90 ms
load        143 ms
FCP          76 ms
CLS           0.00
HTML        199.3 KB   (rendered 4 canvases: B-01, L-01, M-01, C-01 in the DOM)
Total res   ~1.46 MB across 46 resources (first studio load → cold bundle)
```

- [ ] Intended? — _____ (all 4 studio canvases render in every preset — does Print/PNG/CSV
  capture only the visible one?)

### `/tools/studio?preset=line` — Line Studio

```
ttfb          3 ms
domParse      8 ms
domReady     30 ms
load         66 ms
FCP          88 ms
CLS           0.00
HTML        199.3 KB   (identical to Bar — same route)
Total res   ~6.9 KB across 48 resources (warm cache)
```

### `/tools/studio?preset=map` — Map Studio

```
ttfb          3 ms
domParse      9 ms
domReady     19 ms
load         21 ms    ← fastest in the set (warm cache + minimal extra fetch)
FCP          64 ms
CLS           0.00
```

### `/tools/studio?preset=compare` — Compare Studio

```
ttfb          3 ms
domParse      8 ms
domReady     60 ms
load         62 ms
FCP          56 ms
CLS           0.00
```

## Things worth tracking on future passes

1. **First-studio cold bundle** (`~1.46 MB across 46 resources`). This is the number that
   dominates the first-visit experience. Worth checking what's in there — India GeoJSON,
   fonts, the d3 bundle? A quick `$B network` after a fresh goto would enumerate.
2. **Landing `load` is 668 ms even on dev.** That's 10× a studio page. Probably `domParse`
   cost from the hero + card components. On production (with HTTP/2 push, gzip, a CDN), this
   should drop substantially — but the relative cost stays.
3. **CLS is 0 everywhere.** No layout shifts observed. Good to know — if a future change
   reintroduces one, it will show up here.
4. **LCP is not firing.** If LCP becomes a target metric, either the layout needs a
   "qualifying" large element above the fold (big hero heading / image), or you'll need to
   instrument LCP explicitly via a custom `PerformanceObserver`.

## Reproducing this baseline

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
for url in \
  "http://localhost:4321/tools" \
  "http://localhost:4321/tools/studio?preset=bar" \
  "http://localhost:4321/tools/studio?preset=line" \
  "http://localhost:4321/tools/studio?preset=map" \
  "http://localhost:4321/tools/studio?preset=compare"; do
  $B goto "$url" >/dev/null
  $B wait --networkidle >/dev/null
  echo "=== $url ==="
  $B perf
  $B js "JSON.stringify({
    lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime ?? null,
    fcp: performance.getEntriesByType('paint').find(p=>p.name==='first-contentful-paint')?.startTime ?? null,
    cls: (performance.getEntriesByType('layout-shift')||[]).reduce((s,e)=>s+e.value,0),
    transferSize: performance.getEntriesByType('navigation')[0]?.transferSize,
    resourceCount: performance.getEntriesByType('resource').length,
    resourceTotalBytes: performance.getEntriesByType('resource').reduce((s,r)=>s+(r.transferSize||0),0)
  })"
done
```

Run this same script after any refactor to the studios and diff the output against the
table above.

---

## Pre-pivot bundle baseline (2026-04-17, commit 1c85653)

This section is the **static bundle-size baseline** captured before any Phase-1
data-first pivot work lands. The 10% bundle-size CI gate in Phase 1 compares
against these numbers. Regenerate with `npm run build` and re-measure `dist/`.

### Totals

| Category | Bytes | KB |
|---------:|------:|---:|
| JS       | 607,492 | 593.3 |
| CSS      | 85,017 | 83.0 |
| HTML     | 180,930 | 176.7 |
| GeoJSON  | 37,982 | 37.1 |
| **Total dist/** | **~940 KB** | — |

### Per-route HTML

| Route | Bytes | KB |
|-------|------:|---:|
| `/` (homepage) | 15,896 | 15.5 |
| `/tools` | 8,754 | 8.5 |
| `/tools/studio` | 26,790 | **26.2** |
| `/editorial` | 10,178 | 9.9 |
| `/history` | 44,287 | 43.2 |
| `/scenarios` | 75,025 | 73.3 |

### JS chunks (sorted by size)

| Chunk | Bytes | KB |
|-------|------:|---:|
| `apexcharts.esm.*.js` | 522,678 | **510.4** |
| `studio.*.js` | 15,844 | 15.5 |
| `index.astro_astro_type_script_*.js` | 12,467 | 12.2 |
| `editorial.astro_astro_type_script_*.js` | 9,544 | 9.3 |
| `loksabha.*.js` | 8,184 | 8.0 |
| `scenarios.astro_astro_type_script_*.js` | 6,787 | 6.6 |
| `CompareStudio.astro_astro_type_script_*.js` | 6,318 | 6.2 |
| `MapStudio.astro_astro_type_script_*.js` | 4,736 | 4.6 |
| `state-census.*.js` | 4,079 | 4.0 |
| `metrics.*.js` | 3,802 | 3.7 |

### CSS chunks

| Chunk | Bytes | KB |
|-------|------:|---:|
| `global.*.css` | 51,445 | 50.2 |
| `WorkshopLayout.*.css` | 26,182 | 25.6 |
| `studio.*.css` | 7,390 | 7.2 |

### Static assets

| Asset | Bytes | KB |
|-------|------:|---:|
| `india-states.geojson` | 37,982 | 37.1 |

### CI-gate targets for Phase 1+

The plan's rev 2b decision (#37) commits to a **10% CI gate on the `/tools/studio`
initial bundle.** Baseline sum: HTML (26.2 KB) + studio.js (15.5 KB) + apexcharts.js
(510.4 KB) + relevant CSS (~32 KB) ≈ **584 KB initial shell**.

- **10% headroom:** +58 KB before CI fails.
- **What's tracked:** synchronous JS + CSS + HTML for `/tools/studio` on first paint.
- **What's NOT tracked:** lazy-loaded GeoJSON (district + LS 2024), optional dataset
  bodies (`.values.ts` split from `.meta.ts`), Playhead animation assets (Phase 3).

### Known bloat

- **ApexCharts alone is 510 KB** (~87% of the studio-page initial JS). The plan's
  Phase 3 animation work considers custom CSS-transform bar rendering as the Bar
  race strategy (Decision #9). A side benefit of going custom: chance to tree-shake
  unused ApexCharts features or swap to a lighter chart lib.
- **`/scenarios` is 75 KB of HTML** — heaviest non-studio page. Unrelated to the
  Workshop pivot; noted for the record.
- **Chunk-size warning from vite**: "Some chunks are larger than 500 kB after
  minification" — triggered by ApexCharts. Expected.

### Reproducing this baseline

```bash
npm run build
du -sh dist/
find dist -name "*.html" -type f -exec ls -la {} \; | awk '{printf "%8d  %s\n", $5, $NF}'
find dist/_astro -name "*.js" | xargs ls -la | awk '{printf "%8d  %s\n", $5, $NF}' | sort -rn | head -10
find dist/_astro -name "*.css" | xargs ls -la | awk '{printf "%8d  %s\n", $5, $NF}'
```

Save the output diff against this section as evidence in Phase 1 PRs.

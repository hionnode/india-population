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

# QA report — The Workshop

Report-only pass over `/tools` and the four studios at `/tools/studio?preset={bar,line,map,compare}`.
**No fixes applied. No source code read.** Every issue has reproducible steps and at least one
screenshot under `docs/workshop/screens/`.

- Date: 2026-04-17
- Base URL: http://localhost:4321
- Mode: full (five pages)
- Evidence folder: `docs/workshop/screens/`

## Summary

| Metric | Value |
|--------|-------|
| Pages visited | 5 (landing + 4 studios) |
| Console errors | **0** across all pages |
| Network failures | 0 observed |
| Issues documented | 7 |
| Critical | 0 |
| High | 2 |
| Medium | 3 |
| Low | 2 |

**Headline health score: 78 / 100.**

Breakdown: Console 100 · Links 100 · Visual 92 · Functional 66 · UX 62 · Content 85 ·
Performance (not assessed here — see `perf-baseline.md`) · Accessibility 92.

The app is structurally healthy — no JS errors, all routes return 200, all navigation links
resolve. Issues cluster around **state / copy coherence**: locked-state text leaking into
non-locked studios, warning copy that doesn't match behavior, chip-list footer strings that
don't match what's selected, and URL state inconsistencies when switching dataset.

No test framework detected in the repo. Running `/qa` (not `/qa-only`) would bootstrap one and
enable regression tracking across future passes.

## Top 3 things to fix first

1. **ISSUE-001** — "Locked · …" help copy for Compare leaks into Bar / Line / Map DOM.
2. **ISSUE-002** — "Too many states … Remove a chip to continue" warning does not actually block the report.
3. **ISSUE-004** — Entity chips persist stale state when `dataset=` param is changed via URL.

## Issues

### ISSUE-001 — "Locked" help copy appears in the DOM of every studio

- **Severity:** High
- **Category:** Content / UX
- **Pages:** `/tools/studio?preset=bar`, `?preset=line`, `?preset=map`
- **Cross-link:** [bar.md §02](bar.md#02--metric--y-axis), [line.md Sidebar deltas](line.md#sidebar-deltas), [map.md Sidebar deltas](map.md#sidebar-deltas)
- **Repro:**
  1. Navigate to `/tools/studio?preset=bar`.
  2. Run `$B text` (or inspect page source) — observe the strings *"Locked · Compare reports
     are authored around the state dataset."* and *"Locked · Compare plots population in
     millions; other metrics are available in Bar, Line, and Map."* present in the DOM under
     §01 and §02.
- **Expected:** These two strings should only render when `preset=compare`.
- **Observed:** They render in the DOM of every studio (presumably hidden by CSS, but still
  present — anyone using assistive tech, or pulling the DOM via `$B text`, sees them).
- **Evidence:** `screens/bar-default.png`, `screens/line-default.png`, `screens/map-default.png`
  (visible via `$B text` output, not necessarily visual).

### ISSUE-002 — "Remove a chip to continue" warning is misleading; report still renders

- **Severity:** High
- **Category:** UX / Content
- **Pages:** `/tools/studio?preset=compare` with 7+ entities
- **Cross-link:** [compare.md §03 Entities](compare.md#03--entities--n-selected)
- **Repro:**
  1. Navigate to `/tools/studio?preset=compare&entities=UP,MH,BR,WB,AP,MP,TN,RJ&from=1901&to=2011`.
  2. Observe warning banner: *"Too many states (8). The report reads best with 2–6. Remove a
     chip to continue."*
  3. Scroll down the canvas — all four sheets (Selection, Time series, Snapshot, Locator)
     still render with all 8 states plotted.
- **Expected:** Either the warning should block rendering of Sheets B/C/D (matching the
  "Remove a chip to continue" phrasing), or the copy should be rewritten to an advisory like
  *"The report reads best with 2 – 6 states."*
- **Observed:** The word "continue" implies a gate. There is no gate.
- **Evidence:** `screens/compare-too-many-states.png`.

### ISSUE-003 — Entity-picker footer says "All available entities already selected" when 0 selected

- **Severity:** Medium
- **Category:** Content
- **Pages:** `/tools/studio?preset=map` (default `entities=`)
- **Cross-link:** [map.md Sidebar deltas](map.md#sidebar-deltas)
- **Repro:**
  1. Navigate to `/tools/studio?preset=map`.
  2. Observe §03 Entities footer: *"Selected · 0   Max · 18   Available · state ×   All
     available entities are already selected."*
- **Expected:** If 0 are selected, the footer should say something like *"0 of 36 selected"*
  or hide the "all selected" copy.
- **Observed:** "All available entities are already selected" is displayed while the chip
  list is empty — contradictory.
- **Evidence:** `screens/map-default.png`.

### ISSUE-004 — `entities` param persists across dataset changes made via URL

- **Severity:** High
- **Category:** Functional
- **Pages:** `/tools/studio?preset=bar&dataset=region&metric=scenario2`
- **Cross-link:** [bar.md §03 Entities](bar.md#03--entities--n-selected)
- **Repro:**
  1. Navigate to `/tools/studio?preset=bar` (default loads 8 state codes).
  2. Navigate directly to `/tools/studio?preset=bar&dataset=region&metric=scenario2&from=2011&to=2011`.
  3. Observe final URL:
     `?preset=bar&dataset=region&metric=scenario2&from=2011&to=2011&entities=UP,MH,BR,WB,AP,MP,TN,RJ`.
- **Expected:** Changing `dataset` should invalidate incompatible `entities` (state codes like
  `UP, MH` cannot belong to the `region` dataset whose entities are `East, West, North, South`).
- **Observed:** The app accepts the URL as-is. State-dataset codes linger in the URL with
  `dataset=region` — either they're silently ignored by the renderer, or they produce empty bars.
- **Evidence:** `screens/qa-bar-region-scenario2.png`.

### ISSUE-005 — Dataset label `State · 18 rows` contradicts landing-card copy `All 36 states`

- **Severity:** Medium
- **Category:** Content
- **Pages:** `/tools`, every studio's §01 Dataset section
- **Cross-link:** [index.md § Landing page](index.md#landing-page-tools), [bar.md §01 Dataset](bar.md#01--dataset--pick-one)
- **Repro:**
  1. Navigate to `/tools`. Observe the Bar card's copy: *"All 36 states, any metric, one
     year — sorted, region-coloured, exportable."*
  2. Open Bar Studio. §01 Dataset shows radio labeled `02 State · 18 rows`.
  3. Open §03 Entities — footer shows `Max · 18`.
- **Expected:** Either the Bar card says "All 18 states" / "All major states", or the Dataset
  radio says `02 State · 36 rows`. The two don't match.
- **Observed:** Users read `36` on the landing, then see `18` once they're in.
- **Note:** This may be because "State" is India's 18 largest states while "Lok Sabha" splits
  into 36 constituencies, but the copy never explains this.
- **Evidence:** `screens/tools-landing.png`, `screens/bar-default.png`.

### ISSUE-006 — Report title / subtitle / byline / note inputs on Compare are not persisted in the URL

- **Severity:** Medium
- **Category:** Functional
- **Pages:** `/tools/studio?preset=compare`
- **Cross-link:** [compare.md Compare-exclusive canvas controls](compare.md#compare-exclusive-canvas-controls)
- **Repro:**
  1. Navigate to `/tools/studio?preset=compare`.
  2. Fill "Report title" textbox with `My Report`.
  3. Copy the URL via `∞ Copy Link`.
  4. Paste into a new tab. "Report title" is empty.
- **Expected:** Either the textbox values are encoded in the URL (so the "shareable view"
  claim holds for everything visible in the report), or the page tells the user these fields
  are print-only and won't survive a share.
- **Observed:** The landing page claim *"Downloadable as PNG, printable as PDF"* and the
  footer tip *"Your selection is encoded in the URL — copy the address bar to share a view"*
  both imply full state is shareable, but the Compare-exclusive fields are local-only.
- **Evidence:** Not captured — reproducible from any refresh after typing.

### ISSUE-007 — URL param order varies between loads of the same preset

- **Severity:** Low
- **Category:** Functional / UX
- **Pages:** every studio
- **Cross-link:** [bar.md URL state map](bar.md#url-state-map)
- **Repro:**
  1. Navigate to `/tools/studio?preset=bar`. URL resolves with params in one order:
     `?preset=bar&dataset=state&metric=population&entities=…&from=…&to=…`.
  2. Reload, or enter via a different chart-type flip. Param order may differ
     (`?preset=bar&entities=…&from=…&to=…&dataset=…&metric=…` observed in one QA trace).
- **Expected:** A canonical, stable param order so two copies of the "same" view yield
  byte-identical URLs and `Copy Link` produces a deterministic string.
- **Observed:** Nondeterministic — friction for anyone diffing URLs or bookmarking canonical views.
- **Evidence:** QA traces in this doc (compare navigation sections of Phase 1).

## Observations (not issues, worth noting)

- **No `fetch` / XHR failures observed on any of the five pages.** All data is bundled at
  build-time or inlined into the initial HTML.
- **The `⬇ PNG`, `⤓ CSV`, `⎙ Print Report`, `❝ Cite` buttons were not exercised in this pass**
  (export flows not tested). Worth a follow-up QA pass specifically on export affordances.
- **Keyboard accessibility of sliders and entity legend toggles** was noted at the ARIA layer
  ("Press Enter or Space to toggle") but not exercised with a keyboard driver. ARIA labels
  are present and clear, which is a good sign.

## Regression baseline

First run; no prior baseline to diff against. The list of issue titles + health score above
can be used as the baseline for a future pass.

## Console health summary

0 errors, 0 warnings across all 5 pages. This is excellent and the primary reason the
headline score is in the 70s rather than lower.

## Cross-references back to studio docs

After reading this report, update the "Known issues" sections of:

- [bar.md](bar.md#known-issues) — ISSUE-001, ISSUE-004, ISSUE-005, ISSUE-007
- [line.md](line.md#known-issues) — ISSUE-001, ISSUE-007
- [map.md](map.md#known-issues) — ISSUE-001, ISSUE-003, ISSUE-007
- [compare.md](compare.md#known-issues) — ISSUE-002, ISSUE-006, ISSUE-007

## Status

DONE — 7 issues documented, 0 critical, 2 high, 3 medium, 2 low. Health 78/100.

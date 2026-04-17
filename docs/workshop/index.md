# The Workshop — feature documentation

Observational docs of the four studios at `/tools`. Written by clicking through the live app at
`http://localhost:4321` and recording *what happens*, not whether it's right.

Pair these with `qa-report.md` (issues surfaced by automated QA) and `perf-baseline.md` (page-load
numbers) to form a full picture of current state.

## What The Workshop is

`/tools` ("The Workshop") is a set of four *studios* that each render a figure from the essay's
datasets, with a shared left-rail of controls and a canvas on the right. The URL encodes the
full view so it can be shared.

## Shape

```
          /tools  (landing)
          ┌────────────────────────────────────────┐
          │  Fig. B-01    Fig. L-01                │
          │  Bar Studio   Line Studio              │
          │  "Rank        "Trace a century"        │
          │   states"                              │
          │                                        │
          │  Fig. M-01    Fig. C-01                │
          │  Map Studio   Compare Studio           │
          │  "Paint       "Build a report"         │
          │   India"                               │
          └────────────────────────────────────────┘
                          │
                          ▼  (OPEN ▸)
          /tools/studio?preset={bar|line|map|compare}
          ┌─────────┬──────────────────────────────┐
          │ SIDEBAR │  CANVAS                      │
          │ §01 Ds  │  Fig. {B|L|M|C}-01           │
          │ §02 Mt  │  (four canvases exist in the │
          │ §03 En  │   DOM at once; chart-type    │
          │ §04 Tm  │   radio toggles visibility)  │
          │ §05 Ct  │                              │
          └─────────┴──────────────────────────────┘

Sidebar parity (§01-§05):
  Bar / Line / Map  →  identical shape, all controls enabled
  Compare           →  §01 locked to STATE, §02 locked to POPULATION,
                       §03-§05 present, canvas has 4 sheets (A/B/C/D)
                       and 4 extra text inputs above the canvas
                       (Report title, subtitle, byline, note)
```

## How to read these docs

Every observed behavior is followed by a line like:

```
- [ ] Intended? — _____
```

Read each studio doc, tick behaviors that match your intent, cross out ones that don't, and
leave a one-line note on anything ambiguous. The resulting marked-up file becomes the punch
list for what to fix or clarify later.

## Files

- [Bar Studio](bar.md) — canonical sidebar walkthrough; all other studios reference this doc for shared controls.
- [Line Studio](line.md) — notes deltas vs. Bar (defaults, legend-toggle buttons).
- [Map Studio](map.md) — notes deltas vs. Bar (entity chips behavior, choropleth canvas).
- [Compare Studio](compare.md) — the locked-dataset/metric divergence, four-sheet report, entity limit warning.
- [QA report](qa-report.md) — automated issues with repro steps and a headline health score (Phase 2).
- [Performance baseline](perf-baseline.md) — per-page load time / Core Web Vitals / bundle size (Phase 3).

## Shared structure across all four studios

The sidebar rail has exactly five numbered sections. Bar, Line, and Map render all five with full
controls. Compare renders all five but visibly locks §01 and §02.

| § | Section | Bar / Line / Map | Compare |
|---|---------|------------------|---------|
| 01 | Dataset | "pick one" · Region · State · Lok Sabha | "locked" · State only (others disabled) |
| 02 | Metric | "y-axis" · 6 metrics all selectable | "locked" · Population only (others disabled) |
| 03 | Entities | N selected · chip list · `+ add` · Max N | same shape; entity count bounds apply |
| 04 | Time range | From / To sliders, 1881 – 2011 | same |
| 05 | Chart type | Bar · Line · Map · Compare (flips preset) | same |

Top bar (all studios): `∞ Copy Link · ❝ Cite · § Sources · ⤓ CSV · ⬇ PNG · ⎙ Print Report`.

The URL is the canonical state: `preset`, `dataset`, `metric`, `entities` (CSV), `from`, `to`.
"Copy Link" copies the current address.

- [ ] Intended? — _____

## Landing page (`/tools`)

Four cards, each a link to `/tools/studio?preset=…`. Card text:

- **Fig. B-01 · Bar Studio** — *Rank states* / स्तंभ · क्रम — "All 36 states, any metric, one year — sorted, region-coloured, exportable."
- **Fig. L-01 · Line Studio** — *Trace a century* / रेखा · काल-पथ — "One metric across 1881 – 2011 — absolute, indexed, per-decade growth."
- **Fig. M-01 · Map Studio** — *Paint India* / मानचित्र — "36 states as a choropleth — any metric, any year, click to highlight."
- **Fig. C-01 · Compare Studio** — *Build a report* / तुलना · रिपोर्ट — "Side-by-side sheet for 2 – 6 states. Downloadable as PNG, printable as PDF."

Screenshot: `screens/tools-landing.png`.

- [ ] Intended? — _____ (the Bar card claims "All 36 states" but the state dataset exposes 18 rows; Lok Sabha dataset has 36)

## Known issues

To be populated after Phase 2 (`qa-report.md`).

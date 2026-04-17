# Compare Studio — `Fig. C-01 · Build a report`

**Sidebar divergence: §01 and §02 are LOCKED. §03–§05 operate with additional constraints.**
Read [bar.md](bar.md) first for shared toolbar + general sidebar shape.

## Purpose

Assemble a four-sheet side-by-side report comparing 2 – 6 states across 1901 – 2011 as a single
printable document. Sheets are page-break aware and export as one PDF via `⎙ Print Report`.

Entry card text: *"Side-by-side sheet for 2 – 6 states. Downloadable as PNG, printable as
PDF."*

## Entry URL

Preset redirect `/tools/studio?preset=compare` resolves to:

```
/tools/studio?preset=compare
  &dataset=state
  &metric=population
  &entities=UP,KL,MH
  &from=1901
  &to=2011
```

Default: 3 states (UP, Kerala, Maharashtra), century-wide time range, dataset and metric
locked. Screenshot: `screens/compare-default.png`.

- [ N] Intended? — _____ (default 3 states is within the "2-6 states" band — intentional midpoint?)

## Sidebar — locked-state details

### §01 · Dataset — "locked" (subhead text changes from "pick one")

| Radio | State observed |
|-------|---------------|
| 01 Region · 5 rows | **[disabled]** |
| 02 State · 18 rows | **[checked]** |
| 03 Lok Sabha · 36 rows | **[disabled]** |

Inline help below the subhead (verbatim):

> *Locked · Compare reports are authored around the state dataset.*

### §02 · Metric — "locked" (subhead text changes from "y-axis")

| Radio | State observed |
|-------|---------------|
| 01 Population · mn | **[checked]** |
| 02 Growth · decadal · % | **[disabled]** |
| 03 Indexed · 1901 = 100 · idx | **[disabled]** |
| 04 Pop · per seat · lakh | **[disabled]** |
| 05 Lok Sabha seats · ls | **[disabled]** |
| 06 Scenario 2 · Δ seats · ± | **[disabled]** |

Inline help below the subhead (verbatim):

> *Locked · Compare plots population in millions; other metrics are available in Bar, Line,
> and Map.*

- [ N] Intended? — _____ (§02 help text directs users elsewhere for other metrics — is this friction desired?)

### §03 · Entities — "N selected"

Same chip UI as Bar, but with a soft limit:

- Minimum 2 states, recommended max 6 (warning fires at 7+).
- Default: 3 chips (UP, KL, MH).
- Footer still shows `Max · 18` (the hard limit of the state dataset), so users can in fact
  add up to 18 — but above 6 the canvas surfaces a warning band.

Observed warning at 8 entities (screenshot `screens/compare-too-many-states.png`), verbatim:

> *Too many states (8). The report reads best with 2–6. Remove a chip to continue.*

- [N ] Intended? — _____ ("Remove a chip to continue" — does this block rendering, or just warn?)
- [N ] Intended? — _____ (soft cap of 6 but hard cap of 18 — mismatch between rail footer and canvas warning)

### §04 · Time range

Default `from=1901, to=2011`. Unlike Bar (pinned 2011) or Line (full span 1881-2011), Compare
defaults to the century-since-1901 window. The 1881 and 1891 columns are presumably omitted
because the reconstructed pre-1901 data is flagged as directional-only in the Sources panel.

- [ ] Intended? — _____ (Compare default is 1901, excluding the reconstructed 1881/1891 slices)

### §05 · Chart type

Same four-radio rack. Flipping off Compare to Bar/Line/Map lifts the §01/§02 locks (other
studios are fully unlocked).

- [ N] Intended? — _____ (flipping Compare → Bar unlocks metric but keeps entities → does 3 entities render well as a Bar ranking?)

## Compare-exclusive canvas controls

Above the multi-sheet canvas, four text inputs that do **not** exist on any other studio:

| Textbox | Purpose (inferred) |
|---------|-------------------|
| Report title | top-of-report headline |
| Report subtitle | subhead under the title |
| Byline | "by ___" author line |
| Report note | closing footnote |

None of these appear to encode into the URL (no matching query params observed on goto).

- [ N] Intended? — _____ (are title/subtitle/byline/note preserved on refresh, or only captured at Print-Report time?)

## Canvas — four-sheet report

The Compare canvas is composed of four labeled sheets, rendered as page-break-aware sections.
Each sheet has its own figure number:

```
┌──────────────────────────────────────────┐
│ Sheet A ▸ Selection               Fig.C-01│  3 / 6 states · 1901-2011
│   Hero panel listing selected states     │
│   (Uttar Pradesh / Kerala / Maharashtra) │
├──────────────────────────────────────────┤
│ Sheet B ▸ Time series             Fig.C-02│  Population trajectory / कालक्रम
│   Line chart of selected states over     │
│   the from-to range, linear scale        │
├──────────────────────────────────────────┤
│ Sheet C ▸ Snapshot                Fig.C-03│  2011 snapshot / वर्तमान
│   Bar ranking at to=2011, sort ↓ by pop  │
├──────────────────────────────────────────┤
│ Sheet D ▸ Locator                 Fig.C-04│  India · selection highlighted / भारत
│   Equirectangular map, selected states   │
│   highlighted; year = to                 │
└──────────────────────────────────────────┘
```

`Print Report` button produces a single PDF with these as ordered pages.

- [N ] Intended? — _____ (all four sheets always render regardless of selected states — even Sheet D map when dataset is hypothetically not state?)
- [N ] Intended? — _____ (Sheet C pins to `to=2011` regardless of user's slider — is the "snapshot" year always 2011 or the current `to`?)

## Permutations

### P1 — Default (UP, KL, MH · 1901–2011)

URL: `/tools/studio?preset=compare&dataset=state&metric=population&entities=UP,KL,MH&from=1901&to=2011`
Screenshot: `screens/compare-default.png`. 3 states shown in hero panel, each with Devanagari
name beneath.

### P2 — Minimum (2 states)

URL: `/tools/studio?preset=compare&entities=UP,KL&from=1901&to=2011`
Screenshot: `screens/compare-two-states.png`. The canvas still renders all 4 sheets.

### P3 — Over limit (8 states)

URL: `/tools/studio?preset=compare&entities=UP,MH,BR,WB,AP,MP,TN,RJ&from=1901&to=2011`
Screenshot: `screens/compare-too-many-states.png`. Warning banner above Sheet A:

> *Too many states (8). The report reads best with 2–6. Remove a chip to continue.*

Observed behavior: **Sheets B/C/D still render** with all 8 states plotted. The warning does
not actually block continuing, despite the "Remove a chip to continue" phrasing.

- [N ] Intended? — _____ (warning says "Remove a chip to continue" but all sheets still render — warning is advisory only?)

## ASCII flow diagram

```
  user opens /tools/studio?preset=compare
          │
          ▼
  DEFAULT URL POPULATED
  dataset=state (locked) · metric=population (locked)
  entities=UP,KL,MH · from=1901 · to=2011
          │
          ▼
  ┌─────────────────────────────────────────┐
  │ SIDEBAR:                                │
  │   §01 Dataset   [disabled except State] │
  │   §02 Metric    [disabled except Pop]   │
  │   §03 Entities  (2-6 recommended)       │
  │   §04 Time range (default 1901-2011)    │
  │   §05 Chart type → flips preset         │
  │                                         │
  │ ABOVE CANVAS:                           │
  │   Title / Subtitle / Byline / Note      │
  │   (local state; not in URL)             │
  └─────────────────────────────────────────┘
          │
          ▼
  CANVAS · four page-break-aware sheets
    Sheet A · Selection       (Fig. C-01)
    Sheet B · Time series     (Fig. C-02)
    Sheet C · 2011 snapshot   (Fig. C-03)
    Sheet D · Locator map     (Fig. C-04)
          │
          ▼
  user clicks ⎙ Print Report → single PDF
```

## URL state map

| Query param | Values in Compare | Notes |
|-------------|-------------------|-------|
| `preset`    | `compare` | Fixed while on this studio. |
| `dataset`   | `state` (locked) | Other values via URL are presumably ignored. |
| `metric`    | `population` (locked) | Same. |
| `entities`  | CSV of state codes | Soft cap at 6 (warning), hard cap at 18 (dataset max). |
| `from`      | 1881 – 2011 | Slider allows 1881; default 1901. |
| `to`        | 1881 – 2011 | Default 2011. |
| *(title, subtitle, byline, note)* | — | **Not in URL**; lost on refresh (inferred). |

- [ ] Intended? — _____ (Report title / byline / note not persisted in URL — is that intentional scope?)

## Known issues

Populated from Phase 2 — see `qa-report.md`:

- [ISSUE-002](qa-report.md#issue-002--remove-a-chip-to-continue-warning-is-misleading-report-still-renders) — "Remove a chip to continue" is advisory, not a gate.
- [ISSUE-006](qa-report.md#issue-006--report-title--subtitle--byline--note-inputs-on-compare-are-not-persisted-in-the-url) — Report title / subtitle / byline / note not persisted in URL.
- [ISSUE-007](qa-report.md#issue-007--url-param-order-varies-between-loads-of-the-same-preset) — URL param order varies between loads.

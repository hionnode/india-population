# Bar Studio — `Fig. B-01 · Rank states`

Canonical studio doc for the shared sidebar. `line.md` and `map.md` reference this file; only
document *deltas* there.

## Purpose

Rank a population-census quantity across one dataset's entities at a single year. The canvas
plots horizontal/vertical bars sorted by the chosen metric; bar color encodes geographic region
(the "region-coloured" claim on the landing card).

Entry card text: *"All 36 states, any metric, one year — sorted, region-coloured, exportable."*

## Entry URL

Preset redirect `/tools/studio?preset=bar` resolves to:

```
/tools/studio?preset=bar
  &dataset=state
  &metric=population
  &entities=UP,MH,BR,WB,AP,MP,TN,RJ
  &from=2011
  &to=2011
```

Default: **8 states pre-selected**, year pinned to 2011 (both sliders identical), metric =
Population in millions. Screenshot: `screens/bar-default.png`.

- [N ] Intended? — _____ (landing card says "All 36 states" — default loads 8)
- [ N] Intended? — _____ (year defaults to a single-year slice; both From and To = 2011)

## Sidebar controls

Top toolbar (persistent across all studios):

| Control | Affordance | Tooltip / ARIA |
|---------|-----------|----------------|
| `∞ Copy Link` | copies current URL | "Copy link to this view" |
| `❝ Cite` | (not tested in this pass) | "Copy a citation for this view" |
| `§ Sources` | opens the Sources & caveats panel inline | "Show sources and methodology notes" |
| `⤓ CSV` | downloads underlying data | "Download underlying data as CSV" |
| `⬇ PNG` | downloads chart as image | "Download chart as PNG" |
| `⎙ Print Report` | print / save-as-PDF | "Print or save as PDF" |

- [ ] Intended? — _____ (toolbar identical on all four studios; does Print Report produce the same multi-sheet PDF on non-Compare studios?)

### §01 · Dataset — "pick one"

Three mutually exclusive radios. Clicking one re-populates `dataset=` in the URL and the entity
list below.

| Radio | Meaning | Row count in label |
|-------|---------|-------------------|
| 01 Region | India's 5 regional groupings | "5 rows" |
| 02 State | State dataset | "18 rows" |
| 03 Lok Sabha | Constituency-level view | "36 rows" |

Selecting `Region` swaps the 8 state chips for 4 region chips (`East, West, North, South` —
*only 4, despite the label "5 rows"*).

- [ N] Intended? — _____ (label says "5 rows", default entity set on region = 4 chips)
- [ N] Intended? — _____ (label "18 rows" on State radio, but landing card and Lok Sabha row both reference "36 states")

### §02 · Metric — "y-axis"

Six radios, one active:

1. Population · **mn**
2. Growth · decadal · **%**
3. Indexed · 1901 = 100 · **idx**
4. Pop · per seat · **lakh**
5. Lok Sabha seats · **ls**
6. Scenario 2 · Δ seats · **±**

Switching metric updates `metric=` in the URL. Unit label appears in the canvas heading.

- [ Y] Intended? — _____ (all six metrics available for all three datasets?)
- [N ] Intended? — _____ (metric 5 "Lok Sabha seats" on the Region dataset — does it aggregate? screenshot to verify)

### §03 · Entities — "N selected"

- Chips for each currently selected entity with an `×` remove button.
- `+ add` button (behavior not fully exercised in this pass — opens a picker).
- Footer strip: `Selected · N   Max · 18    Available · state ×   All available entities are already selected.`
- When the full dataset is already selected, `+ add` presumably no-ops.

Default for `dataset=state`: 8 chips (UP · MH · BR · WB · AP · MP · TN · RJ).
Default for `dataset=region`: 4 chips (East · West · North · South).
Default for `dataset=loksabha`: **no chips**, the full 36 constituencies implied.

- [ N] Intended? — _____ (empty chip list + "Max · 18" + "all selected" copy when dataset=loksabha is confusing)
- [ N] Intended? — _____ (why does State dataset cap at Max 18 when other sources reference 36 states?)

### §04 · Time range — "From – To"

Two sliders (From year, To year), keyboard accessible. Shown span: 1881 – 2011 with ticks at
`1881 · 31 · 61 · 91 · 2011`.

Default for Bar: `from=2011&to=2011` (single year). When both equal, the canvas shows a
single-year ranking. When From < To, the Bar canvas still renders one year (presumably `to`)
— this is worth verifying against intent.

- [ N] Intended? — _____ (Bar is a single-year ranking; what does From < To do to the bars?)

### §05 · Chart type — "flip freely"

Four radios: Bar · Line · Map · Compare. Selecting one rewrites `preset=` and navigates in
place — the rest of the URL state (dataset, metric, entities, time) is preserved.

- [N ] Intended? — _____ (chart-type flip preserves dataset/metric/entities but you land on Compare's locked-state UI if those fit — does the preserved state always make sense in the target studio?)

## Permutations

### P1 — Dataset = Region, default metric

URL: `/tools/studio?preset=bar&dataset=region&metric=population&from=2011&to=2011`
Screenshot: `screens/bar-region-dataset.png`

```
Canvas · Fig. B-01 · State ranking · 2011
  North  ████████████████████████████████████   (hindi belt, largest)
  South  ████████████████████
  East   ██████████████████
  West   ████████████████
```

4 chips visible despite label "5 rows". Dataset URL carries no `entities=` at times (empty
string acceptable).

### P2 — Metric = Growth · decadal (%)

URL: `/tools/studio?preset=bar&dataset=state&metric=growth&from=1901&to=2011`
Screenshot: `screens/bar-growth-metric.png`

From/To widened to 1901 – 2011 but canvas is still a Bar chart (single-year ranking
semantics). The Growth metric on a single-year ranking is ambiguous.

- [ N] Intended? — _____ (Bar + Growth + 110-year range → what year is plotted?)

### P3 — Metric = Lok Sabha seats (ls)

URL: `/tools/studio?preset=bar&dataset=state&metric=seats&from=2011&to=2011`
Screenshot: `screens/bar-seats-metric.png`

Ranks states by seat count. Unit label flips to `ls`.

## ASCII flow diagram

```
  user opens /tools/studio?preset=bar
          │
          ▼
  DEFAULT URL POPULATED
  dataset=state · metric=population
  entities=8 big states · from=to=2011
          │
          ▼
  ┌──────────────────────────┐
  │ SIDEBAR: user toggles…   │
  │   §01 Dataset radio      │──► URL param `dataset=…` rewritten
  │   §02 Metric radio       │──► URL param `metric=…` rewritten
  │   §03 Entities × / + add │──► URL param `entities=CSV` rewritten
  │   §04 From/To sliders    │──► URL params `from,to` rewritten
  │   §05 Chart type         │──► URL param `preset=…` rewritten
  └──────────────────────────┘        │
          │                           │
          ▼                           ▼
  CANVAS re-renders            BROWSER HISTORY updated
  (Fig. B-01 bars redraw)      (shareable via Copy Link)
```

## URL state map

| Query param | Values | What it controls |
|-------------|--------|------------------|
| `preset`    | `bar` \| `line` \| `map` \| `compare` | Which canvas is foregrounded; which sidebar lock state is active. |
| `dataset`   | `region` \| `state` \| `loksabha` | Which entity pool fills §03. |
| `metric`    | `population` \| `growth` \| `indexed` \| `per_seat` \| `seats` \| `scenario2` (names inferred) | Y-axis / bar value. |
| `entities`  | CSV of entity codes (e.g. `UP,MH,BR`) | Which chips are selected. |
| `from`      | year 1881 – 2011 | Range start (Bar uses `to` for the ranking year; unverified). |
| `to`        | year 1881 – 2011 | Range end. |

Observed quirk: the query param order after a goto is not deterministic — I've seen
`preset=bar&dataset=state&metric=population&entities=…&from=…&to=…` and
`preset=bar&entities=…&from=…&to=…&dataset=…&metric=…` for what should be the same state.

- [N ] Intended? — _____ (URL param ordering stable?)

## Known issues

Populated from Phase 2 — see `qa-report.md`:

- [ISSUE-001](qa-report.md#issue-001--locked-help-copy-appears-in-the-dom-of-every-studio) — Locked copy leaks from Compare into Bar Studio DOM.
- [ISSUE-004](qa-report.md#issue-004--entities-param-persists-across-dataset-changes-made-via-url) — Entity chips persist stale state after `dataset=` changes.
- [ISSUE-005](qa-report.md#issue-005--dataset-label-state--18-rows-contradicts-landing-card-copy-all-36-states) — `State · 18 rows` contradicts landing card's "All 36 states".
- [ISSUE-007](qa-report.md#issue-007--url-param-order-varies-between-loads-of-the-same-preset) — URL param order varies between loads.

# Map Studio — `Fig. M-01 · Paint India`

**Sidebar parity: shares §01–§05 with Bar and Line. See [bar.md](bar.md) for the canonical
walkthrough.** This doc records only the deltas.

## Purpose

Plot one metric as a choropleth of India for a single year. Darker fill = higher value.
A legend strip below the title shows the value breakpoints.

Entry card text: *"36 states as a choropleth — any metric, any year, click to highlight."*

## Entry URL

Preset redirect `/tools/studio?preset=map` resolves to:

```
/tools/studio?preset=map
  &dataset=loksabha
  &metric=population
  &entities=
  &from=2011
  &to=2011
```

**Deltas from Bar defaults:**
- `dataset=loksabha` (Bar default was `state`)
- `entities=` (**empty string**, no pre-selected chips; the full 36-constituency geometry is
  drawn as a choropleth regardless of selection)
- Year pinned to 2011 (same as Bar)

Screenshot: `screens/map-default.png`.

- [ N] Intended? — 36 states is wrong(Map's default dataset is `loksabha`; landing card says "36 states" but Lok Sabha is constituencies, not states — naming collision)
- [ Y] Intended? — _____ (empty `entities=` param vs. entities omitted — both observed in URLs)

## Sidebar deltas

- **§01–§05 layout:** identical to Bar.
- **§03 · Entities with empty list:** the chip area shows only `+ add`; footer still shows
  `Selected · 0   Max · 18   Available · state ×   All available entities are already
  selected.` — **this copy is wrong when nothing is selected**.

  - [N ] Intended? — _____ (footer says "All available entities already selected" when 0 are selected)

- **Click-to-highlight:** the landing card promises "click to highlight". The page's
  interactive snapshot does not expose click-to-highlight as an @ref ARIA button — it may be
  implemented as SVG path click handlers. Not verified in this pass.

  - [Y ] Intended? — _____ (click-to-highlight on SVG states — does clicking a state add it to `entities=`?)

- **"Locked · …" help copy:** Same as on Line and Bar — the Compare-locked strings are in the
  DOM of Map Studio too, presumably hidden by CSS.

## Permutations

### P1 — Default (Lok Sabha · Population · 2011)

Screenshot: `screens/map-default.png`.

```
Canvas · Fig. M-01 · Population across India · 2011 · millions
  POPULATION · MILLIONS
  0.1 ─ 1.1 ─ 3.7 ─ 27.7 ─ 68.5 ─ 200
  [light ─────────────► dark]

  (India outline, choropleth fill by LS constituency)
```

The legend breakpoints are hard-coded at `0.1 · 1.1 · 3.7 · 27.7 · 68.5 · 200`. These appear
identical across all metrics in the observed snapshots.

- [N ] Intended? — _____ (legend breakpoints are the same for Population, Growth, Seats?)

### P2 — Switch dataset to State

Expected URL: `/tools/studio?preset=map&dataset=state&metric=population&from=2011&to=2011`.
The choropleth geometry should swap from LS constituencies (36) to state boundaries (18 or 36
depending on which "state" dataset is used).

- [N ] Intended? — _____ (map still renders all states of India even when §03 Entities list is truncated to 8 states?)

### P3 — Switch metric to "Pop · per seat"

`metric=per_seat` (naming inferred). Legend breakpoints and title unit update.

- [ N] Intended? — _____ (per-seat metric meaningful on map; any zero/NaN regions handled?)

## ASCII flow diagram

```
  user opens /tools/studio?preset=map
          │
          ▼
  DEFAULT URL POPULATED
  dataset=loksabha · metric=population
  entities=EMPTY · from=to=2011
          │
          ▼
  ┌───────────────────────────────┐
  │ SIDEBAR (same as Bar):        │
  │   §01-§05 → URL rewrite       │
  │                               │
  │ CANVAS:                       │
  │   choropleth over ALL         │
  │   entities of the dataset     │
  │   (regardless of §03 chips?)  │
  │                               │
  │   click on a state            │──► (unverified) highlight / add to entities
  └───────────────────────────────┘
          │
          ▼
  CANVAS re-renders
  (Fig. M-01 fill colors redraw)
```

## URL state map

Identical to Bar (see [bar.md § URL state map](bar.md#url-state-map)).

Differences in defaults:

| Param | Bar default | Map default |
|-------|-------------|-------------|
| `dataset` | `state` | `loksabha` |
| `entities` | 8 state codes | *(empty)* |
| `from` | `2011` | `2011` |
| `to` | `2011` | `2011` |

## Known issues

Populated from Phase 2 — see `qa-report.md`:

- [ISSUE-001](qa-report.md#issue-001--locked-help-copy-appears-in-the-dom-of-every-studio) — Locked copy leaks from Compare into Map Studio DOM.
- [ISSUE-003](qa-report.md#issue-003--entity-picker-footer-says-all-available-entities-already-selected-when-0-selected) — Entity-picker footer says "all selected" when 0 are selected.
- [ISSUE-007](qa-report.md#issue-007--url-param-order-varies-between-loads-of-the-same-preset) — URL param order varies between loads.

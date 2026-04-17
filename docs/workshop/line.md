# Line Studio — `Fig. L-01 · Trace a century`

**Sidebar parity: shares §01–§05 with Bar and Map. See [bar.md](bar.md) for the canonical
walkthrough.** This doc records only the deltas.

## Purpose

Plot one metric as a line chart across a time range (1881 – 2011 by default) for every selected
entity. Each line represents one entity. Legend doubles as a per-line visibility toggle.

Entry card text: *"One metric across 1881 – 2011 — absolute, indexed, per-decade growth."*

## Entry URL

Preset redirect `/tools/studio?preset=line` resolves to:

```
/tools/studio?preset=line
  &dataset=region
  &metric=population
  &entities=East,West,North,South
  &from=1881
  &to=2011
```

**Deltas from Bar defaults:**
- `dataset=region` (Bar default was `state`)
- 4 region chips instead of 8 state chips
- Time range is the full span `1881 – 2011` (Bar pinned to single year)

Screenshot: `screens/line-default.png`.

- [N ] Intended? — _____ (Line's default dataset is Region; Bar's is State — is this intentional divergence?)
- [ N] Intended? — _____ (Time range defaults to full 1881 – 2011 on Line but is pinned to 2011 on Bar)

## Sidebar deltas

- **§01–§05 layout:** identical to Bar.
- **Additional controls:** the canvas has **per-entity legend toggles** (surface as ARIA
  buttons like *"East, visible. Press Enter or Space to toggle."*). These sit on the canvas,
  not in the rail, and let the user hide/show individual lines without removing the chip.

  - [ N] Intended? — _____ (legend toggle persists in URL? test: hide East, refresh page)

- **"Locked · …" help copy:** The copy *"Locked · Compare reports are authored around the
  state dataset."* and *"Locked · Compare plots population in millions; other metrics are
  available in Bar, Line, and Map."* appears **in the DOM of Line Studio as well** (observed
  via `$B text`). It is presumably hidden by CSS when `preset != compare`, but it is present.

  - [ N] Intended? — _____ (this text is in every studio's DOM, not only Compare)

## Permutations

### P1 — Default (Region · Population)

URL: `/tools/studio?preset=line&dataset=region&metric=population&entities=East,West,North,South&from=1881&to=2011`
Screenshot: `screens/line-default.png`.

```
Canvas · Fig. L-01 · Regional trajectory · 1881 – 2011 · millions
  400 ┤                                                    ╭ North (hindi belt)
      │                                                ╭───╯
  300 ┤                                        ╭───────╯
      │                                ╭───────╯     ╭────── East
  200 ┤                        ╭───────╯       ╭─────╯ ╭──── South
      │                ╭───────╯       ╭───────╯   ╭───╯
  100 ┤        ╭───────╯       ╭───────╯   ╭───────╯─────── West
      │────────╯───────────────╯───────────╯
    0 └────────────────────────────────────────────────────
      1881      1911      1941      1971      2001  2011
```

### P2 — Switch dataset to State while staying on Line

Expected URL: `/tools/studio?preset=line&dataset=state&metric=population&entities=…&from=1881&to=2011`.
The entities list changes from 4 regions to whichever states are selected. Chip count changes
don't clear the time range.

- [ N] Intended? — _____ (switching dataset mid-Line preserves `from/to` but replaces `entities` — does it pick sensible defaults?)

### P3 — Switch metric to "Indexed · 1901 = 100"

The canvas's Y-axis relabels to `idx`. 1901 = 100 on all selected lines; 1881 and 1891 are
extrapolated backward from there.

- [ N] Intended? — _____ (Indexed with from=1881 shows below-100 values — correct for 1881 being pre-1901 baseline)

## ASCII flow diagram

```
  user opens /tools/studio?preset=line
          │
          ▼
  DEFAULT URL POPULATED
  dataset=region · metric=population
  entities=4 regions · from=1881 · to=2011
          │
          ▼
  ┌───────────────────────────────┐
  │ SIDEBAR (same as Bar):        │
  │   §01-§05 → URL rewrite       │
  │                               │
  │ CANVAS LEGEND:                │
  │   click "East" pill           │──► toggle East visibility
  │   (not in URL)                │    (CSS-only? needs verification)
  └───────────────────────────────┘
          │
          ▼
  CANVAS re-renders
  (Fig. L-01 lines redraw; hidden lines fade out)
```

## URL state map

Identical to Bar (see [bar.md § URL state map](bar.md#url-state-map)).

Differences in defaults:

| Param | Bar default | Line default |
|-------|-------------|--------------|
| `dataset` | `state` | `region` |
| `entities` | `UP,MH,BR,WB,AP,MP,TN,RJ` | `East,West,North,South` |
| `from` | `2011` | `1881` |
| `to` | `2011` | `2011` |

- [ ] Intended? — _____ (Line entity `North` label on canvas expands to "North (Hindi belt)" but chip shows just "North" — deliberate?)

## Known issues

Populated from Phase 2 — see `qa-report.md`:

- [ISSUE-001](qa-report.md#issue-001--locked-help-copy-appears-in-the-dom-of-every-studio) — Locked copy leaks from Compare into Line Studio DOM.
- [ISSUE-007](qa-report.md#issue-007--url-param-order-varies-between-loads-of-the-same-preset) — URL param order varies between loads.

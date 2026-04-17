# Workshop — deferred scope

Items deliberately deferred from the current three-phase plan (rev 2, 2026-04-17).
Each has a trigger condition — when it becomes worth revisiting. See
`/Users/chinmay/.claude/plans/i-have-answered-the-stateful-hennessy.md` for the
live plan.

## Phase 3 revisit (decide with real data + user feedback in hand)

### Cross-dataset Compare overlay (Sheet E)

- **What:** Overlay 2+ datasets on the same Compare canvas (e.g. UP population vs UP
  literacy vs UP railway stations over time).
- **Why deferred:** highest UX risk (dual y-axes, different time axes, color coding).
  Decide which pairs to overlay first with the real data landed.
- **Pros:** This is the narrative move the pivot enables — multi-dataset comparison
  is genuinely new territory for India-focused interactives.
- **Cons:** Needs a dual-axis rendering strategy and a snap-to-coarsest rule when
  time axes differ.
- **Effort:** L (~2-3 weeks with CC+gstack).
- **Priority:** P2 (not blocking Phase 1 or Phase 2).
- **Trigger:** 4+ datasets landed + one concrete "UP vs …" story Chinmay wants to tell.
- **Context:** Deferred in `/plan-ceo-review` rev 2 selective-expansion cherry-pick.

### Tilegram mode for Map Studio

- **What:** One-tile-per-constituency alternate choropleth to prevent big-area /
  low-population regions (Ladakh, Arunachal) from visually dominating while
  dense cities vanish. Based on `mustafasaifee42/India-Constituencies-TiIegram`.
- **Why deferred:** best decided with real LS / district GeoJSON visible — the
  visual-dominance problem is only felt when you can see it.
- **Effort:** M (~1 week).
- **Priority:** P2.
- **Trigger:** after district + LS GeoJSON land in Phase 1 and Chinmay eyeballs
  the Map canvas at those grains.

### Outlier detector ("show me anything weird")

- **What:** One-click button per studio highlights entities with z-score > 2 or
  decadal delta > 2σ on the current (dataset, metric, year) selection.
- **Why deferred:** need real heterogeneity (3+ datasets) to calibrate what
  counts as interesting vs noise.
- **Effort:** S-M (~3-5 days).
- **Priority:** P3.
- **Trigger:** Phase 2 stable + 3 datasets committed.

## Phase 4+ scope (trigger = concrete demand)

### Vidhan Sabha GeoJSON (28 per-state files)

- **What:** State-assembly-constituency boundaries for each state, lazy-loaded
  per state. From DataMeet (ECI KML → JSON).
- **Why deferred:** 28 files × per-state loading is operationally complex. Rarely
  needed on a census-overview site. Genuinely new product direction (state-politics
  lens).
- **Effort:** L (3-4 weeks including per-state attribution, lazy-load UI, a
  "pick a state to see its VS" flow).
- **Priority:** P3.
- **Trigger:** a concrete state-politics essay to accompany it, or a reader request.

### More ministry datasets beyond Phase 1's initial 2

- **What:** Open-ended. Data.gov.in has thousands; pick based on essay
  narratives.
- **Why deferred:** don't pre-commit to datasets without a story for them.
- **Effort:** S per dataset (after the ingest pipeline is built in Phase 1).
- **Priority:** varies.
- **Trigger:** specific narrative need (an essay chapter, a social post, etc.).

### `registerStudio()` pluggability (5th+ studio)

- **What:** A 4th registry alongside `registerDataset` and `registerLayer` so
  adding a Sankey / stream-graph / etc studio is additive, not a 7-file refactor.
- **Why deferred:** no 5th studio has been named yet; premature abstraction
  risk echoes the original CEO critique.
- **Effort:** M (~1 week, once the 5th studio's needs are known).
- **Priority:** P3.
- **Trigger:** a concrete 5th-studio need.

## Unresolved gates (track through implementation)

### Bar race rank-interpolation strategy

- **What:** Custom CSS-transform bar renderer vs pre-computed smoothed rank curve.
  Phase 3b ship gate (Decision #9 in the plan).
- **Why open:** ApexCharts `dynamicAnimation` will teleport bars on overtake.
  That's visually broken. Either solve cleanly or cut the Bar race.
- **Effort:** M (1-2 weeks) if solving; S (half-day) if cutting.
- **Priority:** P1 (blocks Phase 3b).
- **Trigger:** start of Phase 3b.

### Audience / traffic instrumentation

- **What:** Add basic analytics (Plausible / self-hosted Umami) to see whether
  the Workshop gets readership proportional to its investment. Flagged as
  CEO-review "no datapoint" concern.
- **Why open:** The rev-1 CEO critique — "9-17 weeks without a single traffic
  datapoint" — was answered by the pivot (the pivot makes the Workshop more
  defensible on its own terms), not by actually collecting data.
- **Effort:** S (half-day for Plausible drop-in).
- **Priority:** P2 (nice to have before Phase 3 animation investment).
- **Trigger:** before Phase 3 animation work ships, so the Phase-3 investment
  has a real baseline to measure against.

## How to add to this list

New TODO = one section with:
- **What** (one sentence)
- **Why deferred** (the reason it's not in current phase)
- **Effort** (S/M/L/XL with CC+gstack)
- **Priority** (P1/P2/P3)
- **Trigger** (the condition that unlocks it)
- **Context** (link to the decision that deferred it)

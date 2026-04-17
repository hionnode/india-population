// Metric dispatchers — map (dataset × metric × entities × year) → chart data.
// Shared by BarStudio / LineStudio / MapStudio / CompareStudio.

import {
  CENSUS,
  REGION_COLORS,
  REGION_LABELS,
  REGION_ORDER,
  decadalGrowth,
  percentShare,
  type Region,
} from '../data/census';
import {
  STATE_CENSUS,
  STATE_CENSUS_YEARS,
  indexedAt1901,
  percentGrowth,
  valueAt,
} from '../data/state-census';
import { LOKSABHA_DATA } from '../data/loksabha';
import type { StudioState } from './studio';

export interface BarPoint {
  code: string;
  label: string;
  labelHi?: string;
  value: number;
  color: string;
  unit: string;
}

export interface LinePoint {
  year: number;
  v: number;
}

export interface LineSeries {
  code: string;
  label: string;
  labelHi?: string;
  color: string;
  points: LinePoint[];
  unit: string;
}

// ——————————————————————————————————————————————
// BAR — one value per selected entity at state.to
// ——————————————————————————————————————————————
//
// NaN-throw audit (Phase 1 Commit 2 of the rev-2b plan):
// The three private *MetricValue dispatchers currently return NaN for invalid
// (dataset × metric) combos. All three barSeries branches filter via
// Number.isFinite to prevent NaN bars from reaching the canvas. Phase 2 will
// replace NaN returns with throws + a compatibility-matrix pre-check; when
// that lands, wrap these dispatchers in try/catch and emit an error worksheet
// instead of silently filtering.
//   see: /Users/chinmay/.claude/plans/i-have-answered-the-stateful-hennessy.md
//        Decisions #4 (vitest), #5 (caller audit), Phase 2 compatibility.ts

export function barSeries(state: StudioState): BarPoint[] {
  const year = state.to;
  const metric = state.metric;

  if (state.dataset === 'region') {
    return REGION_ORDER.filter((r) => state.entities.includes(r))
      .map((r) => ({
        code: r,
        label: REGION_LABELS[r].en,
        labelHi: REGION_LABELS[r].hi,
        value: regionMetricValue(r, state),
        color: REGION_COLORS[r],
        unit: unitFor(metric),
      }))
      .filter((p) => Number.isFinite(p.value))
      .sort((a, b) => b.value - a.value);
  }

  if (state.dataset === 'state') {
    return STATE_CENSUS
      .filter((r) => state.entities.includes(r.code))
      .map((r) => ({
        code: r.code,
        label: r.name,
        labelHi: r.nameHi,
        value: stateMetricValue(r, state),
        color: REGION_COLORS[r.region],
        unit: unitFor(metric),
      }))
      .filter((p) => Number.isFinite(p.value))
      .sort((a, b) => b.value - a.value);
  }

  // loksabha
  return LOKSABHA_DATA
    .filter((r) => state.entities.length === 0 || state.entities.includes(r.code))
    .map((r) => ({
      code: r.code,
      label: r.name,
      labelHi: r.nameHi,
      value: loksabhaMetricValue(r, metric),
      color: REGION_COLORS[r.region],
      unit: unitFor(metric),
    }))
    .filter((p) => Number.isFinite(p.value))
    .sort((a, b) => b.value - a.value);
}

// ——————————————————————————————————————————————
// LINE — one series per entity across [state.from, state.to]
// ——————————————————————————————————————————————

// Line series are NaN-tolerant by renderer contract: ApexCharts draws gaps for
// null/NaN values and the per-point helpers (region/stateLinePoints) already
// only emit points for years that exist in the underlying dataset. The
// loksabha branch below passes through loksabhaMetricValue's NaN for
// growthPct/indexed1901 (no time series); ApexCharts renders that as no point.
// Phase 2 NaN-throw audit wraps the private dispatcher calls in try/catch.
export function lineSeries(state: StudioState): LineSeries[] {
  if (state.dataset === 'region') {
    return REGION_ORDER.filter((r) => state.entities.includes(r)).map((r) => ({
      code: r,
      label: REGION_LABELS[r].en,
      labelHi: REGION_LABELS[r].hi,
      color: REGION_COLORS[r],
      points: regionLinePoints(r, state),
      unit: unitFor(state.metric),
    }));
  }

  if (state.dataset === 'state') {
    return STATE_CENSUS
      .filter((r) => state.entities.includes(r.code))
      .map((row) => ({
        code: row.code,
        label: row.name,
        labelHi: row.nameHi,
        color: REGION_COLORS[row.region],
        points: stateLinePoints(row, state),
        unit: unitFor(state.metric),
      }));
  }

  // loksabha has no time series — only 2011
  return LOKSABHA_DATA
    .filter((r) => state.entities.includes(r.code))
    .map((r) => ({
      code: r.code,
      label: r.name,
      labelHi: r.nameHi,
      color: REGION_COLORS[r.region],
      points: [{ year: 2011, v: loksabhaMetricValue(r, state.metric) }],
      unit: unitFor(state.metric),
    }));
}

// ——————————————————————————————————————————————
// MAP — one value per loksabha state code at state.to
// ——————————————————————————————————————————————

// Map values skip entries with non-finite values so the choropleth doesn't
// inherit NaN-tinted fills. Phase 2 NaN-throw audit will pre-check via
// isMetricAvailable(dataset, metric) before calling into the dispatcher;
// the filter here becomes belt-and-suspenders once that lands.
export function mapValues(state: StudioState): Map<string, { value: number; color: string; name: string; nameHi: string; region: Region }> {
  const out = new Map<string, { value: number; color: string; name: string; nameHi: string; region: Region }>();
  for (const r of LOKSABHA_DATA) {
    const v = loksabhaMetricValue(r, state.metric);
    if (!Number.isFinite(v)) continue;
    out.set(r.code, {
      value: v,
      color: REGION_COLORS[r.region],
      name: r.name,
      nameHi: r.nameHi,
      region: r.region,
    });
  }
  return out;
}

// ——————————————————————————————————————————————
// Internal dispatchers
// ——————————————————————————————————————————————

function regionMetricValue(r: Region, state: StudioState): number {
  const row = CENSUS.find((c) => c.year === state.to);
  if (!row) return NaN;
  switch (state.metric) {
    case 'population':   return row.regions[r];
    case 'growthPct':    return percentShare(row, r);  // fallback — no meaningful single-value growth at region level
    case 'indexed1901':  {
      const base = CENSUS.find((c) => c.year === 1901)?.regions[r] ?? NaN;
      return (row.regions[r] / base) * 100;
    }
    case 'popPerSeat':
    case 'seats':
    case 'scenario2Delta':
      return NaN;
  }
}

function stateMetricValue(row: (typeof STATE_CENSUS)[number], state: StudioState): number {
  switch (state.metric) {
    case 'population': return valueAt(row, state.to);
    case 'growthPct':  return percentGrowth(row, state.from, state.to);
    case 'indexed1901': {
      const base = row.values[1901];
      return (valueAt(row, state.to) / base) * 100;
    }
    case 'popPerSeat':
    case 'seats':
    case 'scenario2Delta':
      return NaN;
  }
}

function loksabhaMetricValue(r: (typeof LOKSABHA_DATA)[number], metric: StudioState['metric']): number {
  switch (metric) {
    case 'population':     return r.population2011 / 1_000_000;
    case 'popPerSeat':     return r.popPerSeat / 100_000;
    case 'seats':          return r.currentSeats;
    case 'scenario2Delta': return r.scenario2Delta;
    default:               return NaN;
  }
}

function regionLinePoints(r: Region, state: StudioState): LinePoint[] {
  const inRange = CENSUS.filter((c) => c.year >= state.from && c.year <= state.to);
  if (state.metric === 'growthPct') {
    return decadalGrowth(r)
      .filter((p) => p.year >= state.from && p.year <= state.to)
      .map((p) => ({ year: p.year, v: p.pct }));
  }
  if (state.metric === 'indexed1901') {
    const base = CENSUS.find((c) => c.year === 1901)?.regions[r] ?? NaN;
    return inRange.map((c) => ({ year: c.year, v: (c.regions[r] / base) * 100 }));
  }
  return inRange.map((c) => ({ year: c.year, v: c.regions[r] }));
}

function stateLinePoints(row: (typeof STATE_CENSUS)[number], state: StudioState): LinePoint[] {
  const years = STATE_CENSUS_YEARS.filter((y) => y >= state.from && y <= state.to);
  if (state.metric === 'indexed1901') {
    const base = row.values[1901];
    return years.map((y) => ({ year: y, v: (row.values[y] / base) * 100 }));
  }
  if (state.metric === 'growthPct') {
    // decadal growth — skip first year
    return years.slice(1).map((y, i) => {
      const prev = years[i];
      const pct = ((row.values[y] - row.values[prev]) / row.values[prev]) * 100;
      return { year: y, v: pct };
    });
  }
  return years.map((y) => ({ year: y, v: row.values[y] }));
}

export function unitFor(metric: StudioState['metric']): string {
  switch (metric) {
    case 'population':     return 'millions';
    case 'growthPct':      return '% per decade';
    case 'indexed1901':    return 'index · 1901 = 100';
    case 'popPerSeat':     return 'lakh / seat';
    case 'seats':          return 'seats';
    case 'scenario2Delta': return 'seat Δ (Scenario 2)';
  }
}

// ——————————————————————————————————————————————
// Entity catalog — for the "+ add" picker
// ——————————————————————————————————————————————

export interface EntityEntry {
  code: string;
  label: string;
  labelHi?: string;
  color: string;
}

export function entityCatalog(dataset: StudioState['dataset']): EntityEntry[] {
  if (dataset === 'region') {
    return REGION_ORDER.map((r) => ({
      code: r,
      label: REGION_LABELS[r].en,
      labelHi: REGION_LABELS[r].hi,
      color: REGION_COLORS[r],
    }));
  }
  if (dataset === 'state') {
    return STATE_CENSUS.map((r) => ({
      code: r.code,
      label: r.name,
      labelHi: r.nameHi,
      color: REGION_COLORS[r.region],
    }));
  }
  return LOKSABHA_DATA.map((r) => ({
    code: r.code,
    label: r.name,
    labelHi: r.nameHi,
    color: REGION_COLORS[r.region],
  }));
}

export function metricLabel(metric: StudioState['metric']): string {
  switch (metric) {
    case 'population':     return 'Population';
    case 'growthPct':      return 'Decadal growth';
    case 'indexed1901':    return 'Indexed population';
    case 'popPerSeat':     return 'Population per seat';
    case 'seats':          return 'Current seats';
    case 'scenario2Delta': return 'Scenario 2 seat change';
  }
}

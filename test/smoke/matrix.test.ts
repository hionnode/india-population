import { describe, it, expect } from 'vitest';
import { barSeries, entityCatalog, unitFor } from '../../src/scripts/metrics';
import type { StudioState } from '../../src/scripts/studio';

const base: StudioState = {
  preset: 'bar',
  dataset: 'state',
  metric: 'population',
  entities: ['UP', 'MH', 'BR'],
  from: 2011,
  to: 2011,
};

describe('Workshop compatibility matrix — smoke', () => {
  it('entityCatalog(region) returns 4 visible region entries', () => {
    const rows = entityCatalog('region');
    expect(rows.length).toBeGreaterThanOrEqual(4);
    const codes = rows.map((r) => r.code);
    for (const expected of ['East', 'West', 'North', 'South']) {
      expect(codes).toContain(expected);
    }
  });

  it('entityCatalog(state) returns the pre-pivot 18 major-state rows', () => {
    const rows = entityCatalog('state');
    expect(rows.length).toBe(18);
    const codes = rows.map((r) => r.code);
    for (const expected of ['UP', 'MH', 'BR', 'WB', 'TN', 'KL']) {
      expect(codes).toContain(expected);
    }
  });

  it('entityCatalog(loksabha) returns 36 state/UT rows', () => {
    const rows = entityCatalog('loksabha');
    expect(rows.length).toBe(36);
  });

  it('barSeries(state + population + 2011) returns finite values for selected entities', () => {
    const out = barSeries({ ...base });
    expect(out.length).toBe(3);
    for (const p of out) {
      expect(Number.isFinite(p.value)).toBe(true);
      expect(p.value).toBeGreaterThan(0);
      expect(p.unit).toBe(unitFor('population'));
    }
  });

  it('barSeries(region + seats) leaks NaN values — motivates Phase-1 Commit 2 audit', () => {
    // Documents an asymmetry the Phase-1 NaN-throw-audit must fix:
    // - barSeries(state + seats)    → .filter(Number.isFinite) drops NaN silently (empty array).
    // - barSeries(loksabha + growthPct) → same filter.
    // - barSeries(region + seats)   → NO filter; returns bar points WITH NaN values that reach the canvas.
    //
    // After Commit 2 lands (try/catch + error worksheet), this test should flip to
    // expect either a thrown error OR a shaped empty-with-warning result.
    const regionState: StudioState = {
      ...base,
      dataset: 'region',
      metric: 'seats',
      entities: ['East', 'West', 'North', 'South'],
    };
    const out = barSeries(regionState);
    expect(out.length).toBe(4);
    for (const p of out) {
      expect(Number.isNaN(p.value)).toBe(true);
    }
  });
});

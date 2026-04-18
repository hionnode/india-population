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

  it('entityCatalog(state) returns all 36 states + UTs (post-Commit-12 backfill)', () => {
    const rows = entityCatalog('state');
    expect(rows.length).toBe(36);
    const codes = rows.map((r) => r.code);
    // 18 majors (pre-pivot) still present:
    for (const expected of ['UP', 'MH', 'BR', 'WB', 'TN', 'KL', 'AP']) {
      expect(codes).toContain(expected);
    }
    // Telangana split off from AP in Commit 12:
    expect(codes).toContain('TS');
    // A few representatives from the 17 newly added rows:
    for (const expected of ['AS', 'PB', 'JK', 'LA', 'GA', 'MN', 'SK']) {
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

  it('barSeries(region + incompatible metric) drops NaN bars — all three dataset branches filter consistently', () => {
    // Post-Commit-2: all three barSeries branches (region/state/loksabha)
    // apply .filter(Number.isFinite). Before Commit 2 the region branch
    // skipped the filter and leaked NaN bars to the canvas.
    //
    // Phase 2 will replace NaN returns from *MetricValue with throws
    // pre-checked by isMetricAvailable(dataset, metric). When that lands,
    // this test should flip to expect a thrown error OR a shaped
    // empty-with-warning result.
    const regionState: StudioState = {
      ...base,
      dataset: 'region',
      metric: 'seats',
      entities: ['East', 'West', 'North', 'South'],
    };
    const out = barSeries(regionState);
    expect(out.length).toBe(0);
  });
});

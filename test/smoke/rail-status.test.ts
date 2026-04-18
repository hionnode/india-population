import { describe, it, expect } from 'vitest';
import {
  computeRailState,
  railStatusBounds,
  railStatusMessage,
} from '../../src/scripts/studio';
import type { StudioState } from '../../src/scripts/studio';

// Guards ISSUE-003 (RailStatus component state machine). The pure helpers
// that feed the Astro component + client renderer are the test surface;
// DOM rendering is covered by the visual walk during Phase-1 verification.

const base: StudioState = {
  preset: 'bar',
  dataset: 'state',
  metric: 'population',
  entities: [],
  from: 2011,
  to: 2011,
};

describe('railStatusBounds — per-dataset caps + per-preset minimums', () => {
  it('Bar · state dataset: min 0, max 36 (post-backfill)', () => {
    const b = railStatusBounds({ ...base, preset: 'bar', dataset: 'state' });
    expect(b).toEqual({ min: 0, max: 36 });
  });
  it('Bar · region dataset: min 0, max 5 (four regions + Other)', () => {
    const b = railStatusBounds({ ...base, preset: 'bar', dataset: 'region' });
    expect(b).toEqual({ min: 0, max: 5 });
  });
  it('Bar · loksabha dataset: min 0, max 36', () => {
    const b = railStatusBounds({ ...base, preset: 'bar', dataset: 'loksabha' });
    expect(b).toEqual({ min: 0, max: 36 });
  });
  it('Compare: min 2, max 6 (teaching surface — refuses to render under 2)', () => {
    const b = railStatusBounds({ ...base, preset: 'compare', dataset: 'state' });
    expect(b).toEqual({ min: 2, max: 6 });
  });
});

describe('computeRailState — named lifecycle states', () => {
  it('0 of 6 → zero', () => {
    expect(computeRailState(0, 2, 6)).toBe('zero');
  });
  it('1 of 6 (under Compare min of 2) → under-min', () => {
    expect(computeRailState(1, 2, 6)).toBe('under-min');
  });
  it('3 of 6 → ok', () => {
    expect(computeRailState(3, 2, 6)).toBe('ok');
  });
  it('5 of 6 (one slot left) → approaching-max', () => {
    expect(computeRailState(5, 2, 6)).toBe('approaching-max');
  });
  it('6 of 6 → at-max', () => {
    expect(computeRailState(6, 2, 6)).toBe('at-max');
  });
  it('overflow (7 of 6, defensive) still reads as at-max, not some 6th state', () => {
    expect(computeRailState(7, 2, 6)).toBe('at-max');
  });
});

describe('railStatusMessage — the copy the user reads in the pill', () => {
  it('zero with min=0 suggests picking one', () => {
    expect(railStatusMessage('zero', 0, 36)).toBe('pick one');
  });
  it('zero with min=2 (Compare) asks for at least 2', () => {
    expect(railStatusMessage('zero', 2, 6)).toBe('pick at least 2');
  });
  it('under-min reminds the reader how many the chart needs', () => {
    expect(railStatusMessage('under-min', 2, 6)).toBe('need 2+ to render');
  });
  it('ok is empty — no teaching copy in the steady state', () => {
    expect(railStatusMessage('ok', 0, 36)).toBe('');
  });
  it('approaching-max hints that adds are about to stop', () => {
    expect(railStatusMessage('approaching-max', 2, 6)).toBe('near cap');
  });
  it('at-max surfaces the exact cap number', () => {
    expect(railStatusMessage('at-max', 2, 6)).toBe('cap · 6');
  });
});

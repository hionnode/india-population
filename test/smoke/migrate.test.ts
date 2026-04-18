import { describe, it, expect } from 'vitest';
import { migrateStateForPatch } from '../../src/scripts/studio';
import type { StudioState } from '../../src/scripts/studio';

// Guards ISSUE-004 — the three invariants migrateStateForPatch has to
// enforce on every user-originated patch:
//   (1) preset=compare → dataset=state, metric=population (reseed on entry)
//   (2) dataset flip outside compare → entity space changes, reseed
//   (3) cap-trim: if the merged state's max is below current count, trim
// And it has to name the dropped entities so the caller can show an Undo
// toast with the right list.

const bar36: StudioState = {
  preset: 'bar',
  dataset: 'state',
  metric: 'population',
  entities: ['UP', 'MH', 'BR', 'WB', 'TN', 'KL', 'RJ', 'AP', 'GJ'],
  from: 2011,
  to: 2011,
};

describe('migrateStateForPatch — invariant 1 (Compare locks dataset+metric)', () => {
  it('bar · region · seats → compare: drops every region entity + reseeds with compare defaults', () => {
    const prev: StudioState = {
      preset: 'bar',
      dataset: 'region',
      metric: 'seats',
      entities: ['East', 'West', 'North', 'South'],
      from: 2011,
      to: 2011,
    };
    const { next, dropped } = migrateStateForPatch(prev, { preset: 'compare' });
    expect(next.preset).toBe('compare');
    expect(next.dataset).toBe('state');
    expect(next.metric).toBe('population');
    expect(next.entities).toEqual(['UP', 'KL', 'MH']);
    expect(dropped.sort()).toEqual(['East', 'North', 'South', 'West']);
  });

  it('bar · state · growthPct → compare: keeps entities (within state space), forces metric', () => {
    const prev: StudioState = {
      preset: 'bar',
      dataset: 'state',
      metric: 'growthPct',
      entities: ['UP', 'KL', 'MH'],
      from: 1901,
      to: 2011,
    };
    const { next, dropped } = migrateStateForPatch(prev, { preset: 'compare' });
    expect(next.metric).toBe('population');
    expect(next.entities).toEqual(['UP', 'KL', 'MH']);
    expect(dropped).toEqual([]);
  });
});

describe('migrateStateForPatch — invariant 2 (non-compare dataset flip reseeds entities)', () => {
  it('bar · state · [UP,MH,BR] → bar · region: drops BR/MH/UP, seeds E/W/N/S', () => {
    const prev: StudioState = {
      preset: 'bar',
      dataset: 'state',
      metric: 'population',
      entities: ['UP', 'MH', 'BR'],
      from: 2011,
      to: 2011,
    };
    const { next, dropped } = migrateStateForPatch(prev, { dataset: 'region' });
    expect(next.dataset).toBe('region');
    expect(next.entities).toEqual(['East', 'West', 'North', 'South']);
    expect(dropped.sort()).toEqual(['BR', 'MH', 'UP']);
  });

  it('same-dataset metric flip is a no-op for entities', () => {
    const prev: StudioState = {
      preset: 'bar',
      dataset: 'state',
      metric: 'population',
      entities: ['UP', 'MH'],
      from: 2011,
      to: 2011,
    };
    const { next, dropped } = migrateStateForPatch(prev, { metric: 'growthPct' });
    expect(next.entities).toEqual(['UP', 'MH']);
    expect(dropped).toEqual([]);
  });
});

describe('migrateStateForPatch — invariant 3 (cap-trim overflow)', () => {
  it('bar (cap 36) → compare (cap 6) with 9 state entities trims to first 6 + names the 3 dropped', () => {
    const { next, dropped } = migrateStateForPatch(bar36, { preset: 'compare' });
    expect(next.preset).toBe('compare');
    expect(next.entities.length).toBe(6);
    expect(next.entities).toEqual(['UP', 'MH', 'BR', 'WB', 'TN', 'KL']);
    expect(dropped.sort()).toEqual(['AP', 'GJ', 'RJ']);
  });
});

describe('migrateStateForPatch — Undo round-trip (store replay)', () => {
  it('applying the migrated patch then s.patch(prev) restores the full previous state', () => {
    // Simulates the Undo flow: the migration produces `next`, caller toasts,
    // user clicks Undo → store.patch(prev) restores. Here we simply assert
    // prev is structurally preserved from before migration so the caller
    // can rely on it as the restore target.
    const prev = { ...bar36, entities: [...bar36.entities] };
    const { next } = migrateStateForPatch(prev, { preset: 'compare' });
    expect(next).not.toEqual(prev);
    // prev hasn't been mutated — caller holds a clean restore target.
    expect(prev.entities).toEqual(bar36.entities);
    expect(prev.preset).toBe('bar');
  });
});

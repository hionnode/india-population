import type { DatasetMeta } from '../scripts/registry-types';

/**
 * Lok Sabha seat allocation by state/UT (36 units), 2011 snapshot.
 * No time series — single-year data. Supports seat-allocation metrics
 * (popPerSeat, seats, scenario2Delta) that the other two datasets don't.
 */
export const loksabhaMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'loksabha',
  label: 'Lok Sabha · 36 rows',
  description:
    "Lok Sabha seat allocation by state/UT as of the 2011 census snapshot. Covers 36 units (28 states + 8 UTs). Includes current seats, per-seat population, and hypothetical reallocation scenarios (Scenario 2 = one-seat-per-1.42M-population with a 1-seat minimum).",
  source: {
    url: 'https://loksabha.nic.in/',
    license: 'Government of India — reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Combined 2011 census population totals per state with current Lok Sabha seat allocation.',
      'Derived Scenario 2 via one-seat-per-~1.42M target with a 1-seat minimum for tiny UTs.',
      'J&K/Ladakh reflects post-2019 reorganization (two separate UTs).',
    ],
  },
  timeAxis: {
    kind: 'custom',
    ticks: [2011],
    format: (n) => String(n),
  },
  units: {
    population: 'mn',
    popPerSeat: 'lakh/seat',
    seats: 'seats',
    scenario2Delta: '±',
  },
  compatibleMetrics: ['population', 'popPerSeat', 'seats', 'scenario2Delta'],
};

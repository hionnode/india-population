import type { DatasetMeta } from '../scripts/registry-types';

/**
 * State-level census dataset (18 major states, pre-pivot; 36 states + UTs post-Phase-1 backfill).
 * Decadal 1901-2011. Telangana will split from AP in Phase 1 Commit 10.
 */
export const stateCensusMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'state-census',
  label: 'State · 18 rows',
  description:
    "Decadal state-level populations, India, 1901-2011. Current version covers 18 major states; Phase 1 Commit 10 expands to 36 (all states + UTs).",
  source: {
    url: 'https://censusindia.gov.in/nada/index.php/catalog/43333',
    license: 'Government of India — reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Telangana merged into AP for time-series consistency across 1901-2011 (will split in Commit 10).',
      'Dadra-Nagar-Haveli + Daman-Diu rendered as one UT (post-2020 Union merger).',
      'J&K reflects India\'s official boundary claim (PoK included; Aksai Chin in Ladakh).',
    ],
  },
  timeAxis: {
    kind: 'decadal',
    ticks: [1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011],
  },
  units: {
    population: 'mn',
    growthPct: '%',
    indexed1901: 'idx',
  },
  compatibleMetrics: ['population', 'growthPct', 'indexed1901'],
};

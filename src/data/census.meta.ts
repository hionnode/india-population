import type { DatasetMeta } from '../scripts/registry-types';

/**
 * Region-level census dataset (5 regional groupings).
 * Decadal 1881-2011; 1881 and 1891 reconstructed from British-India totals.
 */
export const censusMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'census',
  label: 'Region · 5 rows',
  description:
    "Decadal regional populations (East, West, North, South, Other) for the modern boundaries of India, 1881-2011. Pre-1901 values are reconstructed from British-India totals.",
  source: {
    url: 'https://censusindia.gov.in/nada/index.php/catalog/43333', // Census of India, Table A-02
    license: 'Government of India — reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Rolled up state-level totals to region groupings (East/West/North/South/Other).',
      '1881 + 1891 values scaled back from British-India-Empire totals and adjusted to modern boundaries.',
    ],
  },
  timeAxis: {
    kind: 'decadal',
    ticks: [1881, 1891, 1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011],
  },
  units: {
    population: 'mn',
    growthPct: '%',
    indexed1901: 'idx',
  },
  compatibleMetrics: ['population', 'growthPct', 'indexed1901'],
};

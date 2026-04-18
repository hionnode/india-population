import type { DatasetMeta } from '../scripts/registry-types';

/**
 * State-level census dataset — all 36 modern states + UTs, decadal 1901-2011.
 * Telangana is split from AP; Ladakh is split from J&K from 2001 onward.
 */
export const stateCensusMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'state-census',
  label: 'State · 36 rows',
  description:
    "Decadal state-level populations, India, 1901-2011. Covers all 28 states + 8 Union Territories at their post-2019 boundaries.",
  source: {
    url: 'https://censusindia.gov.in/nada/index.php/catalog/43333',
    license: 'Government of India — reproduced for educational purposes',
    refreshed: '2026-04-18',
    transformations: [
      'Telangana split from Andhra Pradesh using the 2011 district ratio (TS 35.19M / combined 84.58M = 0.41607) applied backward across all census years.',
      'Ladakh shown separately from 2001 (sum of Leh + Kargil district populations); pre-2001 Ladakh figures remain within the J&K totals as reported by A-02.',
      'Dadra-Nagar-Haveli + Daman-Diu rendered as one combined UT row (post-2020 Union merger).',
      'Assam 1981 census was not conducted (Assam agitation); J&K 1991 census was not conducted (militancy); those cells are omitted.',
      'Goa pre-1961 and Arunachal/Chandigarh/Puducherry/DN pre-existence years are omitted rather than backfilled.',
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

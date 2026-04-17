import type { DatasetMeta } from '../scripts/registry-types';
import { ELECTRICITY_YEARS } from './electricity';

export const electricityMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'electricity',
  label: 'Electricity · 20 states',
  description:
    'State-wise per-capita electricity consumption, kWh, fiscal years 2017-18 through 2020-21. 2020-21 reflects COVID-19 lockdown dip. Source: CEA General Review (Ministry of Power).',
  source: {
    url: 'https://cea.nic.in/general-review-report/?lang=en',
    license: 'Government of India — CEA publication, reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Hand-curated from CEA "General Review" state-level tables (latest editions); order-of-magnitude accurate.',
      'Covers 20 major states; NE and small UTs pending full ingest.',
      'Fiscal years indexed by starting year (e.g. 2020 = FY 2020-21).',
    ],
  },
  timeAxis: {
    kind: 'annual',
    ticks: [...ELECTRICITY_YEARS],
    format: (n) => `${n}-${String((n + 1) % 100).padStart(2, '0')}`,
  },
  units: {
    per_capita_kwh: 'kWh',
    growth_pct: '%',
  },
  compatibleMetrics: ['per_capita_kwh', 'growth_pct'],
};

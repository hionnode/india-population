import type { DatasetMeta } from '../scripts/registry-types';
import { GDP_YEARS } from './gdp';

export const gdpMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'gdp',
  label: 'GSDP · 20 states',
  description:
    'State-wise Gross State Domestic Product at constant 2011-12 prices, fiscal years 2015-16 through 2019-20. Pre-pandemic window. Source: RBI Handbook of Statistics on Indian States 2021-22.',
  source: {
    url: 'https://m.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States',
    license: 'Government of India — RBI Handbook, reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Hand-curated from the RBI Handbook published Excel; rounded to the nearest ₹1,000 crore.',
      'Covers 20 major states; all other states/UTs pending full ingest.',
      'Pre-pandemic window (FY 2015-16 to FY 2019-20) to avoid 2020-21 COVID distortion.',
    ],
  },
  timeAxis: {
    kind: 'annual',
    ticks: [...GDP_YEARS],
    format: (n) => `${n}-${String((n + 1) % 100).padStart(2, '0')}`, // 2015-16 style
  },
  units: {
    gsdp_constant: '₹ cr',
    gsdp_growth: '%',
  },
  compatibleMetrics: ['gsdp_constant', 'gsdp_growth'],
};

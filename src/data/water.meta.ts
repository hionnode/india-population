import type { DatasetMeta } from '../scripts/registry-types';
import { WATER_YEARS } from './water';

export const waterMeta: DatasetMeta = {
  schemaVersion: 1,
  id: 'water',
  label: 'Water CWMI · 25 states',
  description:
    'Composite Water Management Index (0-100) by state, baseline 2016-17 and reference year 2017-18. Evaluated across 28 KPIs spanning irrigation, drinking water, policy, and on-farm use. Source: NITI Aayog CWMI 2.0, August 2019.',
  source: {
    url: 'https://www.niti.gov.in/sites/default/files/2023-03/Composite%20Water%20Management%20Index%202.0.pdf',
    license: 'Government of India — NITI Aayog publication, reproduced for educational purposes',
    refreshed: '2026-04-17',
    transformations: [
      'Hand-curated from the Aug 2019 CWMI 2.0 report tables; scores rounded to whole integers.',
      '17 non-Himalayan + 8 NE/Himalayan states included (evaluated separately, same 0-100 scale).',
      'Only 2 years (2016-17 baseline + 2017-18 latest) published in the source.',
    ],
  },
  timeAxis: {
    kind: 'annual',
    ticks: [...WATER_YEARS],
    format: (n) => `${n}-${String((n + 1) % 100).padStart(2, '0')}`,
  },
  units: {
    cwmi_score: '/100',
    cwmi_delta: '±',
  },
  compatibleMetrics: ['cwmi_score', 'cwmi_delta'],
};

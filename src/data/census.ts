export type Region = 'East' | 'West' | 'North' | 'South' | 'Other';

export interface YearRow {
  year: number;
  estimated: boolean;
  totalIndiaMillions: number;
  regions: Record<Region, number>;
}

export const REGION_ORDER: Region[] = ['East', 'West', 'North', 'South', 'Other'];

export const REGION_LABELS: Record<Region, { en: string; hi: string; states: string }> = {
  East: { en: 'East', hi: 'पूर्व', states: 'West Bengal, Odisha' },
  West: { en: 'West', hi: 'पश्चिम', states: 'Gujarat, Maharashtra' },
  North: {
    en: 'North (Hindi belt)',
    hi: 'उत्तर',
    states: 'UP, Bihar, MP, Rajasthan, Haryana, HP, Uttarakhand, Jharkhand, Chhattisgarh, Delhi',
  },
  South: {
    en: 'South',
    hi: 'दक्षिण',
    states: 'Kerala, Karnataka, Tamil Nadu, Andhra Pradesh (incl. Telangana)',
  },
  Other: {
    en: 'Other',
    hi: 'अन्य',
    states: 'Assam + NE states, J&K, Ladakh, Punjab, Goa, Union Territories',
  },
};

export const REGION_COLORS: Record<Region, string> = {
  East: '#1f4d54',
  West: '#c88a2f',
  North: '#8c2e1a',
  South: '#3d5c3d',
  Other: '#7a6b55',
};

// Source: Census of India 2011, Table A-02 "Decadal Variation in Population 1901-2011"
// Office of the Registrar General & Census Commissioner, India.
// NADA catalog 43333: https://censusindia.gov.in/nada/index.php/catalog/43333
// Values already backfilled to post-2000 state boundaries (Jharkhand/Uttarakhand/
// Chhattisgarh split out from parent states in every year; AP includes Telangana).
// Pakistan and Bangladesh territory already excluded from 1941 and earlier totals.
//
// 1881 and 1891: NADA does not publish a modern-state backfill. Values are estimated
// by scaling 1901 regional shares by the 1881/1891 British-India-Empire totals
// (253.9M and 287.3M) adjusted to modern-India territory via the 1901 ratio
// (238.40M / 294.36M = 80.99%). These two rows are flagged estimated: true.
export const CENSUS: YearRow[] = [
  {
    year: 1881,
    estimated: true,
    totalIndiaMillions: 206.0,
    regions: { East: 23.5, West: 24.7, North: 95.5, South: 49.8, Other: 12.5 },
  },
  {
    year: 1891,
    estimated: true,
    totalIndiaMillions: 232.7,
    regions: { East: 26.6, West: 27.9, North: 107.4, South: 56.4, Other: 14.4 },
  },
  {
    year: 1901,
    estimated: false,
    totalIndiaMillions: 238.40,
    regions: { East: 27.24, West: 28.48, North: 110.04, South: 57.77, Other: 14.87 },
  },
  {
    year: 1911,
    estimated: false,
    totalIndiaMillions: 252.09,
    regions: { East: 29.38, West: 31.27, North: 113.37, South: 63.03, Other: 15.04 },
  },
  {
    year: 1921,
    estimated: false,
    totalIndiaMillions: 251.32,
    regions: { East: 28.63, West: 31.02, North: 110.95, South: 64.23, Other: 16.49 },
  },
  {
    year: 1931,
    estimated: false,
    totalIndiaMillions: 278.98,
    regions: { East: 31.39, West: 35.45, North: 121.47, South: 71.81, Other: 18.86 },
  },
  {
    year: 1941,
    estimated: false,
    totalIndiaMillions: 318.66,
    regions: { East: 37.00, West: 40.53, North: 138.00, South: 80.85, Other: 22.28 },
  },
  {
    year: 1951,
    estimated: false,
    totalIndiaMillions: 361.09,
    regions: { East: 40.95, West: 48.26, North: 153.85, South: 94.19, Other: 23.84 },
  },
  {
    year: 1961,
    estimated: false,
    totalIndiaMillions: 439.23,
    regions: { East: 52.48, West: 60.18, North: 185.79, South: 110.16, Other: 30.62 },
  },
  {
    year: 1971,
    estimated: false,
    totalIndiaMillions: 548.16,
    regions: { East: 66.25, West: 77.11, North: 229.70, South: 135.35, Other: 39.75 },
  },
  {
    year: 1981,
    estimated: false,
    totalIndiaMillions: 683.33,
    regions: { East: 80.95, West: 96.87, North: 290.64, South: 164.55, Other: 50.32 },
  },
  {
    year: 1991,
    estimated: false,
    totalIndiaMillions: 846.42,
    regions: { East: 99.74, West: 120.25, North: 366.72, South: 196.45, Other: 63.26 },
  },
  {
    year: 2001,
    estimated: false,
    totalIndiaMillions: 1028.74,
    regions: { East: 116.99, West: 147.55, North: 463.40, South: 223.31, Other: 77.49 },
  },
  {
    year: 2011,
    estimated: false,
    totalIndiaMillions: 1210.85,
    regions: { East: 133.25, West: 172.81, North: 562.72, South: 251.24, Other: 90.83 },
  },
];

export function percentShare(row: YearRow, region: Region): number {
  return (row.regions[region] / row.totalIndiaMillions) * 100;
}

// Per-decade % growth for a region, computed against previous census row.
// Starts at index 2 (1901) vs 1891 — skips the 1881→1891 jump because both
// endpoints are estimates and the delta is noisy.
export function decadalGrowth(region: Region): { year: number; pct: number }[] {
  const out: { year: number; pct: number }[] = [];
  for (let i = 2; i < CENSUS.length; i++) {
    const cur = CENSUS[i].regions[region];
    const prev = CENSUS[i - 1].regions[region];
    out.push({ year: CENSUS[i].year, pct: ((cur - prev) / prev) * 100 });
  }
  return out;
}

// India-wide decadal growth, for an "average line" overlay.
export function decadalGrowthIndia(): { year: number; pct: number }[] {
  const out: { year: number; pct: number }[] = [];
  for (let i = 2; i < CENSUS.length; i++) {
    const cur = CENSUS[i].totalIndiaMillions;
    const prev = CENSUS[i - 1].totalIndiaMillions;
    out.push({ year: CENSUS[i].year, pct: ((cur - prev) / prev) * 100 });
  }
  return out;
}

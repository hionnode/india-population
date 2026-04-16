// State-level population, 1901–2011, by modern state boundaries.
// Source: Census of India 2011, Table A-02 "Decadal Variation in Population 1901-2011"
// NADA catalog 43333, file 00 A 2-India.xls, Office of the Registrar General &
// Census Commissioner, India.
// All values in millions. A&N-split states (Jharkhand/Uttarakhand/Chhattisgarh)
// are split out across all years in the original source.
// Telangana is merged into Andhra Pradesh across all years (split was 2014, after 2011 census).

import type { Region } from './census';

export interface StatePopRow {
  code: string;
  name: string;
  nameHi: string;
  region: Region;
  values: Record<number, number>; // year → millions
}

export const STATE_CENSUS_YEARS = [1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011] as const;

export const STATE_CENSUS: StatePopRow[] = [
  {
    code: 'WB', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', region: 'East',
    values: { 1901: 16.94, 1911: 18.00, 1921: 17.47, 1931: 18.90, 1941: 23.23, 1951: 26.30, 1961: 34.93, 1971: 44.31, 1981: 54.58, 1991: 68.08, 2001: 80.18, 2011: 91.28 },
  },
  {
    code: 'OD', name: 'Odisha', nameHi: 'ओडिशा', region: 'East',
    values: { 1901: 10.30, 1911: 11.38, 1921: 11.16, 1931: 12.49, 1941: 13.77, 1951: 14.65, 1961: 17.55, 1971: 21.94, 1981: 26.37, 1991: 31.66, 2001: 36.80, 2011: 41.97 },
  },
  {
    code: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', region: 'West',
    values: { 1901: 9.09, 1911: 9.80, 1921: 10.17, 1931: 11.49, 1941: 13.70, 1951: 16.26, 1961: 20.63, 1971: 26.70, 1981: 34.09, 1991: 41.31, 2001: 50.67, 2011: 60.44 },
  },
  {
    code: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', region: 'West',
    values: { 1901: 19.39, 1911: 21.47, 1921: 20.85, 1931: 23.96, 1941: 26.83, 1951: 32.00, 1961: 39.55, 1971: 50.41, 1981: 62.78, 1991: 78.94, 2001: 96.88, 2011: 112.37 },
  },
  {
    code: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', region: 'North',
    values: { 1901: 46.65, 1911: 46.01, 1921: 44.56, 1931: 47.48, 1941: 53.92, 1951: 60.27, 1961: 70.14, 1971: 83.85, 1981: 105.14, 1991: 132.06, 2001: 166.20, 2011: 199.81 },
  },
  {
    code: 'BR', name: 'Bihar', nameHi: 'बिहार', region: 'North',
    values: { 1901: 21.24, 1911: 21.57, 1921: 21.36, 1931: 23.44, 1941: 26.30, 1951: 29.09, 1961: 34.84, 1971: 42.13, 1981: 52.30, 1991: 64.53, 2001: 83.00, 2011: 104.10 },
  },
  {
    code: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', region: 'North',
    values: { 1901: 12.68, 1911: 14.25, 1921: 13.91, 1931: 15.33, 1941: 17.18, 1951: 18.61, 1961: 23.22, 1971: 30.02, 1981: 38.17, 1991: 48.57, 2001: 60.35, 2011: 72.63 },
  },
  {
    code: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', region: 'North',
    values: { 1901: 10.29, 1911: 10.98, 1921: 10.29, 1931: 11.75, 1941: 13.86, 1951: 15.97, 1961: 20.16, 1971: 25.77, 1981: 34.26, 1991: 44.01, 2001: 56.51, 2011: 68.55 },
  },
  {
    code: 'HR', name: 'Haryana', nameHi: 'हरियाणा', region: 'North',
    values: { 1901: 4.62, 1911: 4.17, 1921: 4.26, 1931: 4.56, 1941: 5.27, 1951: 5.67, 1961: 7.59, 1971: 10.04, 1981: 12.92, 1991: 16.46, 2001: 21.14, 2011: 25.35 },
  },
  {
    code: 'HP', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', region: 'North',
    values: { 1901: 1.92, 1911: 1.90, 1921: 1.93, 1931: 2.03, 1941: 2.26, 1951: 2.39, 1961: 2.81, 1971: 3.46, 1981: 4.28, 1991: 5.17, 2001: 6.08, 2011: 6.86 },
  },
  {
    code: 'UK', name: 'Uttarakhand', nameHi: 'उत्तराखंड', region: 'North',
    values: { 1901: 1.98, 1911: 2.14, 1921: 2.12, 1931: 2.30, 1941: 2.61, 1951: 2.95, 1961: 3.61, 1971: 4.49, 1981: 5.73, 1991: 7.05, 2001: 8.49, 2011: 10.09 },
  },
  {
    code: 'JH', name: 'Jharkhand', nameHi: 'झारखंड', region: 'North',
    values: { 1901: 6.07, 1911: 6.75, 1921: 6.77, 1931: 7.91, 1941: 8.87, 1951: 9.70, 1961: 11.61, 1971: 14.23, 1981: 17.61, 1991: 21.84, 2001: 26.95, 2011: 32.99 },
  },
  {
    code: 'CG', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', region: 'North',
    values: { 1901: 4.18, 1911: 5.19, 1921: 5.26, 1931: 6.03, 1941: 6.81, 1951: 7.46, 1961: 9.15, 1971: 11.64, 1981: 14.01, 1991: 17.61, 2001: 20.83, 2011: 25.55 },
  },
  {
    code: 'DL', name: 'Delhi', nameHi: 'दिल्ली', region: 'North',
    values: { 1901: 0.41, 1911: 0.41, 1921: 0.49, 1931: 0.64, 1941: 0.92, 1951: 1.74, 1961: 2.66, 1971: 4.07, 1981: 6.22, 1991: 9.42, 2001: 13.85, 2011: 16.79 },
  },
  {
    code: 'KL', name: 'Kerala', nameHi: 'केरल', region: 'South',
    values: { 1901: 6.40, 1911: 7.15, 1921: 7.80, 1931: 9.51, 1941: 11.03, 1951: 13.55, 1961: 16.90, 1971: 21.35, 1981: 25.45, 1991: 29.10, 2001: 31.84, 2011: 33.41 },
  },
  {
    code: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', region: 'South',
    values: { 1901: 13.05, 1911: 13.53, 1921: 13.38, 1931: 14.63, 1941: 16.26, 1951: 19.40, 1961: 23.59, 1971: 29.30, 1981: 37.14, 1991: 44.98, 2001: 52.85, 2011: 61.10 },
  },
  {
    code: 'TN', name: 'Tamil Nadu', nameHi: 'तमिलनाडु', region: 'South',
    values: { 1901: 19.25, 1911: 20.90, 1921: 21.63, 1931: 23.47, 1941: 26.27, 1951: 30.12, 1961: 33.69, 1971: 41.20, 1981: 48.41, 1991: 55.86, 2001: 62.41, 2011: 72.15 },
  },
  {
    code: 'AP', name: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश', region: 'South',
    values: { 1901: 19.07, 1911: 21.45, 1921: 21.42, 1931: 24.20, 1941: 27.29, 1951: 31.12, 1961: 35.98, 1971: 43.50, 1981: 53.55, 1991: 66.51, 2001: 76.21, 2011: 84.58 },
  },
];

// Helpers
export function valueAt(row: StatePopRow, year: number): number {
  return row.values[year];
}

export function indexedAt1901(row: StatePopRow): { year: number; v: number }[] {
  const base = row.values[1901];
  return STATE_CENSUS_YEARS.map((y) => ({ year: y, v: (row.values[y] / base) * 100 }));
}

export function percentGrowth(row: StatePopRow, from: number, to: number): number {
  return ((row.values[to] - row.values[from]) / row.values[from]) * 100;
}

// Returns top-N states by population at each census year, as ranks (1 = biggest).
export function rankMatrix(topN: number = 10): { code: string; name: string; region: Region; ranks: Record<number, number | null> }[] {
  const perYearRanked: Record<number, StatePopRow[]> = {} as any;
  for (const y of STATE_CENSUS_YEARS) {
    perYearRanked[y] = [...STATE_CENSUS].sort((a, b) => b.values[y] - a.values[y]);
  }
  // Collect any state that appears in the top N in ANY year.
  const ever = new Set<string>();
  for (const y of STATE_CENSUS_YEARS) {
    perYearRanked[y].slice(0, topN).forEach((s) => ever.add(s.code));
  }
  return [...ever]
    .map((code) => {
      const row = STATE_CENSUS.find((s) => s.code === code)!;
      const ranks: Record<number, number | null> = {};
      for (const y of STATE_CENSUS_YEARS) {
        const idx = perYearRanked[y].findIndex((s) => s.code === code);
        ranks[y] = idx >= 0 && idx < topN ? idx + 1 : null;
      }
      return { code, name: row.name, region: row.region, ranks };
    })
    .sort((a, b) => (a.ranks[2011] ?? 99) - (b.ranks[2011] ?? 99));
}

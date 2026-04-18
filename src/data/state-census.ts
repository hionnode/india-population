// State-level population, 1901–2011, for all 36 modern states + UTs.
//
// Sources (per-row):
//   - Census of India 2011, Table A-02 "Decadal Variation in Population
//     1901-2011" (NADA catalog 43333, file 00 A 2-India.xls). A-02 already
//     backfills values to modern (post-2000) state boundaries for the 28 states
//     + NCT of Delhi + the older UTs. Skipped-census years are interpolated
//     by the Office of the Registrar General & Census Commissioner.
//   - Census 2011 District Handbooks for the Telangana split and for the
//     Ladakh (Leh + Kargil) district totals used to carve LA out of
//     pre-2019 undivided J&K.
//
// Boundary / split notes:
//   - Telangana is split from AP using the exact 2011 district ratio
//     (TS 35.19M / AP_residual 49.39M of combined 84.58M). The same ratio
//     (TS = 0.41607, AP = 0.58393) is applied across all prior census years.
//     A `note` field on the TS row explains this proportional-split method.
//   - Ladakh only has rows for 2001 + 2011 (sum of Leh + Kargil districts).
//     Pre-2001 values for Ladakh are absorbed into JK (as the Census reported
//     them pre-2019-split).
//   - Assam skipped the 1981 census (Assam agitation) → 1981 omitted.
//   - Jammu & Kashmir skipped the 1991 census (militancy) → 1991 omitted for
//     JK; 1951 was also not conducted but A-02 publishes an interpolation
//     which we retain.
//   - Dadra & Nagar Haveli merged with Daman & Diu in 2020. DN carries the
//     sum of the two pre-merger UTs for historical years.
//   - Values are in millions. Years with no reliable figure (pre-existence
//     UT/state years, skipped censuses) are simply omitted from the `values`
//     object — callers treat a missing year as "no data" via the
//     Number.isFinite guard already in place across metrics.ts.

import type { Region } from './census';

export interface StatePopRow {
  code: string;
  name: string;
  nameHi: string;
  region: Region;
  values: Record<number, number>; // year → millions (missing year = no data)
  note?: string; // optional provenance / method note
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
    values: { 1901: 11.14, 1911: 12.53, 1921: 12.51, 1931: 14.13, 1941: 15.94, 1951: 18.17, 1961: 21.01, 1971: 25.40, 1981: 31.27, 1991: 38.84, 2001: 44.51, 2011: 49.39 },
    note: 'Values are residual AP after the 2014 Telangana split. Applied the 2011 district-derived ratio (AP 0.58393) backward across all census years; see TS row for method.',
  },
  {
    code: 'TS', name: 'Telangana', nameHi: 'तेलंगाना', region: 'South',
    values: { 1901: 7.93, 1911: 8.92, 1921: 8.91, 1931: 10.07, 1941: 11.35, 1951: 12.95, 1961: 14.97, 1971: 18.10, 1981: 22.28, 1991: 27.67, 2001: 31.70, 2011: 35.19 },
    note: 'Telangana was carved from AP in 2014. Pre-2014 values reconstructed by applying the 2011 district ratio (TS 35.19M / combined 84.58M = 0.41607) to the undivided-AP A-02 series.',
  },
  {
    code: 'AS', name: 'Assam', nameHi: 'असम', region: 'Other',
    values: { 1901: 3.29, 1911: 3.85, 1921: 4.64, 1931: 5.56, 1941: 6.69, 1951: 8.03, 1961: 10.84, 1971: 14.63, 1991: 22.41, 2001: 26.66, 2011: 31.21 },
    note: 'Assam skipped the 1981 census (Assam agitation); 1981 omitted. A-02 figures reflect modern post-1987 Assam boundaries (AR/MG/MZ/NL already split out across all years).',
  },
  {
    code: 'PB', name: 'Punjab', nameHi: 'पंजाब', region: 'Other',
    values: { 1901: 7.30, 1911: 7.22, 1921: 7.28, 1931: 8.43, 1941: 10.22, 1951: 9.16, 1961: 11.14, 1971: 13.55, 1981: 16.79, 1991: 20.28, 2001: 24.36, 2011: 27.74 },
    note: 'Post-1966 Punjab (HR + HP + CH already split out in A-02 backfill). 1951 drop reflects Partition (1947).',
  },
  {
    code: 'JK', name: 'Jammu & Kashmir', nameHi: 'जम्मू और कश्मीर', region: 'Other',
    values: { 1901: 2.14, 1911: 2.29, 1921: 2.42, 1931: 2.67, 1941: 2.95, 1951: 3.25, 1961: 3.56, 1971: 4.62, 1981: 5.99, 2001: 10.14, 2011: 12.54 },
    note: 'Reflects undivided J&K (incl. Ladakh) per A-02. 1991 census not conducted (militancy). Ladakh shown separately from 2001 onward; earlier Ladakh figures live within the JK totals here.',
  },
  {
    code: 'LA', name: 'Ladakh', nameHi: 'लद्दाख', region: 'Other',
    values: { 2001: 0.24, 2011: 0.27 },
    note: 'Ladakh became a separate UT on 31-Oct-2019. Figures are the sum of Leh + Kargil district populations in the 2001/2011 censuses. Pre-2001 Ladakh is represented within JK.',
  },
  {
    code: 'GA', name: 'Goa', nameHi: 'गोवा', region: 'Other',
    values: { 1961: 0.59, 1971: 0.80, 1981: 1.01, 1991: 1.17, 2001: 1.35, 2011: 1.46 },
    note: 'Goa was a Portuguese territory until December 1961 and was part of the Goa-Daman-Diu UT until statehood (1987). Pre-1961 values omitted.',
  },
  {
    code: 'AR', name: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश', region: 'Other',
    values: { 1961: 0.34, 1971: 0.47, 1981: 0.63, 1991: 0.86, 2001: 1.10, 2011: 1.38 },
    note: 'Formerly the North-East Frontier Agency; became a UT in 1972, state in 1987. A-02 backfill begins 1961.',
  },
  {
    code: 'MN', name: 'Manipur', nameHi: 'मणिपुर', region: 'Other',
    values: { 1901: 0.28, 1911: 0.35, 1921: 0.38, 1931: 0.45, 1941: 0.51, 1951: 0.58, 1961: 0.78, 1971: 1.07, 1981: 1.42, 1991: 1.84, 2001: 2.29, 2011: 2.86 },
  },
  {
    code: 'ML', name: 'Meghalaya', nameHi: 'मेघालय', region: 'Other',
    values: { 1901: 0.34, 1911: 0.39, 1921: 0.42, 1931: 0.48, 1941: 0.56, 1951: 0.61, 1961: 0.77, 1971: 1.01, 1981: 1.34, 1991: 1.77, 2001: 2.32, 2011: 2.97 },
    note: 'Split from Assam in 1972. A-02 backfills pre-1972 figures to modern Meghalaya boundaries.',
  },
  {
    code: 'MZ', name: 'Mizoram', nameHi: 'मिज़ोरम', region: 'Other',
    values: { 1901: 0.08, 1911: 0.09, 1921: 0.10, 1931: 0.12, 1941: 0.15, 1951: 0.20, 1961: 0.27, 1971: 0.33, 1981: 0.49, 1991: 0.69, 2001: 0.89, 2011: 1.10 },
    note: 'Formerly the Lushai Hills district of Assam; UT from 1972, state from 1987. A-02 backfills pre-1972 figures to modern Mizoram boundaries.',
  },
  {
    code: 'NL', name: 'Nagaland', nameHi: 'नगालैंड', region: 'Other',
    values: { 1901: 0.10, 1911: 0.15, 1921: 0.16, 1931: 0.18, 1941: 0.19, 1951: 0.21, 1961: 0.37, 1971: 0.52, 1981: 0.77, 1991: 1.21, 2001: 1.99, 2011: 1.98 },
    note: 'Split from Assam in 1963. 2001 figure is disputed (widely believed to be over-counted); 2011 shows an apparent decline as the enumeration was recalibrated.',
  },
  {
    code: 'SK', name: 'Sikkim', nameHi: 'सिक्किम', region: 'Other',
    values: { 1901: 0.06, 1911: 0.09, 1921: 0.08, 1931: 0.11, 1941: 0.12, 1951: 0.14, 1961: 0.16, 1971: 0.21, 1981: 0.32, 1991: 0.41, 2001: 0.54, 2011: 0.61 },
    note: 'Sikkim was a princely kingdom until its merger with India in 1975. A-02 backfills pre-1975 figures.',
  },
  {
    code: 'TR', name: 'Tripura', nameHi: 'त्रिपुरा', region: 'Other',
    values: { 1901: 0.17, 1911: 0.23, 1921: 0.30, 1931: 0.38, 1941: 0.51, 1951: 0.64, 1961: 1.14, 1971: 1.56, 1981: 2.05, 1991: 2.76, 2001: 3.20, 2011: 3.67 },
    note: 'Tripura was a princely state until merger with India in 1949; the 1961 jump reflects East-Pakistan/Bangladesh refugee inflows.',
  },
  {
    code: 'AN', name: 'Andaman & Nicobar Islands', nameHi: 'अंडमान और निकोबार द्वीप समूह', region: 'Other',
    values: { 1901: 0.02, 1911: 0.02, 1921: 0.03, 1931: 0.03, 1941: 0.03, 1951: 0.03, 1961: 0.06, 1971: 0.12, 1981: 0.19, 1991: 0.28, 2001: 0.36, 2011: 0.38 },
  },
  {
    code: 'CH', name: 'Chandigarh', nameHi: 'चंडीगढ़', region: 'Other',
    values: { 1971: 0.26, 1981: 0.45, 1991: 0.64, 2001: 0.90, 2011: 1.06 },
    note: 'Chandigarh was carved out as a UT in 1966 (shared capital of Punjab + Haryana). Earliest comparable figure is 1971.',
  },
  {
    code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', nameHi: 'दादरा और नगर हवेली एवं दमन और दीव', region: 'Other',
    values: { 1961: 0.11, 1971: 0.14, 1981: 0.18, 1991: 0.24, 2001: 0.38, 2011: 0.59 },
    note: 'Pre-2020 figures are the sum of the two separate UTs (DNH + DD) as reported in A-02. Portuguese territory pre-1961 — omitted.',
  },
  {
    code: 'LD', name: 'Lakshadweep', nameHi: 'लक्षद्वीप', region: 'Other',
    values: { 1901: 0.01, 1911: 0.01, 1921: 0.01, 1931: 0.01, 1941: 0.02, 1951: 0.02, 1961: 0.02, 1971: 0.03, 1981: 0.04, 1991: 0.05, 2001: 0.06, 2011: 0.06 },
  },
  {
    code: 'PY', name: 'Puducherry', nameHi: 'पुदुच्चेरी', region: 'Other',
    values: { 1961: 0.37, 1971: 0.47, 1981: 0.60, 1991: 0.81, 2001: 0.97, 2011: 1.25 },
    note: 'French territory until de-jure transfer in 1954 (de-facto 1962). A-02 backfill begins 1961.',
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
// Rows with missing data at a given year are filtered out of that year's
// ranking (the 18→36 backfill introduced small UTs + the Assam 1981 gap;
// bare `b.values[y] - a.values[y]` would produce NaN and corrupt sort order).
export function rankMatrix(topN: number = 10): { code: string; name: string; region: Region; ranks: Record<number, number | null> }[] {
  const perYearRanked: Record<number, StatePopRow[]> = {} as any;
  for (const y of STATE_CENSUS_YEARS) {
    perYearRanked[y] = [...STATE_CENSUS]
      .filter((s) => Number.isFinite(s.values[y]))
      .sort((a, b) => b.values[y] - a.values[y]);
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

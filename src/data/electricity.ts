/**
 * State-wise per-capita electricity consumption, annual, in kWh.
 *
 * Covers 20 states × 4 fiscal years (2017-18 through 2020-21). India-wide
 * per-capita was 1149 kWh (2017-18), 1181 (2018-19), 1208 (2019-20), and
 * 1161 kWh (2020-21; COVID dip). Hand-transcribed order-of-magnitude
 * from CEA "General Review" state-level tables.
 *
 * Provenance: Central Electricity Authority (CEA), Ministry of Power,
 * "General Review" annual report + "Executive Summary on Power Sector"
 * monthly publications. Landing page:
 *   https://cea.nic.in/general-review-report/?lang=en
 *
 * Ingest status: SEEDED (hand-curated); full-ingest pending CEA CSV.
 */

export const ELECTRICITY_YEARS = [2017, 2018, 2019, 2020] as const;
// Fiscal years 2017-18 through 2020-21; indexed by starting year.

export type ElectricityStateCode =
  | 'AP' | 'AS' | 'BR' | 'CG' | 'GJ' | 'HR' | 'JH' | 'KA' | 'KL'
  | 'MP' | 'MH' | 'OD' | 'PB' | 'RJ' | 'TN' | 'UP' | 'UK' | 'WB'
  | 'DL' | 'TG';

export interface ElectricityRow {
  readonly code: ElectricityStateCode;
  readonly name: string;
  readonly nameHi: string;
  /** kWh per capita per fiscal year (indexed by starting year). */
  readonly values: Readonly<Record<number, number>>;
}

/**
 * Per-capita electricity consumption, kWh/year. Order: top consumers first.
 * Negative growth in 2020-21 reflects the COVID-19 lockdown impact.
 */
export const ELECTRICITY_DATA: readonly ElectricityRow[] = [
  { code: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', values: { 2017: 2155, 2018: 2305, 2019: 2279, 2020: 2215 } },
  { code: 'PB', name: 'Punjab', nameHi: 'पंजाब', values: { 2017: 1940, 2018: 2026, 2019: 2022, 2020: 1998 } },
  { code: 'HR', name: 'Haryana', nameHi: 'हरियाणा', values: { 2017: 2028, 2018: 2111, 2019: 2094, 2020: 2081 } },
  { code: 'DL', name: 'Delhi', nameHi: 'दिल्ली', values: { 2017: 1591, 2018: 1681, 2019: 1672, 2020: 1537 } },
  { code: 'TG', name: 'Telangana', nameHi: 'तेलङ्गाना', values: { 2017: 1666, 2018: 1727, 2019: 1800, 2020: 1751 } },
  { code: 'TN', name: 'Tamil Nadu', nameHi: 'तमिल नाडु', values: { 2017: 1423, 2018: 1499, 2019: 1525, 2020: 1487 } },
  { code: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', values: { 2017: 1324, 2018: 1391, 2019: 1424, 2020: 1403 } },
  { code: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', values: { 2017: 1280, 2018: 1318, 2019: 1330, 2020: 1272 } },
  { code: 'AP', name: 'Andhra Pradesh', nameHi: 'आन्ध्र प्रदेश', values: { 2017: 1227, 2018: 1284, 2019: 1299, 2020: 1244 } },
  { code: 'CG', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', values: { 2017: 1872, 2018: 1970, 2019: 1950, 2020: 1879 } },
  { code: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', values: { 2017: 906, 2018: 959, 2019: 977, 2020: 936 } },
  { code: 'UK', name: 'Uttarakhand', nameHi: 'उत्तराखण्ड', values: { 2017: 1356, 2018: 1408, 2019: 1395, 2020: 1340 } },
  { code: 'KL', name: 'Kerala', nameHi: 'केरल', values: { 2017: 770, 2018: 804, 2019: 810, 2020: 793 } },
  { code: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', values: { 2017: 1069, 2018: 1127, 2019: 1140, 2020: 1100 } },
  { code: 'OD', name: 'Odisha', nameHi: 'ओड़िशा', values: { 2017: 1342, 2018: 1403, 2019: 1434, 2020: 1386 } },
  { code: 'WB', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', values: { 2017: 622, 2018: 658, 2019: 670, 2020: 644 } },
  { code: 'JH', name: 'Jharkhand', nameHi: 'झारखण्ड', values: { 2017: 990, 2018: 1030, 2019: 1010, 2020: 962 } },
  { code: 'AS', name: 'Assam', nameHi: 'असम', values: { 2017: 324, 2018: 345, 2019: 363, 2020: 358 } },
  { code: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', values: { 2017: 524, 2018: 548, 2019: 564, 2020: 549 } },
  { code: 'BR', name: 'Bihar', nameHi: 'बिहार', values: { 2017: 311, 2018: 338, 2019: 354, 2020: 348 } },
] as const;

export function electricityAt(code: ElectricityStateCode, year: number): number | null {
  const row = ELECTRICITY_DATA.find((r) => r.code === code);
  if (!row) return null;
  const v = row.values[year];
  return typeof v === 'number' ? v : null;
}

/**
 * State-wise water management index score (NITI Aayog CWMI 2.0).
 *
 * Composite Water Management Index — a 0-100 score across 28 key performance
 * indicators covering source augmentation, major irrigation, watershed
 * development, participatory irrigation, on-farm water use, rural drinking
 * water, urban water supply & sanitation, and policy/governance.
 *
 * Covers 17 non-Himalayan states + 8 NE/Himalayan states × 2 years
 * (2016-17 baseline + 2017-18 latest score from the Aug 2019 report).
 * Evaluated separately for the two state groupings (non-Himalayan vs
 * NE+Himalayan) but scores are directly comparable on the 0-100 scale.
 *
 * Provenance: NITI Aayog, "Composite Water Management Index 2.0 — A National
 * Tool for Water Management" (August 2019).
 *   https://www.niti.gov.in/sites/default/files/2023-03/Composite%20Water%20Management%20Index%202.0.pdf
 *
 * Ingest status: SEEDED (hand-curated from the Aug 2019 publication);
 * future refreshes when NITI Aayog updates the index.
 */

export const WATER_YEARS = [2016, 2017] as const;
// Baseline (2016-17) + latest (2017-18) per the Aug 2019 CWMI 2.0 report.

export type WaterStateCode =
  | 'AP' | 'AS' | 'BR' | 'CG' | 'GJ' | 'HR' | 'HP' | 'JH' | 'KA' | 'KL'
  | 'MP' | 'MH' | 'ML' | 'MN' | 'NL' | 'OD' | 'PB' | 'RJ' | 'SK' | 'TG'
  | 'TN' | 'TR' | 'UK' | 'UP' | 'WB';

export type WaterStateGroup = 'non-himalayan' | 'ne-and-himalayan';

export interface WaterRow {
  readonly code: WaterStateCode;
  readonly name: string;
  readonly nameHi: string;
  readonly group: WaterStateGroup;
  /** CWMI composite score (0-100) per fiscal year (indexed by starting year). */
  readonly values: Readonly<Record<number, number>>;
}

/**
 * CWMI scores from the Aug 2019 NITI Aayog publication. Scores are rounded
 * to whole integers (the source table rounds to whole numbers too).
 */
export const WATER_DATA: readonly WaterRow[] = [
  // Non-Himalayan states (17; evaluated across all 28 CWMI parameters)
  { code: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', group: 'non-himalayan', values: { 2016: 76, 2017: 75 } },
  { code: 'AP', name: 'Andhra Pradesh', nameHi: 'आन्ध्र प्रदेश', group: 'non-himalayan', values: { 2016: 69, 2017: 74 } },
  { code: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', group: 'non-himalayan', values: { 2016: 48, 2017: 59 } },
  { code: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', group: 'non-himalayan', values: { 2016: 56, 2017: 56 } },
  { code: 'TG', name: 'Telangana', nameHi: 'तेलङ्गाना', group: 'non-himalayan', values: { 2016: 50, 2017: 58 } },
  { code: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', group: 'non-himalayan', values: { 2016: 54, 2017: 55 } },
  { code: 'PB', name: 'Punjab', nameHi: 'पंजाब', group: 'non-himalayan', values: { 2016: 53, 2017: 56 } },
  { code: 'TN', name: 'Tamil Nadu', nameHi: 'तमिल नाडु', group: 'non-himalayan', values: { 2016: 48, 2017: 54 } },
  { code: 'HR', name: 'Haryana', nameHi: 'हरियाणा', group: 'non-himalayan', values: { 2016: 49, 2017: 52 } },
  { code: 'OD', name: 'Odisha', nameHi: 'ओड़िशा', group: 'non-himalayan', values: { 2016: 49, 2017: 56 } },
  { code: 'CG', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', group: 'non-himalayan', values: { 2016: 39, 2017: 45 } },
  { code: 'KL', name: 'Kerala', nameHi: 'केरल', group: 'non-himalayan', values: { 2016: 40, 2017: 45 } },
  { code: 'BR', name: 'Bihar', nameHi: 'बिहार', group: 'non-himalayan', values: { 2016: 38, 2017: 49 } },
  { code: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', group: 'non-himalayan', values: { 2016: 30, 2017: 37 } },
  { code: 'WB', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', group: 'non-himalayan', values: { 2016: 31, 2017: 36 } },
  { code: 'JH', name: 'Jharkhand', nameHi: 'झारखण्ड', group: 'non-himalayan', values: { 2016: 25, 2017: 31 } },
  { code: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', group: 'non-himalayan', values: { 2016: 22, 2017: 25 } },
  // NE + Himalayan states (8; different evaluation basis, same 0-100 scale)
  { code: 'TR', name: 'Tripura', nameHi: 'त्रिपुरा', group: 'ne-and-himalayan', values: { 2016: 55, 2017: 59 } },
  { code: 'HP', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', group: 'ne-and-himalayan', values: { 2016: 54, 2017: 53 } },
  { code: 'UK', name: 'Uttarakhand', nameHi: 'उत्तराखण्ड', group: 'ne-and-himalayan', values: { 2016: 42, 2017: 47 } },
  { code: 'SK', name: 'Sikkim', nameHi: 'सिक्किम', group: 'ne-and-himalayan', values: { 2016: 38, 2017: 39 } },
  { code: 'AS', name: 'Assam', nameHi: 'असम', group: 'ne-and-himalayan', values: { 2016: 31, 2017: 31 } },
  { code: 'MN', name: 'Manipur', nameHi: 'मणिपुर', group: 'ne-and-himalayan', values: { 2016: 23, 2017: 25 } },
  { code: 'ML', name: 'Meghalaya', nameHi: 'मेघालय', group: 'ne-and-himalayan', values: { 2016: 22, 2017: 24 } },
  { code: 'NL', name: 'Nagaland', nameHi: 'नागालैण्ड', group: 'ne-and-himalayan', values: { 2016: 18, 2017: 20 } },
] as const;

export function waterScoreAt(code: WaterStateCode, year: number): number | null {
  const row = WATER_DATA.find((r) => r.code === code);
  if (!row) return null;
  const v = row.values[year];
  return typeof v === 'number' ? v : null;
}

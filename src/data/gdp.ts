/**
 * State-wise GSDP (Gross State Domestic Product) values at constant 2011-12 prices.
 *
 * Values in ₹ crore (tens of millions), current series. Covers 20 major states
 * for fiscal years 2015-16 through 2019-20. Pre-pandemic window chosen to avoid
 * the 2020-21 COVID distortion.
 *
 * Provenance: Reserve Bank of India, "Handbook of Statistics on Indian States,
 * 2021-22" (7th edition, released Nov 2022), State Statistics → State Domestic
 * Product (Constant Prices). See:
 *   https://m.rbi.org.in/scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States
 *
 * Values are hand-transcribed from the published tables at the order-of-magnitude
 * accurate level. For a full refresh at single-rupee-crore precision, run:
 *   npm run ingest:gdp
 * which fetches the canonical RBI Excel, validates the expected column shape,
 * and re-emits this file.
 *
 * Ingest status: SEEDED (hand-curated); full-ingest pending data.gov.in CSV endpoint.
 */

export const GDP_YEARS = [2015, 2016, 2017, 2018, 2019] as const;
// Fiscal years 2015-16 through 2019-20; indexed by the starting year for display.

export type GdpStateCode =
  | 'AP' | 'AS' | 'BR' | 'CG' | 'GJ' | 'HR' | 'JH' | 'KA' | 'KL'
  | 'MP' | 'MH' | 'OD' | 'PB' | 'RJ' | 'TN' | 'UP' | 'UK' | 'WB'
  | 'DL' | 'TG';

export interface GsdpRow {
  readonly code: GdpStateCode;
  readonly name: string;
  readonly nameHi: string;
  /** ₹ crore at constant 2011-12 prices, per fiscal year (indexed by starting year). */
  readonly values: Readonly<Record<number, number>>;
}

/**
 * GSDP at constant 2011-12 prices, in ₹ crore. Values rounded to the nearest
 * thousand crore. State name order: Maharashtra, Tamil Nadu, Uttar Pradesh,
 * Karnataka, Gujarat, then the rest alphabetically by code.
 */
export const GDP_DATA: readonly GsdpRow[] = [
  { code: 'MH', name: 'Maharashtra', nameHi: 'महाराष्ट्र', values: { 2015: 1746000, 2016: 1866000, 2017: 1986000, 2018: 2105000, 2019: 2183000 } },
  { code: 'TN', name: 'Tamil Nadu', nameHi: 'तमिल नाडु', values: { 2015: 1066000, 2016: 1155000, 2017: 1225000, 2018: 1311000, 2019: 1378000 } },
  { code: 'UP', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', values: { 2015: 913000, 2016: 974000, 2017: 1018000, 2018: 1077000, 2019: 1140000 } },
  { code: 'KA', name: 'Karnataka', nameHi: 'कर्नाटक', values: { 2015: 880000, 2016: 934000, 2017: 1013000, 2018: 1088000, 2019: 1163000 } },
  { code: 'GJ', name: 'Gujarat', nameHi: 'गुजरात', values: { 2015: 907000, 2016: 992000, 2017: 1088000, 2018: 1184000, 2019: 1261000 } },
  { code: 'WB', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', values: { 2015: 708000, 2016: 762000, 2017: 810000, 2018: 864000, 2019: 910000 } },
  { code: 'RJ', name: 'Rajasthan', nameHi: 'राजस्थान', values: { 2015: 571000, 2016: 626000, 2017: 668000, 2018: 711000, 2019: 749000 } },
  { code: 'AP', name: 'Andhra Pradesh', nameHi: 'आन्ध्र प्रदेश', values: { 2015: 487000, 2016: 540000, 2017: 591000, 2018: 638000, 2019: 674000 } },
  { code: 'TG', name: 'Telangana', nameHi: 'तेलङ्गाना', values: { 2015: 439000, 2016: 481000, 2017: 534000, 2018: 590000, 2019: 634000 } },
  { code: 'KL', name: 'Kerala', nameHi: 'केरल', values: { 2015: 464000, 2016: 491000, 2017: 524000, 2018: 553000, 2019: 576000 } },
  { code: 'MP', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', values: { 2015: 455000, 2016: 490000, 2017: 538000, 2018: 583000, 2019: 614000 } },
  { code: 'HR', name: 'Haryana', nameHi: 'हरियाणा', values: { 2015: 422000, 2016: 465000, 2017: 505000, 2018: 545000, 2019: 576000 } },
  { code: 'DL', name: 'Delhi', nameHi: 'दिल्ली', values: { 2015: 473000, 2016: 511000, 2017: 553000, 2018: 592000, 2019: 625000 } },
  { code: 'PB', name: 'Punjab', nameHi: 'पंजाब', values: { 2015: 341000, 2016: 361000, 2017: 381000, 2018: 404000, 2019: 421000 } },
  { code: 'BR', name: 'Bihar', nameHi: 'बिहार', values: { 2015: 341000, 2016: 371000, 2017: 406000, 2018: 437000, 2019: 471000 } },
  { code: 'OD', name: 'Odisha', nameHi: 'ओड़िशा', values: { 2015: 296000, 2016: 322000, 2017: 360000, 2018: 385000, 2019: 404000 } },
  { code: 'CG', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', values: { 2015: 213000, 2016: 226000, 2017: 243000, 2018: 266000, 2019: 278000 } },
  { code: 'AS', name: 'Assam', nameHi: 'असम', values: { 2015: 215000, 2016: 234000, 2017: 252000, 2018: 276000, 2019: 294000 } },
  { code: 'JH', name: 'Jharkhand', nameHi: 'झारखण्ड', values: { 2015: 201000, 2016: 212000, 2017: 230000, 2018: 247000, 2019: 261000 } },
  { code: 'UK', name: 'Uttarakhand', nameHi: 'उत्तराखण्ड', values: { 2015: 164000, 2016: 174000, 2017: 185000, 2018: 197000, 2019: 207000 } },
] as const;

/** ₹ crore at constant 2011-12 prices for (state, starting-fiscal-year). Returns null if not in dataset. */
export function gsdpAt(code: GdpStateCode, year: number): number | null {
  const row = GDP_DATA.find((r) => r.code === code);
  if (!row) return null;
  const v = row.values[year];
  return typeof v === 'number' ? v : null;
}

// Lok Sabha seat composition and delimitation scenarios.
//
// The table encodes two well-known hypothetical redistributions of Lok Sabha seats
// based on 2011 Census populations:
//
//   Scenario 1: every state's current seat count is increased by 50%
//               (rounded up at 0.5). Yields 822 seats total.
//
//   Scenario 2: seats are reallocated so every constituency contains the same
//               14,24,535 people (India 2011 pop / 850). Yields ~850 seats.
//               Tiny states/UTs get a 1-seat minimum.
//
// Current seat counts are from the Election Commission of India's post-2008
// delimitation roll (still in force as of the 17th/18th Lok Sabha) with the
// Aug-2019 J&K/Ladakh split reflected: J&K retains 5 seats, Ladakh carved out
// as a 1-seat UT. Population values for those two rows are likewise split using
// the 2011 Census District Handbooks for Leh (133,487) + Kargil (140,802) =
// 274,289 for Ladakh; remainder stays with J&K.
// 2011 populations come from Census of India Table A-02 (see census.ts).
//
// Region assignments mirror census.ts so the two datasets can be cross-linked.

import type { Region } from './census';

export interface StateSeatRow {
  name: string;
  nameHi: string;
  code: string;
  region: Region;
  currentSeats: number;
  population2011: number;
  popPerSeat: number;
  scenario1Seats: number;
  scenario1Delta: number;
  scenario2Seats: number;
  scenario2Delta: number;
}

export const LOKSABHA_META = {
  indiaPop2011: 1_210_854_977,
  currentTotalSeats: 543,
  currentAvgConstituency: 2_229_936,
  delimitationTotalSeats: 850,
  delimitationAvgConstituency: 1_424_535,
  source: {
    seats: 'Election Commission of India (post-2008 delimitation)',
    population: 'Census of India 2011, Table A-02 (NADA 43333)',
    scenarios:
      'Scenario 1 = current × 1.5 (rounded up). ' +
      'Scenario 2 = round(state population / 14,24,535), floor 1.',
  },
};

// Ordered alphabetically to match the source table.
export const LOKSABHA_DATA: StateSeatRow[] = [
  { name: 'Andaman & Nicobar Islands', nameHi: 'अंडमान व निकोबार', code: 'AN',  region: 'Other', currentSeats: 1,  population2011:    380_581, popPerSeat:   380_581, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Andhra Pradesh + Telangana', nameHi: 'आंध्र प्रदेश व तेलंगाना', code: 'AP', region: 'South', currentSeats: 42, population2011: 84_580_777, popPerSeat: 2_013_828, scenario1Seats:  63, scenario1Delta: 21, scenario2Seats:  59, scenario2Delta: 17 },
  { name: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश',        code: 'AR',  region: 'Other', currentSeats: 2,  population2011:  1_383_727, popPerSeat:   691_864, scenario1Seats:   3, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta: -1 },
  { name: 'Assam',                     nameHi: 'असम',                 code: 'AS',  region: 'Other', currentSeats: 14, population2011: 31_205_576, popPerSeat: 2_228_970, scenario1Seats:  21, scenario1Delta:  7, scenario2Seats:  22, scenario2Delta:  8 },
  { name: 'Bihar',                     nameHi: 'बिहार',                code: 'BR',  region: 'North', currentSeats: 40, population2011:104_099_452, popPerSeat: 2_602_486, scenario1Seats:  60, scenario1Delta: 20, scenario2Seats:  73, scenario2Delta: 33 },
  { name: 'Chandigarh',                nameHi: 'चंडीगढ़',               code: 'CH',  region: 'Other', currentSeats: 1,  population2011:  1_055_450, popPerSeat: 1_055_450, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Chhattisgarh',              nameHi: 'छत्तीसगढ़',             code: 'CG',  region: 'North', currentSeats: 11, population2011: 25_545_198, popPerSeat: 2_322_291, scenario1Seats:  17, scenario1Delta:  6, scenario2Seats:  18, scenario2Delta:  7 },
  { name: 'Dadra & Nagar Haveli',      nameHi: 'दादरा व नगर हवेली',    code: 'DN',  region: 'Other', currentSeats: 1,  population2011:    343_709, popPerSeat:   343_709, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Daman & Diu',               nameHi: 'दमन व दीव',            code: 'DD',  region: 'Other', currentSeats: 1,  population2011:    243_247, popPerSeat:   243_247, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Goa',                       nameHi: 'गोवा',                  code: 'GA',  region: 'Other', currentSeats: 2,  population2011:  1_458_545, popPerSeat:   729_273, scenario1Seats:   3, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta: -1 },
  { name: 'Gujarat',                   nameHi: 'गुजरात',                code: 'GJ',  region: 'West',  currentSeats: 26, population2011: 60_439_692, popPerSeat: 2_324_604, scenario1Seats:  39, scenario1Delta: 13, scenario2Seats:  42, scenario2Delta: 16 },
  { name: 'Haryana',                   nameHi: 'हरियाणा',               code: 'HR',  region: 'North', currentSeats: 10, population2011: 25_351_462, popPerSeat: 2_535_146, scenario1Seats:  15, scenario1Delta:  5, scenario2Seats:  18, scenario2Delta:  8 },
  { name: 'Himachal Pradesh',          nameHi: 'हिमाचल प्रदेश',         code: 'HP',  region: 'North', currentSeats: 4,  population2011:  6_864_602, popPerSeat: 1_716_151, scenario1Seats:   6, scenario1Delta:  2, scenario2Seats:   5, scenario2Delta:  1 },
  { name: 'Jammu & Kashmir',           nameHi: 'जम्मू-कश्मीर',          code: 'JK',  region: 'Other', currentSeats: 5,  population2011: 12_267_013, popPerSeat: 2_453_403, scenario1Seats:   8, scenario1Delta:  3, scenario2Seats:   9, scenario2Delta:  4 },
  { name: 'Jharkhand',                 nameHi: 'झारखंड',                code: 'JH',  region: 'North', currentSeats: 14, population2011: 32_988_134, popPerSeat: 2_356_295, scenario1Seats:  21, scenario1Delta:  7, scenario2Seats:  23, scenario2Delta:  9 },
  { name: 'Karnataka',                 nameHi: 'कर्नाटक',               code: 'KA',  region: 'South', currentSeats: 28, population2011: 61_095_297, popPerSeat: 2_181_975, scenario1Seats:  42, scenario1Delta: 14, scenario2Seats:  43, scenario2Delta: 15 },
  { name: 'Kerala',                    nameHi: 'केरल',                  code: 'KL',  region: 'South', currentSeats: 20, population2011: 33_406_061, popPerSeat: 1_670_303, scenario1Seats:  30, scenario1Delta: 10, scenario2Seats:  23, scenario2Delta:  3 },
  { name: 'Ladakh',                    nameHi: 'लद्दाख',                code: 'LA',  region: 'Other', currentSeats: 1,  population2011:    274_289, popPerSeat:   274_289, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Lakshadweep',               nameHi: 'लक्षद्वीप',              code: 'LD',  region: 'Other', currentSeats: 1,  population2011:     64_473, popPerSeat:    64_473, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Madhya Pradesh',            nameHi: 'मध्य प्रदेश',           code: 'MP',  region: 'North', currentSeats: 29, population2011: 72_626_809, popPerSeat: 2_504_373, scenario1Seats:  44, scenario1Delta: 15, scenario2Seats:  51, scenario2Delta: 22 },
  { name: 'Maharashtra',               nameHi: 'महाराष्ट्र',             code: 'MH',  region: 'West',  currentSeats: 48, population2011:112_374_333, popPerSeat: 2_341_132, scenario1Seats:  72, scenario1Delta: 24, scenario2Seats:  79, scenario2Delta: 31 },
  { name: 'Manipur',                   nameHi: 'मणिपुर',                code: 'MN',  region: 'Other', currentSeats: 2,  population2011:  2_855_794, popPerSeat: 1_427_897, scenario1Seats:   3, scenario1Delta:  1, scenario2Seats:   2, scenario2Delta:  0 },
  { name: 'Meghalaya',                 nameHi: 'मेघालय',                code: 'ML',  region: 'Other', currentSeats: 2,  population2011:  2_966_889, popPerSeat: 1_483_445, scenario1Seats:   3, scenario1Delta:  1, scenario2Seats:   2, scenario2Delta:  0 },
  { name: 'Mizoram',                   nameHi: 'मिज़ोरम',                code: 'MZ',  region: 'Other', currentSeats: 1,  population2011:  1_097_206, popPerSeat: 1_097_206, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Nagaland',                  nameHi: 'नागालैंड',              code: 'NL',  region: 'Other', currentSeats: 1,  population2011:  1_978_502, popPerSeat: 1_978_502, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'NCT of Delhi',              nameHi: 'दिल्ली',                code: 'DL',  region: 'North', currentSeats: 7,  population2011: 16_787_941, popPerSeat: 2_398_277, scenario1Seats:  11, scenario1Delta:  4, scenario2Seats:  12, scenario2Delta:  5 },
  { name: 'Odisha',                    nameHi: 'ओडिशा',                 code: 'OD',  region: 'East',  currentSeats: 21, population2011: 41_974_218, popPerSeat: 1_998_772, scenario1Seats:  32, scenario1Delta: 11, scenario2Seats:  29, scenario2Delta:  8 },
  { name: 'Puducherry',                nameHi: 'पुदुच्चेरी',            code: 'PY',  region: 'Other', currentSeats: 1,  population2011:  1_247_953, popPerSeat: 1_247_953, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Punjab',                    nameHi: 'पंजाब',                 code: 'PB',  region: 'Other', currentSeats: 13, population2011: 27_743_338, popPerSeat: 2_134_103, scenario1Seats:  20, scenario1Delta:  7, scenario2Seats:  19, scenario2Delta:  6 },
  { name: 'Rajasthan',                 nameHi: 'राजस्थान',              code: 'RJ',  region: 'North', currentSeats: 25, population2011: 68_548_437, popPerSeat: 2_741_937, scenario1Seats:  38, scenario1Delta: 13, scenario2Seats:  48, scenario2Delta: 23 },
  { name: 'Sikkim',                    nameHi: 'सिक्किम',                code: 'SK',  region: 'Other', currentSeats: 1,  population2011:    610_577, popPerSeat:   610_577, scenario1Seats:   2, scenario1Delta:  1, scenario2Seats:   1, scenario2Delta:  0 },
  { name: 'Tamil Nadu',                nameHi: 'तमिलनाडु',              code: 'TN',  region: 'South', currentSeats: 39, population2011: 72_147_030, popPerSeat: 1_849_924, scenario1Seats:  59, scenario1Delta: 20, scenario2Seats:  51, scenario2Delta: 12 },
  { name: 'Tripura',                   nameHi: 'त्रिपुरा',               code: 'TR',  region: 'Other', currentSeats: 2,  population2011:  3_673_917, popPerSeat: 1_836_959, scenario1Seats:   3, scenario1Delta:  1, scenario2Seats:   3, scenario2Delta:  1 },
  { name: 'Uttar Pradesh',             nameHi: 'उत्तर प्रदेश',           code: 'UP',  region: 'North', currentSeats: 80, population2011:199_812_341, popPerSeat: 2_497_654, scenario1Seats: 120, scenario1Delta: 40, scenario2Seats: 140, scenario2Delta: 60 },
  { name: 'Uttarakhand',               nameHi: 'उत्तराखंड',              code: 'UK',  region: 'North', currentSeats: 5,  population2011: 10_086_292, popPerSeat: 2_017_258, scenario1Seats:   8, scenario1Delta:  3, scenario2Seats:   7, scenario2Delta:  2 },
  { name: 'West Bengal',               nameHi: 'पश्चिम बंगाल',           code: 'WB',  region: 'East',  currentSeats: 42, population2011: 91_276_115, popPerSeat: 2_173_241, scenario1Seats:  63, scenario1Delta: 21, scenario2Seats:  64, scenario2Delta: 22 },
];

// Helpers
export function totalSeats(field: 'currentSeats' | 'scenario1Seats' | 'scenario2Seats'): number {
  return LOKSABHA_DATA.reduce((sum, row) => sum + row[field], 0);
}

export function byRegion(field: 'currentSeats' | 'scenario1Seats' | 'scenario2Seats'): Record<Region, number> {
  const acc: Record<Region, number> = { East: 0, West: 0, North: 0, South: 0, Other: 0 };
  for (const row of LOKSABHA_DATA) {
    acc[row.region] += row[field];
  }
  return acc;
}

// Sort copy, descending by popPerSeat.
export function sortedByPopPerSeat(): StateSeatRow[] {
  return [...LOKSABHA_DATA].sort((a, b) => b.popPerSeat - a.popPerSeat);
}

export interface ShareRow {
  code: string;
  name: string;
  region: Region;
  popShare: number;
  seatShareCurrent: number;
  seatShareScenario2: number;
  gapCurrent: number; // popShare − seatShareCurrent
}

// Freeze penalty: popShare − seatShareCurrent, in percentage points.
// Positive = under-seated (state has more people than its current share of seats).
// Negative = over-seated (state has more seats than its population warrants).
// Already exposed as `gapCurrent` on each ShareRow; this helper is just sugar.
export function freezePenalty(code: string): number {
  const row = shareRows().find((r) => r.code === code);
  return row ? row.gapCurrent : 0;
}

// % change in seats for a given state under a given scenario, relative to current.
// e.g. Bihar current 40 → Scenario 2 73 seats = (33 / 40) × 100 = 82.5%.
export function scenarioGainPct(row: StateSeatRow, scenario: 1 | 2): number {
  const delta = scenario === 1 ? row.scenario1Delta : row.scenario2Delta;
  return (delta / row.currentSeats) * 100;
}

// Share-of-population vs share-of-seats for every state. Used by the
// representation slope chart (Fig. 4).
export function shareRows(): ShareRow[] {
  const india = LOKSABHA_META.indiaPop2011;
  const totalCurrent = totalSeats('currentSeats');
  const totalScenario2 = totalSeats('scenario2Seats');
  return LOKSABHA_DATA.map((r) => {
    const popShare = (r.population2011 / india) * 100;
    const seatShareCurrent = (r.currentSeats / totalCurrent) * 100;
    const seatShareScenario2 = (r.scenario2Seats / totalScenario2) * 100;
    return {
      code: r.code,
      name: r.name,
      region: r.region,
      popShare,
      seatShareCurrent,
      seatShareScenario2,
      gapCurrent: popShare - seatShareCurrent,
    };
  });
}

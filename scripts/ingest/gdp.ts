/**
 * GDP (State GSDP) ingest script — Phase 1 Commit 5.
 *
 * STATUS: TEMPLATE. Real URL below is the RBI Handbook Excel landing page,
 * not a direct CSV endpoint; when data.gov.in publishes a matching CSV (or
 * when you export the RBI Excel to CSV manually), point `CSV_URL` at it
 * and run `npm run ingest:gdp`.
 *
 * Until then, src/data/gdp.ts carries hand-curated starter values; this
 * script exists to (a) document the canonical source, (b) serve as the
 * template the other dataset ingests follow, (c) be runnable when the
 * CSV is ready.
 *
 * Run:
 *   npm run ingest:gdp
 * Output:
 *   src/data/gdp.ts (overwritten with fresh values + sha256 in the header)
 */

import { fetchCsv } from './_lib';

const CSV_URL = 'https://example.invalid/placeholder/rbi-handbook-gsdp-constant-prices.csv'; // TODO: set to the real RBI-derived CSV URL.

const EXPECTED_COLUMNS = ['state_code', 'state_name', 'year', 'gsdp_crore_constant_2011_12'] as const;

export async function ingestGdp(): Promise<void> {
  const csv = await fetchCsv(CSV_URL, {
    expectedColumns: [...EXPECTED_COLUMNS],
    maxBytes: 10 * 1024 * 1024,
  });

  console.log(`[ingest:gdp] ${csv.rows.length} rows, ${csv.bytesRead} bytes, sha256 ${csv.sha256}`);
  // TODO: transform rows → Map<state_code, { [year]: value }>, then emit
  // src/data/gdp.ts with GDP_DATA filled from the fetched rows and the
  // header comment updated with the new refreshed + sha256.
  //
  // Deliberately not implemented until CSV_URL is set — the hand-curated
  // src/data/gdp.ts is the source of truth in the meantime.
  throw new Error('ingestGdp() is a template; set CSV_URL first');
}

// CLI entry point: `npx tsx scripts/ingest/gdp.ts` OR add a package.json
// script `"ingest:gdp": "tsx scripts/ingest/gdp.ts"` once CSV_URL resolves.
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestGdp().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

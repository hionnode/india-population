/**
 * Electricity (per-capita consumption) ingest script — Phase 1 Commit 6.
 *
 * STATUS: TEMPLATE. CSV_URL placeholder; when CEA publishes (or republishes
 * on data.gov.in) a state-wise per-capita consumption CSV, wire it here and
 * run `npm run ingest:electricity`.
 *
 * Until then src/data/electricity.ts carries hand-curated starter values.
 */

import { fetchCsv } from './_lib';

const CSV_URL = 'https://example.invalid/placeholder/cea-state-per-capita-consumption.csv'; // TODO

const EXPECTED_COLUMNS = ['state_code', 'state_name', 'fiscal_year', 'per_capita_kwh'] as const;

export async function ingestElectricity(): Promise<void> {
  const csv = await fetchCsv(CSV_URL, {
    expectedColumns: [...EXPECTED_COLUMNS],
    maxBytes: 10 * 1024 * 1024,
  });

  console.log(`[ingest:electricity] ${csv.rows.length} rows, ${csv.bytesRead} bytes, sha256 ${csv.sha256}`);
  throw new Error('ingestElectricity() is a template; set CSV_URL first');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingestElectricity().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

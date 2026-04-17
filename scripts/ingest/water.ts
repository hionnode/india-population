/**
 * Water (CWMI) ingest script — Phase 1 Commit 7.
 *
 * STATUS: TEMPLATE. The CWMI 2.0 report is published as PDF + tables
 * embedded in state-wise annexures. When a CSV export is available (or
 * a future NITI Aayog refresh publishes CSVs), set CSV_URL and run:
 *   npm run ingest:water
 *
 * Until then src/data/water.ts carries hand-curated starter values.
 */

import { fetchCsv } from './_lib';

const CSV_URL = 'https://example.invalid/placeholder/niti-aayog-cwmi-state-scores.csv'; // TODO

const EXPECTED_COLUMNS = ['state_code', 'state_name', 'group', 'fiscal_year', 'cwmi_score'] as const;

export async function ingestWater(): Promise<void> {
  const csv = await fetchCsv(CSV_URL, {
    expectedColumns: [...EXPECTED_COLUMNS],
    maxBytes: 10 * 1024 * 1024,
  });

  console.log(`[ingest:water] ${csv.rows.length} rows, ${csv.bytesRead} bytes, sha256 ${csv.sha256}`);
  throw new Error('ingestWater() is a template; set CSV_URL first');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  ingestWater().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

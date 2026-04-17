/**
 * Ingest library — build-time CSV/JSON fetcher with 7 defenses.
 *
 * Author-run only (Decision #30): `npm run ingest:<name>` invokes the
 * script on Chinmay's machine; the script writes the generated TS file
 * and commits it. CI never fetches upstream. `source.refreshed` is
 * stamped at the author's run time.
 *
 * Defenses every fetch applies (rev 2b Decision #35):
 *   1. HTTP status 200 required (reject error pages)
 *   2. Content-Type check (reject HTML masquerading as CSV)
 *   3. BOM strip (handle UTF-8 BOM from data.gov.in)
 *   4. gzip/deflate transparent (Node fetch handles Accept-Encoding)
 *   5. 100 MB body cap (stop runaway dumps)
 *   6. Column headers EXACT-match (reject silent schema drift)
 *   7. SHA256 raw-bytes hash (pin exact input in source.sha256)
 *
 * Errors follow the locked format (Decision #19):
 *   <problem>
 *     cause: <root cause>
 *     fix:   <what the author should do>
 *     see:   <docs anchor>
 */

import { createHash } from 'node:crypto';

// ——————————————————————————————————————————————
// Types
// ——————————————————————————————————————————————

export interface FetchCsvOptions {
  /** All of these columns must be present in the CSV header. Reject on drift. */
  readonly expectedColumns: readonly string[];
  /** Maximum permitted response body size. Default 100 MB. */
  readonly maxBytes?: number;
  /** Override for tests — return a canned Response instead of hitting network. */
  readonly fetchImpl?: typeof fetch;
}

export interface CsvResult {
  /** Parsed rows — one per data line, keyed by column name. */
  readonly rows: ReadonlyArray<Readonly<Record<string, string>>>;
  /** SHA-256 of the raw bytes (before BOM strip) for source.sha256. */
  readonly sha256: string;
  /** Timestamp of this ingest run (ISO 8601) for source.refreshed. */
  readonly refreshed: string;
  /** Body size in bytes. Surfaced so callers can log it. */
  readonly bytesRead: number;
}

export interface IngestError {
  readonly problem: string;
  readonly cause: string;
  readonly fix: string;
  readonly docs: string;
}

// ——————————————————————————————————————————————
// Public API
// ——————————————————————————————————————————————

export async function fetchCsv(url: string, opts: FetchCsvOptions): Promise<CsvResult> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const maxBytes = opts.maxBytes ?? 100 * 1024 * 1024;

  const response = await fetchImpl(url);

  if (response.status !== 200) {
    throw toError({
      problem: `CSV fetch from ${url} returned HTTP ${response.status}`,
      cause: 'A successful ingest requires HTTP 200; upstream likely returned an error page',
      fix: 'Verify the URL is current on data.gov.in, check for auth/rate-limit headers',
      docs: 'docs/workshop/add-dataset.md#http-errors',
    });
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!isCsvContentType(contentType)) {
    throw toError({
      problem: `CSV fetch from ${url} returned Content-Type '${contentType}'`,
      cause: 'Response is not CSV (often means the server returned an HTML error page with 200)',
      fix: 'Open the URL in a browser; if it shows HTML, the data has moved. If Content-Type is genuinely CSV with a non-standard media-type, adjust isCsvContentType()',
      docs: 'docs/workshop/add-dataset.md#content-type',
    });
  }

  const buf = await response.arrayBuffer();
  const bytes = new Uint8Array(buf);

  if (bytes.byteLength > maxBytes) {
    throw toError({
      problem: `CSV body from ${url} is ${bytes.byteLength} bytes, over cap of ${maxBytes}`,
      cause: 'Body exceeded the safety cap; likely a mis-linked dump file',
      fix: 'Confirm this is the intended file; if so, raise maxBytes explicitly in the ingest script',
      docs: 'docs/workshop/add-dataset.md#size-cap',
    });
  }

  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const text = decodeAndStripBom(bytes);
  const rows = parseCsv(text, opts.expectedColumns, url);

  return {
    rows,
    sha256,
    refreshed: new Date().toISOString(),
    bytesRead: bytes.byteLength,
  };
}

// ——————————————————————————————————————————————
// CSV parsing — deliberately minimal
// ——————————————————————————————————————————————
//
// Only supports:
//   - comma separator
//   - double-quote optional wrapping, with "" for embedded double quotes
//   - \r\n or \n line endings
//
// Rejects on missing expected columns. Extra columns pass through.
//
// This is NOT a full RFC 4180 parser. If a source needs multiline-cells
// or semicolon delimiters, wrap the dataset-specific ingest script with
// a pre-processor instead of extending this.

export function parseCsv(
  text: string,
  expectedColumns: readonly string[],
  urlForError: string,
): ReadonlyArray<Readonly<Record<string, string>>> {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    throw toError({
      problem: `CSV from ${urlForError} has fewer than 2 lines (header + at least 1 row)`,
      cause: 'Empty response body or header-only response',
      fix: 'Inspect the URL in a browser to confirm it serves data',
      docs: 'docs/workshop/add-dataset.md#empty-csv',
    });
  }

  const header = splitCsvLine(lines[0]!).map((h) => h.trim());
  const missing = expectedColumns.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    throw toError({
      problem: `CSV header from ${urlForError} is missing columns: ${missing.join(', ')}`,
      cause: 'Upstream column names drifted or the ingest script has a stale expectedColumns list',
      fix: `Open the URL; inspect the header; update expectedColumns or remap to the new names. Observed header: [${header.join(', ')}]`,
      docs: 'docs/workshop/add-dataset.md#column-drift',
    });
  }

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    const row: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) {
      row[header[j]!] = (cells[j] ?? '').trim();
    }
    rows.push(row);
  }

  return rows;
}

// ——————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————

const BOM = 0xfeff;

export function decodeAndStripBom(bytes: Uint8Array): string {
  const s = new TextDecoder('utf-8').decode(bytes);
  return s.charCodeAt(0) === BOM ? s.slice(1) : s;
}

export function isCsvContentType(contentType: string): boolean {
  const ct = contentType.toLowerCase();
  return (
    ct.startsWith('text/csv') ||
    ct.startsWith('application/csv') ||
    ct.startsWith('text/plain') ||
    ct.startsWith('application/octet-stream') // some data.gov.in endpoints use this
  );
}

/** Split a single CSV line, honoring double-quoted cells with "" escapes. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else if (ch === '"' && cur === '') {
      inQuotes = true;
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function toError(e: IngestError): Error {
  return new Error(
    `${e.problem}\n  cause: ${e.cause}\n  fix:   ${e.fix}\n  see:   ${e.docs}`,
  );
}

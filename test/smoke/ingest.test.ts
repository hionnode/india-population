import { describe, it, expect } from 'vitest';
import {
  fetchCsv,
  parseCsv,
  splitCsvLine,
  decodeAndStripBom,
  isCsvContentType,
} from '../../scripts/ingest/_lib';

// Fake fetch that returns a canned Response.
function cannedFetch(body: string | Uint8Array, headers: Record<string, string>, status = 200) {
  return async (_url: string): Promise<Response> => {
    const bytes = typeof body === 'string' ? new TextEncoder().encode(body) : body;
    return new Response(bytes, {
      status,
      headers: { 'content-type': 'text/csv', ...headers },
    });
  };
}

describe('ingest _lib — splitCsvLine', () => {
  it('splits simple unquoted', () => {
    expect(splitCsvLine('a,b,c')).toEqual(['a', 'b', 'c']);
  });
  it('handles quoted cells with commas', () => {
    expect(splitCsvLine('"hello, world",b,c')).toEqual(['hello, world', 'b', 'c']);
  });
  it('handles escaped double-quotes', () => {
    expect(splitCsvLine('"he said ""hi""",x')).toEqual(['he said "hi"', 'x']);
  });
  it('emits empty strings for trailing commas', () => {
    expect(splitCsvLine('a,,c,')).toEqual(['a', '', 'c', '']);
  });
});

describe('ingest _lib — decodeAndStripBom', () => {
  it('strips UTF-8 BOM', () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf, 0x68, 0x69]); // BOM + 'hi'
    expect(decodeAndStripBom(bom)).toBe('hi');
  });
  it('leaves BOM-less input alone', () => {
    expect(decodeAndStripBom(new TextEncoder().encode('hi'))).toBe('hi');
  });
});

describe('ingest _lib — isCsvContentType', () => {
  it('accepts text/csv and charset variants', () => {
    expect(isCsvContentType('text/csv')).toBe(true);
    expect(isCsvContentType('text/csv; charset=utf-8')).toBe(true);
    expect(isCsvContentType('TEXT/CSV')).toBe(true);
  });
  it('accepts common data.gov.in media types', () => {
    expect(isCsvContentType('application/csv')).toBe(true);
    expect(isCsvContentType('application/octet-stream')).toBe(true);
    expect(isCsvContentType('text/plain')).toBe(true);
  });
  it('rejects HTML (error-page masquerade)', () => {
    expect(isCsvContentType('text/html; charset=utf-8')).toBe(false);
  });
});

describe('ingest _lib — parseCsv', () => {
  it('parses header + rows by name', () => {
    const rows = parseCsv('state,year,pop\nUP,2011,199.8\nMH,2011,112.4', ['state', 'year', 'pop'], 'mem://test');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ state: 'UP', year: '2011', pop: '199.8' });
  });

  it('rejects missing expected columns with the locked error format', () => {
    try {
      parseCsv('state,year\nUP,2011', ['state', 'year', 'pop'], 'mem://test');
      throw new Error('should have thrown');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/missing columns: pop/);
      expect(msg).toMatch(/cause:/);
      expect(msg).toMatch(/fix:/);
    }
  });

  it('tolerates extra upstream columns', () => {
    const rows = parseCsv('state,year,pop,source_note\nUP,2011,199.8,census', ['state', 'year', 'pop'], 'mem://test');
    expect(rows[0]?.source_note).toBe('census');
  });

  it('rejects header-only CSV', () => {
    try {
      parseCsv('state,year,pop', ['state', 'year', 'pop'], 'mem://test');
      throw new Error('should have thrown');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/fewer than 2 lines/);
    }
  });
});

describe('ingest _lib — fetchCsv end-to-end', () => {
  it('happy path', async () => {
    const res = await fetchCsv('mem://demo', {
      expectedColumns: ['state', 'year'],
      fetchImpl: cannedFetch('state,year\nUP,2011\nMH,2011', {}),
    });
    expect(res.rows).toHaveLength(2);
    expect(res.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(res.bytesRead).toBeGreaterThan(0);
    expect(res.refreshed).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('rejects non-200 with problem|cause|fix|see', async () => {
    try {
      await fetchCsv('mem://404', {
        expectedColumns: ['x'],
        fetchImpl: cannedFetch('not found', {}, 404),
      });
      throw new Error('should have thrown');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/HTTP 404/);
      expect(msg).toMatch(/fix:/);
      expect(msg).toMatch(/see:/);
    }
  });

  it('rejects HTML masquerading as CSV', async () => {
    try {
      await fetchCsv('mem://html', {
        expectedColumns: ['x'],
        fetchImpl: cannedFetch('<html>error</html>', { 'content-type': 'text/html' }),
      });
      throw new Error('should have thrown');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/text\/html/);
      expect(msg).toMatch(/HTML error page/);
    }
  });

  it('enforces maxBytes cap', async () => {
    const big = 'a,b\n' + '1,2\n'.repeat(100);
    try {
      await fetchCsv('mem://big', {
        expectedColumns: ['a', 'b'],
        maxBytes: 50,
        fetchImpl: cannedFetch(big, {}),
      });
      throw new Error('should have thrown');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/over cap of 50/);
    }
  });

  it('strips BOM before parsing', async () => {
    const withBom = new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode('a,b\n1,2')]);
    const res = await fetchCsv('mem://bom', {
      expectedColumns: ['a', 'b'],
      fetchImpl: cannedFetch(withBom, {}),
    });
    expect(res.rows[0]).toEqual({ a: '1', b: '2' });
  });
});

import { describe, it, expect } from 'vitest';
import {
  parseLetterheadFromUrl,
  canonicalizeLetterheadParams,
  LETTERHEAD_MAX_LEN,
  LETTERHEAD_DEFAULT,
} from '../../src/scripts/studio';

// Guards ISSUE-006 — letterhead URL round-trip + length clamp. The URL
// bypasses the input's DOM maxlength attribute, so every parse has to
// clamp defensively; empty fields round-trip as the empty string, not
// as "lh_title=" query-string noise.

describe('parseLetterheadFromUrl — clamps every field to its per-field cap', () => {
  it('round-trips a fully populated letterhead', () => {
    const url = new URL('https://example.com/tools/studio?lh_title=State%20report&lh_sub=%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%8D%E0%A4%AF&lh_by=by%20CN&lh_note=Draft');
    const lh = parseLetterheadFromUrl(url);
    expect(lh.title).toBe('State report');
    expect(lh.subtitle).toBe('राज्य');
    expect(lh.byline).toBe('by CN');
    expect(lh.note).toBe('Draft');
  });

  it('returns empty strings for every missing field', () => {
    const url = new URL('https://example.com/tools/studio');
    expect(parseLetterheadFromUrl(url)).toEqual(LETTERHEAD_DEFAULT);
  });

  it('clamps title to 80 chars even if the URL carries more', () => {
    const huge = 'x'.repeat(200);
    const url = new URL(`https://example.com/tools/studio?lh_title=${huge}`);
    const lh = parseLetterheadFromUrl(url);
    expect(lh.title.length).toBe(LETTERHEAD_MAX_LEN.title);
    expect(lh.title).toBe('x'.repeat(80));
  });

  it('clamps note to 480 chars (the longer-form field)', () => {
    const huge = 'y'.repeat(1000);
    const url = new URL(`https://example.com/tools/studio?lh_note=${huge}`);
    const lh = parseLetterheadFromUrl(url);
    expect(lh.note.length).toBe(LETTERHEAD_MAX_LEN.note);
  });
});

describe('canonicalizeLetterheadParams — empty fields leave no URL noise', () => {
  it('writes non-empty fields, deletes empty fields', () => {
    const params = new URLSearchParams('lh_sub=leftover&preset=compare');
    canonicalizeLetterheadParams(params, { title: 'New', subtitle: '', byline: '', note: '' });
    expect(params.get('lh_title')).toBe('New');
    expect(params.has('lh_sub')).toBe(false);   // deleted — empty
    expect(params.has('lh_by')).toBe(false);
    expect(params.has('lh_note')).toBe(false);
    expect(params.get('preset')).toBe('compare');
  });

  it('clamps on write too (guard against programmatic write of giant strings)', () => {
    const params = new URLSearchParams();
    canonicalizeLetterheadParams(params, {
      title: 'a'.repeat(200),
      subtitle: '',
      byline: '',
      note: 'b'.repeat(9999),
    });
    expect(params.get('lh_title')?.length).toBe(LETTERHEAD_MAX_LEN.title);
    expect(params.get('lh_note')?.length).toBe(LETTERHEAD_MAX_LEN.note);
  });

  it('parse ∘ canonicalize round-trip is identity for clamped input', () => {
    const original = { title: 'Report A', subtitle: 'तुलना', byline: 'CN', note: 'edge notes' };
    const params = new URLSearchParams();
    canonicalizeLetterheadParams(params, original);
    const url = new URL(`https://example.com/tools/studio?${params.toString()}`);
    expect(parseLetterheadFromUrl(url)).toEqual(original);
  });
});

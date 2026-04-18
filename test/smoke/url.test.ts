import { describe, it, expect } from 'vitest';
import { canonicalizeUrlParams, parseFromUrl } from '../../src/scripts/studio';
import type { StudioState } from '../../src/scripts/studio';

// Guards ISSUE-007 (canonicalize URL params) and the v=1 shim from the
// Phase 1 plan. Two URLs that describe the same state must serialize to the
// same query string — scramble order in, canonical order out — and legacy
// (pre-v=1) URLs must continue to parse via the base defaults.

const state: StudioState = {
  preset: 'line',
  dataset: 'state',
  metric: 'growthPct',
  entities: ['UP', 'TN', 'KL'],
  from: 1901,
  to: 2011,
};

describe('canonicalizeUrlParams — URL ordering is stable', () => {
  it('emits keys in the canonical order (preset,dataset,metric,from,to,entities,v)', () => {
    const params = new URLSearchParams('');
    canonicalizeUrlParams(params, state);
    const keys = [...params.keys()];
    expect(keys).toEqual(['preset', 'dataset', 'metric', 'from', 'to', 'entities', 'v']);
  });

  it('produces byte-identical output for scrambled input vs a fresh URL', () => {
    const scrambled = new URLSearchParams('v=1&entities=UP,TN,KL&to=2011&metric=growthPct&from=1901&dataset=state&preset=line');
    const fresh = new URLSearchParams('');
    canonicalizeUrlParams(scrambled, state);
    canonicalizeUrlParams(fresh, state);
    expect(scrambled.toString()).toBe(fresh.toString());
  });

  it('includes v=1 for every canonicalized URL', () => {
    const params = new URLSearchParams('');
    canonicalizeUrlParams(params, state);
    expect(params.get('v')).toBe('1');
  });

  it('preserves unrelated host-page params (e.g. a marketing utm tag)', () => {
    const params = new URLSearchParams('utm_source=essay&preset=bar');
    canonicalizeUrlParams(params, state);
    expect(params.get('utm_source')).toBe('essay');
    expect(params.get('preset')).toBe('line');
  });
});

describe('parseFromUrl — legacy + v=1 tolerance', () => {
  it('round-trips a fully-specified v=1 URL back to the same state', () => {
    const params = new URLSearchParams('');
    canonicalizeUrlParams(params, state);
    const url = new URL(`https://example.com/tools/studio?${params.toString()}`);
    const parsed = parseFromUrl(url);
    expect(parsed).toEqual(state);
  });

  it('parses a pre-v=1 (legacy) URL without a v param', () => {
    const url = new URL('https://example.com/tools/studio?preset=line&dataset=state&metric=growthPct&entities=UP,TN,KL&from=1901&to=2011');
    const parsed = parseFromUrl(url);
    expect(parsed).toEqual(state);
  });

  it('tolerates an unknown future v value by falling back to base defaults', () => {
    // Shape the v=99 URL so the reader sees something legible rather than an
    // error — the plan explicitly calls out "v=1 shim with v=0 fallback" as
    // the backwards-compat minimum standard.
    const url = new URL('https://example.com/tools/studio?v=99&preset=line');
    const parsed = parseFromUrl(url);
    expect(parsed.preset).toBe('line');
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// These tests guard the two defenses landed in Phase 1.5 (ISSUE-009):
//   1. The Map SVG has a root fill attribute so orphaned paths inherit gray
//      instead of the black SVG default.
//   2. GEO_NAME_TO_CODE values are unique — no two feature names map to the
//      same entity code. (Flipped on in Commit 12 after Telangana split.)

const repoRoot = resolve(__dirname, '../..');

describe('MapStudio.astro — SVG root fill defense (Commit 11)', () => {
  it('root svg has fill="#d7cdb5" so orphan paths inherit gray, not black', () => {
    const src = readFileSync(
      resolve(repoRoot, 'src/components/tools/MapStudio.astro'),
      'utf8',
    );
    // Look for the root <svg id="map-svg" ...> tag and confirm fill="#d7cdb5" is on it.
    const rootSvgMatch = src.match(/<svg\s+id="map-svg"[^>]*>/);
    expect(rootSvgMatch, 'root <svg id="map-svg"> must exist').toBeTruthy();
    const rootSvgTag = rootSvgMatch![0];
    expect(
      rootSvgTag,
      'root <svg> must carry fill="#d7cdb5" to defend against orphan-path black rendering (ISSUE-009)',
    ).toMatch(/fill="#d7cdb5"/);
  });
});

describe('GEO_NAME_TO_CODE — uniqueness (Commit 12 landed)', () => {
  it('every value in GEO_NAME_TO_CODE is unique (no pathsByCode collisions)', async () => {
    const { GEO_NAME_TO_CODE } = await import('../../src/data/india-geo');
    const values = Object.values(GEO_NAME_TO_CODE);
    const uniq = new Set(values);
    const duplicates = values.filter((v, i) => values.indexOf(v) !== i);
    expect(
      uniq.size,
      `Duplicate codes found: ${[...new Set(duplicates)].join(', ')}. ` +
        'Every (feature-name → code) mapping must be a bijection onto the code space. ' +
        'A duplicate causes MapStudio to leave one SVG path unattributed (ISSUE-009 — ' +
        'the AP/Telangana collision that rendered one state black on every map view).',
    ).toBe(values.length);
  });

  it('Andhra Pradesh and Telangana now map to distinct codes', async () => {
    const { GEO_NAME_TO_CODE } = await import('../../src/data/india-geo');
    expect(GEO_NAME_TO_CODE['Andhra Pradesh']).toBe('AP');
    expect(GEO_NAME_TO_CODE['Telangana']).toBe('TS');
  });
});

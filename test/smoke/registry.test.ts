import { describe, it, expect } from 'vitest';
import { listDatasets, getDatasetMeta, registerDataset, formatError } from '../../src/data/datasets';
import { listLayers, getLayer, registerLayer } from '../../src/data/geo-layers';
import type { DatasetMeta, GeoLayerConfig } from '../../src/scripts/registry-types';

describe('dataset registry — smoke', () => {
  it('registers the 3 seed datasets with stable ids', () => {
    const ids = listDatasets().map((d) => d.id);
    expect(ids).toEqual(expect.arrayContaining(['census', 'state-census', 'loksabha']));
  });

  it('every seed dataset declares timeAxis.ticks', () => {
    for (const d of listDatasets()) {
      expect(d.timeAxis.ticks.length).toBeGreaterThan(0);
    }
  });

  it('every seed dataset declares units + source', () => {
    for (const d of listDatasets()) {
      expect(Object.keys(d.units).length).toBeGreaterThan(0);
      expect(d.source.url).toBeTruthy();
      expect(d.source.license).toBeTruthy();
    }
  });

  it('rejects duplicate registration', () => {
    const fake: DatasetMeta = {
      schemaVersion: 1,
      id: 'census', // collides with seed
      label: 'dup',
      source: { url: 'x', license: 'y', refreshed: '2026-04-17', transformations: [] },
      timeAxis: { kind: 'annual', ticks: [2000] },
      units: { x: 'x' },
    };
    expect(() => registerDataset(fake)).toThrow(/registered twice/);
  });

  it('rejects missing timeAxis.ticks with locked error format', () => {
    const bad: DatasetMeta = {
      schemaVersion: 1,
      id: 'bad-no-ticks',
      label: 'x',
      source: { url: 'x', license: 'y', refreshed: '2026-04-17', transformations: [] },
      timeAxis: { kind: 'annual', ticks: [] },
      units: {},
    };
    try {
      registerDataset(bad);
      throw new Error('expected registration to fail');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/no timeAxis\.ticks/);
      expect(msg).toMatch(/cause:/);
      expect(msg).toMatch(/fix:/);
      expect(msg).toMatch(/see:/);
    }
  });
});

describe('geo-layer registry — smoke', () => {
  it('registers the seed state layer', () => {
    const state = getLayer('state');
    expect(state).toBeDefined();
    expect(state?.label).toBe('State boundaries');
    expect(state?.geojsonUrl).toBe('/india-states.geojson');
    expect(state?.byteSize).toBeGreaterThan(0);
  });

  it('enforces byteSize > 0', () => {
    const bad: GeoLayerConfig = {
      schemaVersion: 1,
      id: 'missing-size',
      label: 'x',
      geojsonUrl: '/x.geojson',
      featureKey: 'st_nm',
      codeMap: {},
      availableFor: [],
      byteSize: 0,
    };
    expect(() => registerLayer(bad)).toThrow(/byteSize/);
  });
});

describe('error format helper', () => {
  it('produces the 4-line locked format', () => {
    const s = formatError({
      problem: 'Something broke',
      cause: 'Because X',
      fix: 'Do Y',
      docs: 'docs/workshop/add-dataset.md#x',
    });
    expect(s).toContain('Something broke');
    expect(s).toContain('cause: Because X');
    expect(s).toContain('fix:   Do Y');
    expect(s).toContain('see:   docs/workshop/add-dataset.md#x');
  });
});

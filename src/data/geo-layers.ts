/**
 * Geo-layer registry (Phase 1 seed).
 *
 * One layer per geo resolution (state / district / LS 2024 / eventual VS).
 * Each layer fetches on demand in MapStudio/CompareStudio (Decision #29,
 * lazy-load required because district ~8 MB + LS ~4 MB).
 *
 * The state layer is eager-loaded today (37 KB; negligible). District +
 * LS 2024 land in Phase 1 Commit 8 with SHA-pinned upstream references.
 */

import type { GeoLayerConfig, GeoLayerId } from '../scripts/registry-types';
import { GEO_NAME_TO_CODE } from './india-geo';
import { formatError } from './datasets';

const registry = new Map<GeoLayerId, GeoLayerConfig>();

export function registerLayer(layer: GeoLayerConfig): void {
  assertValidLayer(layer);
  if (registry.has(layer.id)) {
    throw new Error(formatError({
      problem: `Geo layer '${layer.id}' registered twice`,
      cause: 'Two registerLayer calls used the same layer id',
      fix: 'Give this layer a unique id or remove the duplicate registration',
      docs: 'docs/workshop/add-geo.md#unique-ids',
    }));
  }
  registry.set(layer.id, layer);
}

export function getLayer(id: GeoLayerId): GeoLayerConfig | undefined {
  return registry.get(id);
}

export function listLayers(): readonly GeoLayerConfig[] {
  return Array.from(registry.values());
}

// ——————————————————————————————————————————————
// Seed: state boundaries (existing, eager-loaded)
// ——————————————————————————————————————————————

registerLayer({
  schemaVersion: 1,
  id: 'state',
  label: 'State boundaries',
  geojsonUrl: '/india-states.geojson',
  featureKey: 'st_nm',
  codeMap: GEO_NAME_TO_CODE,
  availableFor: ['state-census', 'loksabha'],
  byteSize: 37_982, // measured from dist/ at commit 49e44d7 (bundle baseline)
  upstream: {
    repo: 'https://github.com/udit-001/india-maps-data',
    commit: 'main', // TODO: pin specific commit SHA at next refresh
  },
});

// ——————————————————————————————————————————————
// Validator (same error format as datasets)
// ——————————————————————————————————————————————

function assertValidLayer(layer: GeoLayerConfig): void {
  if (layer.schemaVersion !== 1) {
    throw new Error(formatError({
      problem: `Geo layer '${layer.id}' has schemaVersion ${layer.schemaVersion}`,
      cause: 'Only schemaVersion 1 is supported',
      fix: 'Migrate the layer to schemaVersion 1',
      docs: 'docs/workshop/add-geo.md#schemaversion',
    }));
  }
  if (!layer.id || !layer.geojsonUrl || !layer.featureKey) {
    throw new Error(formatError({
      problem: `Geo layer missing required field`,
      cause: 'id, geojsonUrl, and featureKey are all required',
      fix: 'Fill in all three fields on registerLayer({...})',
      docs: 'docs/workshop/add-geo.md',
    }));
  }
  if (!Number.isFinite(layer.byteSize) || layer.byteSize <= 0) {
    throw new Error(formatError({
      problem: `Geo layer '${layer.id}' has no byteSize`,
      cause: 'byteSize is used for the loading skeleton budget and must be > 0',
      fix: 'Measure the committed file size and set byteSize',
      docs: 'docs/workshop/add-geo.md#bytesize',
    }));
  }
}

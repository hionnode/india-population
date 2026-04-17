/**
 * Dataset registry (Phase 1 seed).
 *
 * Only meta is registered at module import — value closures live in the
 * values files and are wired by the studios as they pull the dataset by id.
 * This keeps /data (which imports just this file) from pulling every
 * dataset body into its bundle (Decision #32).
 *
 * Phase 2 wires this registry into studio.ts so the sidebar populates from
 * the registry instead of today's hardcoded radio labels.
 */

import type { DatasetId, DatasetMeta } from '../scripts/registry-types';
import { censusMeta } from './census.meta';
import { stateCensusMeta } from './state-census.meta';
import { loksabhaMeta } from './loksabha.meta';
import { gdpMeta } from './gdp.meta';
import { electricityMeta } from './electricity.meta';

const registry = new Map<DatasetId, DatasetMeta>();

export function registerDataset(meta: DatasetMeta): void {
  assertValidDatasetMeta(meta);
  if (registry.has(meta.id)) {
    throw new Error(formatError({
      problem: `Dataset '${meta.id}' registered twice`,
      cause: 'Two different register calls used the same dataset id',
      fix: 'Give this dataset a unique id or delete the duplicate registration',
      docs: 'docs/workshop/add-dataset.md#unique-ids',
    }));
  }
  registry.set(meta.id, meta);
}

export function getDatasetMeta(id: DatasetId): DatasetMeta | undefined {
  return registry.get(id);
}

export function listDatasets(): readonly DatasetMeta[] {
  return Array.from(registry.values());
}

// ——————————————————————————————————————————————
// Seed registrations (executed at module import)
// ——————————————————————————————————————————————

registerDataset(censusMeta);
registerDataset(stateCensusMeta);
registerDataset(loksabhaMeta);
registerDataset(gdpMeta);
registerDataset(electricityMeta);

// ——————————————————————————————————————————————
// Validator (Decision #19 error format)
// ——————————————————————————————————————————————

function assertValidDatasetMeta(meta: DatasetMeta): void {
  if (meta.schemaVersion !== 1) {
    throw new Error(formatError({
      problem: `Dataset '${meta.id}' has schemaVersion ${meta.schemaVersion}`,
      cause: 'Only schemaVersion 1 is supported in the current registry',
      fix: 'Migrate the dataset to schemaVersion 1 OR wait for the Phase 2 migration adapter',
      docs: 'docs/workshop/add-dataset.md#schemaversion',
    }));
  }
  if (!meta.id) {
    throw new Error(formatError({
      problem: 'Dataset meta missing id',
      cause: 'A DatasetMeta was passed without a non-empty id field',
      fix: "Set a short stable id like 'literacy' or 'gdp' on the meta object",
      docs: 'docs/workshop/add-dataset.md#id',
    }));
  }
  if (!meta.timeAxis || !Array.isArray(meta.timeAxis.ticks) || meta.timeAxis.ticks.length === 0) {
    throw new Error(formatError({
      problem: `Dataset '${meta.id}' has no timeAxis.ticks`,
      cause: 'timeAxis.ticks is required and must be a non-empty array',
      fix: 'Set timeAxis to { kind: "decadal" | "annual" | "quinquennial" | "custom", ticks: [...] }',
      docs: 'docs/workshop/add-dataset.md#timeaxis',
    }));
  }
  if (!meta.source?.url || !meta.source?.license) {
    throw new Error(formatError({
      problem: `Dataset '${meta.id}' missing source.url or source.license`,
      cause: 'Every registered dataset must declare its upstream source and license',
      fix: "Add source: { url, license, refreshed, transformations: [...] }",
      docs: 'docs/workshop/add-dataset.md#source',
    }));
  }
}

export interface FormattedErrorArgs {
  readonly problem: string;
  readonly cause: string;
  readonly fix: string;
  readonly docs: string;
}

export function formatError(args: FormattedErrorArgs): string {
  return `${args.problem}\n  cause: ${args.cause}\n  fix:   ${args.fix}\n  see:   ${args.docs}`;
}

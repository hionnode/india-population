/**
 * Workshop dataset & geo-layer registry types.
 *
 * Phase 1 shape per the rev 2b plan (post /plan-eng-review):
 *   /Users/chinmay/.claude/plans/i-have-answered-the-stateful-hennessy.md
 *
 * Two important splits encoded here:
 *
 *   1. DatasetMeta vs DatasetConfig.
 *      Meta is lightweight (label + source + timeAxis + units) for the
 *      /data inventory page. Config extends Meta with entityCatalog and
 *      metricValue closures (the heavy stuff). /data imports only .meta
 *      files; studios import the full config via the registry.
 *
 *   2. schemaVersion: 1.
 *      Migration semantics at v2 are deferred to Phase 2 kickoff; today
 *      we only accept v=1 literal and plan to add an adapter when the
 *      first breaking change lands.
 */

// ——————————————————————————————————————————————
// Ids
// ——————————————————————————————————————————————

export type DatasetId = string;
export type MetricId = string;
export type EntityId = string;
export type GeoLayerId = string;

// ——————————————————————————————————————————————
// Time axis primitive (Decision #20)
// ——————————————————————————————————————————————

export type TimeAxis =
  | { kind: 'decadal'; ticks: readonly number[] }
  | { kind: 'annual'; ticks: readonly number[] }
  | { kind: 'quinquennial'; ticks: readonly number[] }
  | { kind: 'custom'; ticks: readonly number[]; format?: (n: number) => string };

// ——————————————————————————————————————————————
// Source attribution + license compliance (Decision #35)
// ——————————————————————————————————————————————

export interface DatasetSource {
  readonly url: string;              // canonical upstream URL
  readonly license: string;          // e.g. 'CC-BY 4.0', 'Government of India OGDL'
  readonly refreshed: string;        // ISO 8601, author-run timestamp
  readonly sha256?: string;          // raw-bytes hash of ingested file; optional for hand-curated
  readonly transformations: readonly string[]; // CC-BY 'changes made' list
}

// ——————————————————————————————————————————————
// Entity reference returned by entityCatalog()
// ——————————————————————————————————————————————

export interface EntityRef<E extends EntityId = EntityId> {
  readonly code: E;
  readonly label: string;
  readonly labelHi?: string;
  readonly group?: string;           // e.g. region for states
}

// ——————————————————————————————————————————————
// Value return shape (Decision #31 — preserves estimated flag)
// ——————————————————————————————————————————————

export interface MetricValue {
  readonly v: number;
  readonly estimated?: boolean;      // e.g. CENSUS 1881/1891 reconstructed
  readonly note?: string;            // hover tooltip, e.g. 'reconstructed from British-India totals'
}

// ——————————————————————————————————————————————
// DatasetMeta — for /data inventory page
// ——————————————————————————————————————————————

export interface DatasetMeta {
  readonly schemaVersion: 1;
  readonly id: DatasetId;
  readonly label: string;            // e.g. 'State · 36 rows'
  readonly description?: string;     // one-liner for /data cards
  readonly source: DatasetSource;
  readonly timeAxis: TimeAxis;
  readonly units: Readonly<Record<MetricId, string>>; // per-dataset units (Decision #40)
  readonly compatibleMetrics?: readonly MetricId[];
}

// ——————————————————————————————————————————————
// DatasetConfig — full shape for the studios
// ——————————————————————————————————————————————

export interface DatasetConfig<E extends EntityId = EntityId, M extends MetricId = MetricId>
  extends DatasetMeta {
  /** Pure, cheap, memoizable. Called at validator time AND picker render time. */
  readonly entityCatalog?: () => readonly EntityRef<E>[];
  readonly metricValue: (entity: E | null, tick: number, metric: M) => MetricValue | null;
}

// ——————————————————————————————————————————————
// GeoLayerConfig (Decision #36: provenance pin)
// ——————————————————————————————————————————————

export interface GeoLayerConfig {
  readonly schemaVersion: 1;
  readonly id: GeoLayerId;
  readonly label: string;
  readonly geojsonUrl: string;                 // local path e.g. '/geo/india-ls-2024.geojson'
  readonly featureKey: string | readonly string[]; // LS2024 needs PC_NAME + ST_NAME
  readonly codeMap: Readonly<Record<string, string>>; // feature prop → entity code
  readonly availableFor: readonly DatasetId[];
  readonly byteSize: number;                    // required; loading skeleton budget
  readonly upstream?: { readonly repo: string; readonly commit: string }; // vendored provenance
}

// THE WORKSHOP · Studio — shared client state + URL sync.
// Runs on /tools/studio. All four chart renderers listen for `studio:change`
// and update the currently-visible chart panel.

export type Preset = 'bar' | 'line' | 'map' | 'compare';
export type Dataset = 'region' | 'state' | 'loksabha';
export type Metric =
  | 'population'
  | 'growthPct'
  | 'indexed1901'
  | 'popPerSeat'
  | 'seats'
  | 'scenario2Delta';

export interface StudioState {
  preset: Preset;
  dataset: Dataset;
  metric: Metric;
  entities: string[];
  from: number;
  to: number;
}

export const CENSUS_YEARS = [
  1881, 1891, 1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011,
] as const;

export const STATE_YEARS = [
  1901, 1911, 1921, 1931, 1941, 1951, 1961, 1971, 1981, 1991, 2001, 2011,
] as const;

const DEFAULTS: Record<Preset, StudioState> = {
  bar: {
    preset: 'bar',
    dataset: 'state',
    metric: 'population',
    entities: ['UP', 'MH', 'BR', 'WB', 'AP', 'MP', 'TN', 'RJ'],
    from: 2011,
    to: 2011,
  },
  line: {
    preset: 'line',
    dataset: 'region',
    metric: 'population',
    entities: ['East', 'West', 'North', 'South'],
    from: 1881,
    to: 2011,
  },
  map: {
    preset: 'map',
    dataset: 'loksabha',
    metric: 'population',
    entities: [],
    from: 2011,
    to: 2011,
  },
  compare: {
    preset: 'compare',
    dataset: 'state',
    metric: 'population',
    entities: ['UP', 'KL', 'MH'],
    from: 1901,
    to: 2011,
  },
};

export function defaultsFor(preset: Preset): StudioState {
  return { ...DEFAULTS[preset], entities: [...DEFAULTS[preset].entities] };
}

// ——————————————————————————————————————————————
// URL ⟷ state
// ——————————————————————————————————————————————

export function parseFromUrl(url: URL): StudioState {
  const preset = (url.searchParams.get('preset') ?? 'bar') as Preset;
  const base = defaultsFor(presetOrDefault(preset));
  const ds = url.searchParams.get('dataset');
  const metric = url.searchParams.get('metric');
  const entities = url.searchParams.get('entities');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  return {
    preset: base.preset,
    dataset: (ds as Dataset) ?? base.dataset,
    metric: (metric as Metric) ?? base.metric,
    entities: entities ? entities.split(',').filter(Boolean) : base.entities,
    from: from ? Number(from) : base.from,
    to: to ? Number(to) : base.to,
  };
}

export function writeToUrl(state: StudioState) {
  const url = new URL(window.location.href);
  url.searchParams.set('preset', state.preset);
  url.searchParams.set('dataset', state.dataset);
  url.searchParams.set('metric', state.metric);
  url.searchParams.set('entities', state.entities.join(','));
  url.searchParams.set('from', String(state.from));
  url.searchParams.set('to', String(state.to));
  window.history.replaceState({}, '', url);
}

function presetOrDefault(p: string): Preset {
  return (['bar', 'line', 'map', 'compare'] as Preset[]).includes(p as Preset)
    ? (p as Preset)
    : 'bar';
}

// ——————————————————————————————————————————————
// Minimal reactive "store" — one source of truth, emits a CustomEvent.
// ——————————————————————————————————————————————

const CHANGE_EVENT = 'studio:change';

class Store {
  private state: StudioState;

  constructor(initial: StudioState) {
    this.state = initial;
  }

  get snapshot(): StudioState {
    return { ...this.state, entities: [...this.state.entities] };
  }

  patch(next: Partial<StudioState>) {
    this.state = { ...this.state, ...next };
    if (next.entities) this.state.entities = [...next.entities];
    writeToUrl(this.state);
    document.dispatchEvent(new CustomEvent<StudioState>(CHANGE_EVENT, { detail: this.snapshot }));
  }

  onChange(handler: (state: StudioState) => void) {
    document.addEventListener(CHANGE_EVENT, ((e: CustomEvent<StudioState>) =>
      handler(e.detail)) as EventListener);
    // fire once with the initial snapshot so renderers can seed
    queueMicrotask(() => handler(this.snapshot));
  }
}

let store: Store | null = null;
let wired = false;

function ensureStore(): Store {
  if (store) return store;
  const url = new URL(window.location.href);
  const parsed = parseFromUrl(url);
  const initial = normalizeForPreset(parsed);
  store = new Store(initial);
  writeToUrl(initial);
  return store;
}

// Compare reports are authored around state+population; normalize incoming
// state so other metrics/datasets don't render silently.
const LOCKED_COMPARE = { dataset: 'state' as Dataset, metric: 'population' as Metric };
function normalizeForPreset(state: StudioState): StudioState {
  if (state.preset !== 'compare') return state;
  if (state.dataset === LOCKED_COMPARE.dataset && state.metric === LOCKED_COMPARE.metric) return state;
  const keepEntities = state.dataset === LOCKED_COMPARE.dataset;
  return {
    ...state,
    dataset: LOCKED_COMPARE.dataset,
    metric: LOCKED_COMPARE.metric,
    entities: keepEntities ? state.entities : ['UP', 'MH', 'BR', 'WB', 'AP', 'MP', 'TN', 'RJ'].slice(0, 3),
  };
}
function lockedFieldsFor(preset: Preset): Partial<Record<keyof StudioState, string>> {
  if (preset === 'compare') return { dataset: LOCKED_COMPARE.dataset, metric: LOCKED_COMPARE.metric };
  return {};
}

export function initStudio(): Store {
  const s = ensureStore();
  if (wired) return s;
  wireRailControls(s);
  wireChartTypeSwitch(s);
  wireEntityPicker(s);
  wireTimeSlider(s);
  wired = true;
  return s;
}

export function getStore(): Store {
  return ensureStore();
}

// ——————————————————————————————————————————————
// Control wiring
// ——————————————————————————————————————————————

const DEFAULT_ENTITIES_BY_DATASET: Record<Dataset, string[]> = {
  region: ['East', 'West', 'North', 'South'],
  state: ['UP', 'MH', 'BR', 'WB', 'AP', 'MP', 'TN', 'RJ'],
  loksabha: [],
};

function wireRailControls(s: Store) {
  // plates: <button class="plate" data-field="dataset" data-value="state">
  document.querySelectorAll<HTMLElement>('.plate[data-field]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.getAttribute('aria-disabled') === 'true') return;
      const field = el.dataset.field as keyof StudioState;
      const value = el.dataset.value;
      if (!field || value == null) return;
      const patch: Partial<StudioState> = {};
      (patch as Record<string, unknown>)[field] = value;
      // Dataset switch → reset entities to a sensible set for the new dataset.
      if (field === 'dataset' && value !== s.snapshot.dataset) {
        patch.entities = [...DEFAULT_ENTITIES_BY_DATASET[value as Dataset]];
      }
      s.patch(patch);
    });
  });

  // reflect current state → DOM on every change
  s.onChange((state) => {
    const locks = lockedFieldsFor(state.preset);
    document.querySelectorAll<HTMLElement>('.plate[data-field]').forEach((el) => {
      const field = el.dataset.field as keyof StudioState;
      const value = el.dataset.value;
      const isActive = (state as Record<string, unknown>)[field] === value;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-checked', String(isActive));

      const lockedValue = (locks as Record<string, string | undefined>)[field as string];
      const disabled = lockedValue != null && value !== lockedValue;
      el.setAttribute('aria-disabled', String(disabled));
      el.classList.toggle('locked', disabled);
      if (disabled) el.setAttribute('tabindex', '-1');
      else el.removeAttribute('tabindex');
    });

    // reveal/hide lock notes + adjust the header index hint
    document.querySelectorAll<HTMLElement>('[data-lock-note]').forEach((el) => {
      const field = el.dataset.lockNote;
      el.hidden = !(field && field in locks);
    });
    document.querySelectorAll<HTMLElement>('[data-lock-index]').forEach((el) => {
      const field = el.dataset.lockIndex;
      const isLocked = field != null && field in locks;
      if (isLocked) el.textContent = 'locked';
      else el.textContent = el.dataset.lockDefault ?? (field === 'dataset' ? 'pick one' : 'y-axis');
    });

    // render chips dynamically from state.entities (resolved via entityCatalog)
    renderChips(state, s);

    // counter
    document.querySelectorAll<HTMLElement>('[data-chip-count]').forEach((el) => {
      el.textContent = String(state.entities.length);
    });
  });
}

function renderChips(state: StudioState, s: Store) {
  const host = document.querySelector<HTMLElement>('[data-chip-host]');
  if (!host) return;
  const addBtn = host.querySelector<HTMLElement>('.chip-add');
  // clear existing chip nodes (preserve the + add button)
  host.querySelectorAll<HTMLElement>('.chip').forEach((el) => el.remove());

  void import('./metrics').then(({ entityCatalog }) => {
    const catalog = entityCatalog(state.dataset);
    const codeToEntry = new Map(catalog.map((e) => [e.code, e]));

    const frag = document.createDocumentFragment();
    for (const code of state.entities) {
      const e = codeToEntry.get(code);
      if (!e) continue; // entity not valid for current dataset — skip
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.dataset.code = code;
      chip.innerHTML = `
        <span class="dot" style="background:${e.color}"></span>${e.code}
        <span class="x" role="button" aria-label="Remove ${e.label}">×</span>
      `;
      chip.querySelector<HTMLElement>('.x')!.addEventListener('click', () => {
        s.patch({ entities: s.snapshot.entities.filter((c) => c !== code) });
      });
      frag.appendChild(chip);
    }
    // insert before the + add button (so button stays at the end)
    host.insertBefore(frag, addBtn ?? null);
  });
}

function wireChartTypeSwitch(s: Store) {
  document.querySelectorAll<HTMLElement>('.seg-opt[data-type]').forEach((el) => {
    el.addEventListener('click', () => {
      const preset = el.dataset.type as Preset;
      if (!preset) return;
      const cur = s.snapshot;
      const next = normalizeForPreset({ ...cur, preset });
      const patch: Partial<StudioState> = { preset };
      if (next.dataset !== cur.dataset) patch.dataset = next.dataset;
      if (next.metric !== cur.metric) patch.metric = next.metric;
      if (next.entities !== cur.entities) patch.entities = next.entities;
      s.patch(patch);
    });
  });

  s.onChange((state) => {
    document.querySelectorAll<HTMLElement>('.seg-opt[data-type]').forEach((el) => {
      const active = el.dataset.type === state.preset;
      el.classList.toggle('active', active);
      el.setAttribute('aria-checked', String(active));
    });
    document.querySelectorAll<HTMLElement>('.chart-panel[data-panel]').forEach((el) => {
      el.style.display = el.dataset.panel === state.preset ? '' : 'none';
    });
    // breadcrumb text
    const bc = document.querySelector<HTMLElement>('[data-current-preset]');
    if (bc) bc.textContent = presetLabel(state.preset);
  });
}

function wireEntityPicker(s: Store) {
  const openBtn = document.querySelector<HTMLButtonElement>('.chip-add[data-action="open-picker"]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-action="close-picker"]');
  const panel = document.querySelector<HTMLElement>('[data-chip-picker]');
  const grid = document.querySelector<HTMLElement>('[data-picker-grid]');
  const emptyNote = document.querySelector<HTMLElement>('[data-picker-empty]');
  const datasetLabel = document.querySelector<HTMLElement>('[data-picker-dataset]');
  if (!openBtn || !closeBtn || !panel || !grid || !emptyNote || !datasetLabel) return;

  const open = () => {
    panel.hidden = false;
    renderPicker();
    // Focus the close button so keyboard users can escape easily.
    queueMicrotask(() => closeBtn.focus());
  };
  const close = () => {
    panel.hidden = true;
    openBtn.focus();
  };

  openBtn.addEventListener('click', (e) => { e.stopPropagation(); panel.hidden ? open() : close(); });
  closeBtn.addEventListener('click', () => close());

  // click outside closes
  document.addEventListener('click', (e) => {
    if (panel.hidden) return;
    const t = e.target as Node;
    if (panel.contains(t) || openBtn.contains(t)) return;
    close();
  });

  // Esc closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      e.preventDefault();
      close();
    }
  });

  const capFor = (state: StudioState): number =>
    state.preset === 'compare' ? 6 : (state.dataset === 'region' ? 5 : state.dataset === 'state' ? 18 : 36);

  function renderPicker() {
    // dynamic import would complicate plain <script> usage; inline fetch of
    // the catalog via a late import.
    import('./metrics').then(({ entityCatalog }) => {
      const state = s.snapshot;
      datasetLabel!.textContent = state.dataset;
      const all = entityCatalog(state.dataset);
      const available = all.filter((e) => !state.entities.includes(e.code));
      const reachedCap = state.entities.length >= capFor(state);

      grid!.innerHTML = available
        .map(
          (e) => `
            <button class="chip-picker-option" type="button" data-add-code="${e.code}" ${reachedCap ? 'disabled' : ''}>
              <span class="dot" style="background:${e.color}"></span>${e.code}
            </button>
          `,
        )
        .join('');
      emptyNote!.hidden = available.length > 0;
      if (available.length === 0) {
        emptyNote!.textContent = reachedCap
          ? `You've reached the cap of ${capFor(state)} entities. Remove one to add another.`
          : 'All available entities are already selected.';
      }

      grid!.querySelectorAll<HTMLButtonElement>('[data-add-code]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const code = btn.dataset.addCode!;
          const cur = s.snapshot.entities;
          if (cur.includes(code)) return;
          if (cur.length >= capFor(s.snapshot)) return;
          s.patch({ entities: [...cur, code] });
          renderPicker(); // refresh available list
        });
      });
    });
  }

  // refresh picker when state changes (e.g. dataset switch closes then repopulates)
  s.onChange(() => {
    if (!panel.hidden) renderPicker();
  });
}

function wireTimeSlider(s: Store) {
  const rail = document.querySelector<HTMLElement>('[data-ts-rail]');
  const fill = document.querySelector<HTMLElement>('[data-ts-fill]');
  const fromThumb = document.querySelector<HTMLElement>('[data-ts-thumb="from"]');
  const toThumb = document.querySelector<HTMLElement>('[data-ts-thumb="to"]');
  const readFrom = document.querySelector<HTMLElement>('[data-ts-readout-from]');
  const readTo = document.querySelector<HTMLElement>('[data-ts-readout-to]');
  const header = document.querySelector<HTMLElement>('[data-ts-header]');
  if (!rail || !fill || !fromThumb || !toThumb) return;

  const years = [...CENSUS_YEARS];
  const span = years.length - 1;
  const pct = (i: number) => (i / span) * 100;

  const idxOf = (year: number) => {
    const i = years.indexOf(year);
    return i === -1 ? 0 : i;
  };

  const idxFromClientX = (clientX: number): number => {
    const rect = rail.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const raw = (clientX - rect.left) / rect.width;
    const i = Math.round(raw * span);
    return Math.min(span, Math.max(0, i));
  };

  s.onChange((state) => {
    const fi = idxOf(state.from);
    const ti = idxOf(state.to);
    fromThumb.style.left = `${pct(fi)}%`;
    toThumb.style.left = `${pct(ti)}%`;
    fill.style.left = `${pct(fi)}%`;
    fill.style.right = `${100 - pct(ti)}%`;
    fromThumb.dataset.year = String(years[fi]);
    toThumb.dataset.year = String(years[ti]);
    fromThumb.setAttribute('aria-valuenow', String(years[fi]));
    toThumb.setAttribute('aria-valuenow', String(years[ti]));
    if (readFrom) readFrom.textContent = String(years[fi]);
    if (readTo) readTo.textContent = String(years[ti]);
    if (header) header.textContent = `${years[fi]} – ${years[ti]}`;
  });

  let dragging: 'from' | 'to' | null = null;

  const apply = (nextIdx: number) => {
    const cur = s.snapshot;
    const fi = idxOf(cur.from);
    const ti = idxOf(cur.to);
    if (dragging === 'from') {
      const clamped = Math.min(nextIdx, ti);
      const y = years[clamped];
      if (y !== cur.from) s.patch({ from: y });
    } else if (dragging === 'to') {
      const clamped = Math.max(nextIdx, fi);
      const y = years[clamped];
      if (y !== cur.to) s.patch({ to: y });
    }
  };

  const onThumbDown = (which: 'from' | 'to') => (e: PointerEvent) => {
    e.preventDefault();
    dragging = which;
    const target = which === 'from' ? fromThumb : toThumb;
    target.setPointerCapture?.(e.pointerId);
    target.focus?.();
    apply(idxFromClientX(e.clientX));
  };

  fromThumb.addEventListener('pointerdown', onThumbDown('from'));
  toThumb.addEventListener('pointerdown', onThumbDown('to'));

  document.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    apply(idxFromClientX(e.clientX));
  });
  const endDrag = () => { dragging = null; };
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  // Click on the rail (outside a thumb) → move the nearest thumb to that year.
  rail.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('[data-ts-thumb]')) return;
    const i = idxFromClientX(e.clientX);
    const cur = s.snapshot;
    const fi = idxOf(cur.from);
    const ti = idxOf(cur.to);
    const distFrom = Math.abs(i - fi);
    const distTo = Math.abs(i - ti);
    if (distFrom <= distTo) {
      dragging = 'from';
      fromThumb.setPointerCapture?.(e.pointerId);
      fromThumb.focus?.();
    } else {
      dragging = 'to';
      toThumb.setPointerCapture?.(e.pointerId);
      toThumb.focus?.();
    }
    apply(i);
  });

  const onKey = (which: 'from' | 'to') => (e: KeyboardEvent) => {
    const cur = s.snapshot;
    const curIdx = idxOf(which === 'from' ? cur.from : cur.to);
    const step = e.shiftKey ? 3 : 1;
    let next = curIdx;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':  next = curIdx - step; break;
      case 'ArrowRight':
      case 'ArrowUp':    next = curIdx + step; break;
      case 'Home':       next = 0; break;
      case 'End':        next = span; break;
      case 'PageDown':   next = curIdx - 3; break;
      case 'PageUp':     next = curIdx + 3; break;
      default: return;
    }
    e.preventDefault();
    next = Math.min(span, Math.max(0, next));
    const fi = idxOf(cur.from);
    const ti = idxOf(cur.to);
    if (which === 'from') {
      const clamped = Math.min(next, ti);
      const y = years[clamped];
      if (y !== cur.from) s.patch({ from: y });
    } else {
      const clamped = Math.max(next, fi);
      const y = years[clamped];
      if (y !== cur.to) s.patch({ to: y });
    }
  };

  fromThumb.addEventListener('keydown', onKey('from'));
  toThumb.addEventListener('keydown', onKey('to'));
}

function presetLabel(p: Preset): string {
  switch (p) {
    case 'bar': return 'Bar Studio';
    case 'line': return 'Line Studio';
    case 'map': return 'Map Studio';
    case 'compare': return 'Compare Studio';
  }
}

// ——————————————————————————————————————————————
// Export — the toolbar fires `studio:export-png`. Each chart component's
// script decides whether it's responsible for the current preset and, if so,
// emits a PNG via its own native path (ApexCharts.dataURI, or SVG-to-canvas).
// ——————————————————————————————————————————————

export function requestExportPng() {
  document.dispatchEvent(new CustomEvent('studio:export-png'));
}

export function printReport() {
  window.print();
}

// ——————————————————————————————————————————————
// Share — copy link, copy citation, toast feedback.
// ——————————————————————————————————————————————

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }
  // Fallback: hidden textarea + execCommand (works in http contexts and older Safari).
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

const PRESET_LABELS: Record<Preset, string> = {
  bar: 'Bar Studio',
  line: 'Line Studio',
  map: 'Map Studio',
  compare: 'Compare Studio',
};

export function citationFor(state: StudioState, url: string, date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const year = date.getFullYear();
  const ents = state.entities.length ? state.entities.join(',') : '—';
  const years = state.from === state.to ? String(state.to) : `${state.from}–${state.to}`;
  return [
    `Chart · ${PRESET_LABELS[state.preset]} · The Workshop · India Population (${year})`,
    `Configuration: dataset=${state.dataset} · metric=${state.metric} · entities=${ents} · years ${years}`,
    `URL: ${url}`,
    `Accessed: ${iso}`,
  ].join('\n');
}

export async function exportDataCsv(): Promise<void> {
  const state = getStore().snapshot;
  const { barSeries, lineSeries, mapValues, unitFor } = await import('./metrics');

  const esc = (v: string | number | null | undefined): string => {
    if (v == null) return '';
    const s = String(v);
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  let csv = '';
  const header = [
    `# The Workshop · India Population — ${PRESET_LABELS[state.preset]}`,
    `# dataset=${state.dataset} · metric=${state.metric} · years=${state.from}${state.from === state.to ? '' : '–' + state.to}`,
    `# exported=${new Date().toISOString()}`,
  ].join('\n') + '\n';

  if (state.preset === 'bar' || state.preset === 'map') {
    const mapUnit = unitFor(state.metric);
    const rows = state.preset === 'map'
      ? Array.from(mapValues(state).entries()).map(([code, v]) => ({
          code, label: v.name, value: v.value, unit: mapUnit,
        }))
      : barSeries(state).map((r) => ({ code: r.code, label: r.label, value: r.value, unit: r.unit }));
    csv = header + ['code', 'label', 'value', 'unit'].join(',') + '\n';
    for (const r of rows) csv += [esc(r.code), esc(r.label), esc(r.value), esc(r.unit)].join(',') + '\n';
  } else if (state.preset === 'line') {
    const series = lineSeries(state);
    const years = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.year)))).sort((a, b) => a - b);
    const codes = series.map((s) => s.code);
    csv = header + ['year', ...codes].map(esc).join(',') + '\n';
    for (const y of years) {
      const row = [String(y), ...series.map((s) => s.points.find((p) => p.year === y)?.v ?? '')];
      csv += row.map(esc).join(',') + '\n';
    }
  } else if (state.preset === 'compare') {
    // Compare is locked to state+population; emit the same line-series shape.
    const series = lineSeries({ ...state, dataset: 'state', metric: 'population' });
    const years = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.year)))).sort((a, b) => a - b);
    const codes = series.map((s) => s.code);
    csv = header + ['year', ...codes].map(esc).join(',') + '\n';
    for (const y of years) {
      const row = [String(y), ...series.map((s) => s.points.find((p) => p.year === y)?.v ?? '')];
      csv += row.map(esc).join(',') + '\n';
    }
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filenameFor('csv');
  a.click();
  URL.revokeObjectURL(url);
}

let toastTimer: number | null = null;
export function showToast(message: string, variant: 'info' | 'warn' = 'info'): void {
  let host = document.querySelector<HTMLElement>('[data-ws-toast]');
  if (!host) {
    host = document.createElement('div');
    host.setAttribute('data-ws-toast', '');
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    host.className = 'ws-toast';
    document.body.appendChild(host);
  }
  host.classList.remove('warn', 'info', 'visible');
  host.classList.add(variant);
  host.textContent = message;
  // Reflow for restart of the fade-in transition when spam-clicking.
  void host.offsetWidth;
  host.classList.add('visible');

  if (toastTimer != null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    host!.classList.remove('visible');
  }, 2400);
}

export function filenameFor(ext: string): string {
  const s = store?.snapshot;
  const preset = s?.preset ?? 'chart';
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `workshop-${preset}-${stamp}.${ext}`;
}

// Generic SVG → PNG helper used by MapStudio (which owns its own SVG directly).
// ApexCharts callers should prefer chart.dataURI() instead.
export async function svgToPng(svg: SVGSVGElement, filename: string, scale = 2): Promise<void> {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || Number(svg.getAttribute('width')) || 960));
  const height = Math.max(1, Math.round(rect.height || Number(svg.getAttribute('height')) || 620));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.decoding = 'sync';
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--paper').trim() || '#f3ead7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    await new Promise<void>((resolve) =>
      canvas.toBlob((blob) => {
        if (!blob) { resolve(); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        resolve();
      }, 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Convenience: data-URI → download.
export function downloadDataUri(uri: string, filename: string) {
  const a = document.createElement('a');
  a.href = uri;
  a.download = filename;
  a.click();
}

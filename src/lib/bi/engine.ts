import type { Agg, ChartType, Column, Dataset, Filter, Viz } from "./types";

export type Point = { x: string | number; y: number; g: string; y2?: number };
export type Series = { key: string; color?: string; points: Point[] };
export type QueryResult = {
  series: Series[];
  table: { label: string; values: Record<string, number | string> }[];
  kpi: { label: string; value: number; fmt: string }[];
  heat: { x: string; y: string; v: number }[];
  tree: { name: string; value: number }[];
  xLabel: string;
  yLabel: string;
};

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "boolean") return v ? 1 : 0;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string {
  if (v == null) return "(null)";
  if (typeof v === "number") return String(v);
  return String(v);
}

function applyFilters(ds: Dataset, filters: Filter[]): Record<string, unknown>[] {
  return ds.rows.filter((row) =>
    filters.every((f) => {
      const v = row[f.field];
      const sv = str(v);
      const nv = num(v);
      const fn = Number(f.value);
      if (f.op === "eq") return sv === f.value;
      if (f.op === "neq") return sv !== f.value;
      if (f.op === "contains") return sv.toLowerCase().includes(f.value.toLowerCase());
      if (f.op === "gt") return nv != null && nv > fn;
      if (f.op === "lt") return nv != null && nv < fn;
      return true;
    }),
  );
}

function aggNums(vals: number[], how: Agg): number {
  if (!vals.length) return 0;
  const s = vals.reduce((a, b) => a + b, 0);
  if (how === "sum") return s;
  if (how === "avg") return s / vals.length;
  if (how === "min") return Math.min(...vals);
  if (how === "max") return Math.max(...vals);
  if (how === "count") return vals.length;
  if (how === "dcount") return new Set(vals).size;
  const sorted = [...vals].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
}

function col(ds: Dataset, id?: string | null): Column | undefined {
  if (!id) return undefined;
  return ds.columns.find((c) => c.id === id);
}

export function measures(ds: Dataset): Column[] {
  return ds.columns.filter((c) => c.role === "measure" || c.type === "number");
}

export function dimensions(ds: Dataset): Column[] {
  return ds.columns.filter((c) => c.role === "dimension" && c.type !== "number");
}

export function uniqueValues(ds: Dataset, fieldId: string, cap = 40): string[] {
  const set = new Set<string>();
  for (const r of ds.rows) {
    set.add(str(r[fieldId]));
    if (set.size >= cap) break;
  }
  return [...set];
}

export function query(ds: Dataset, viz: Viz): QueryResult {
  const rows = applyFilters(ds, viz.filters);
  const dimX = col(ds, viz.rows[0]) ?? dimensions(ds)[0];
  const dimY = col(ds, viz.rows[1]);
  const split = col(ds, viz.color);
  const measure = col(ds, viz.columns[0]) ?? measures(ds)[0];
  const measure2 =
    col(ds, viz.columns[1]) ?? (viz.chart === "combo" || viz.chart === "scatter" ? measures(ds)[1] : undefined);

  const xLabel = dimX?.name ?? "Category";
  const yLabel = measure ? `${viz.agg} of ${measure.name}` : "Value";

  if (!measure && viz.chart !== "table") {
    return { series: [], table: [], kpi: [], heat: [], tree: [], xLabel, yLabel };
  }

  const groups = new Map<string, { x: string; g: string; y: string; vals: number[]; vals2: number[] }>();
  for (const r of rows) {
    const x = dimX ? str(r[dimX.id]) : "All";
    const g = split ? str(r[split.id]) : "Value";
    const y = dimY ? str(r[dimY.id]) : "";
    const key = `${x}||${g}||${y}`;
    let slot = groups.get(key);
    if (!slot) {
      slot = { x, g, y, vals: [], vals2: [] };
      groups.set(key, slot);
    }
    if (measure) {
      if (viz.agg === "count") slot.vals.push(1);
      else if (viz.agg === "dcount") slot.vals.push(num(r[measure.id]) ?? 0);
      else {
        const n = num(r[measure.id]);
        if (n != null) slot.vals.push(n);
      }
    }
    if (measure2) {
      const n = num(r[measure2.id]);
      if (n != null) slot.vals2.push(n);
    }
  }

  const seriesMap = new Map<string, Point[]>();
  const table: QueryResult["table"] = [];
  const heat: QueryResult["heat"] = [];
  const treeMap = new Map<string, number>();

  for (const slot of groups.values()) {
    const y = aggNums(slot.vals, viz.agg === "dcount" ? "dcount" : viz.agg);
    const y2 = slot.vals2.length ? aggNums(slot.vals2, viz.agg) : undefined;
    const pts = seriesMap.get(slot.g) ?? [];
    pts.push({ x: slot.x, y, g: slot.g, y2 });
    seriesMap.set(slot.g, pts);
    table.push({ label: slot.y ? `${slot.x} / ${slot.y}` : slot.x, values: { [slot.g]: y } });
    if (dimY) heat.push({ x: slot.x, y: slot.y, v: y });
    treeMap.set(split ? `${slot.g}` : slot.x, (treeMap.get(split ? slot.g : slot.x) ?? 0) + y);
  }

  const series: Series[] = [...seriesMap.entries()].map(([key, points]) => ({
    key,
    points: points.sort((a, b) => String(a.x).localeCompare(String(b.x), undefined, { numeric: true })),
  }));

  const kpiVal = series.flatMap((s) => s.points.map((p) => p.y));
  const kpi = [
    { label: yLabel, value: aggNums(kpiVal, viz.agg === "count" ? "sum" : viz.agg), fmt: "num" },
    { label: "Groups", value: series.reduce((n, s) => n + s.points.length, 0), fmt: "int" },
    { label: "Rows in view", value: rows.length, fmt: "int" },
  ];

  const tree = [...treeMap.entries()].map(([name, value]) => ({ name, value }));

  return { series, table, kpi, heat, tree, xLabel, yLabel };
}

export function showMe(
  ds: Dataset,
  selected: string[],
): { chart: ChartType; rows: string[]; columns: string[]; color?: string } {
  const cols = selected.map((id) => col(ds, id)).filter(Boolean) as Column[];
  const dims = cols.filter((c) => c.role === "dimension" || c.type !== "number");
  const meas = cols.filter((c) => c.role === "measure" || c.type === "number");
  if (!meas.length && measures(ds)[0]) meas.push(measures(ds)[0]);
  if (dims.length >= 2 && meas.length) return { chart: "heatmap", rows: [dims[0].id, dims[1].id], columns: [meas[0].id] };
  if (meas.length >= 2 && !dims.length) return { chart: "scatter", rows: [], columns: [meas[0].id, meas[1].id] };
  if (dims[0]?.type === "date" && meas[0]) return { chart: "line", rows: [dims[0].id], columns: [meas[0].id] };
  if (dims.length === 1 && meas.length === 1) return { chart: "bar", rows: [dims[0].id], columns: [meas[0].id] };
  if (dims.length === 1 && !meas.length) return { chart: "bar", rows: [dims[0].id], columns: [] };
  return {
    chart: "bar",
    rows: dims[0] ? [dims[0].id] : [],
    columns: meas[0] ? [meas[0].id] : [],
    color: dims[1]?.id,
  };
}

export function heuristicAsk(ds: Dataset, prompt: string): Partial<Viz> & { insight: string } {
  const p = prompt.toLowerCase();
  const chart: ChartType =
    p.includes("pie") || p.includes("share")
      ? "pie"
      : p.includes("line") || p.includes("trend") || p.includes("over time")
        ? "line"
        : p.includes("scatter") || p.includes("correlation")
          ? "scatter"
          : p.includes("heat")
            ? "heatmap"
            : p.includes("tree")
              ? "treemap"
              : p.includes("kpi") || p.includes("total")
                ? "kpi"
                : p.includes("table")
                  ? "table"
                  : p.includes("stack")
                    ? "bar-stack"
                    : p.includes("area")
                      ? "area"
                      : p.includes("histogram") || p.includes("distribution")
                        ? "histogram"
                        : "bar";
  const dim =
    ds.columns.find((c) => p.includes(c.name.toLowerCase()) && (c.role === "dimension" || c.type !== "number")) ??
    dimensions(ds)[0];
  const meas =
    ds.columns.find((c) => p.includes(c.name.toLowerCase()) && (c.role === "measure" || c.type === "number")) ??
    measures(ds)[0];
  const split = ds.columns.find(
    (c) => c.id !== dim?.id && p.includes(c.name.toLowerCase()) && c.role === "dimension",
  );
  const agg: Agg = p.includes("average") || p.includes("avg") ? "avg" : p.includes("count") ? "count" : "sum";
  return {
    chart,
    rows: dim ? [dim.id] : [],
    columns: meas ? [meas.id] : [],
    color: split?.id,
    agg,
    title: prompt.slice(0, 72),
    insight: `Mapped “${prompt}” to ${chart} of ${meas?.name ?? "value"} by ${dim?.name ?? "all"}.`,
  };
}

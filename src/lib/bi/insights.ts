import type { Dataset } from "./types";
import { dimensions, measures, query } from "./engine";
import type { Viz } from "./types";

export type PulseItem = {
  id: string;
  title: string;
  body: string;
  delta?: number;
  kind: "trend" | "outlier" | "mix" | "kpi";
};

function num(v: unknown): number {
  return typeof v === "number" ? v : Number(v) || 0;
}

export function pulse(ds: Dataset): PulseItem[] {
  const items: PulseItem[] = [];
  const meas = measures(ds);
  const dims = dimensions(ds);
  if (!meas.length) return items;

  for (const m of meas.slice(0, 3)) {
    const vals = ds.rows.map((r) => num(r[m.id])).filter((n) => Number.isFinite(n));
    if (!vals.length) continue;
    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    const sorted = [...vals].sort((a, b) => a - b);
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    items.push({
      id: `kpi-${m.id}`,
      title: m.name,
      body: `Total ${fmt(sum)} · mean ${fmt(avg)} · P90 ${fmt(p90)} across ${vals.length} rows.`,
      kind: "kpi",
    });
  }

  if (dims[0] && meas[0]) {
    const viz: Viz = {
      id: "tmp",
      title: "",
      datasetId: ds.id,
      chart: "bar",
      rows: [dims[0].id],
      columns: [meas[0].id],
      filters: [],
      agg: "sum",
    };
    const q = query(ds, viz);
    const pts = q.series[0]?.points ?? [];
    const ranked = [...pts].sort((a, b) => b.y - a.y);
    if (ranked[0] && ranked[1]) {
      const share = ranked[0].y / ranked.reduce((s, p) => s + p.y, 0);
      items.push({
        id: "mix",
        title: `${dims[0].name} mix`,
        body: `${ranked[0].x} leads ${meas[0].name} at ${(share * 100).toFixed(1)}% (${fmt(ranked[0].y)}), ahead of ${ranked[1].x}.`,
        kind: "mix",
      });
    }
    if (pts.length >= 3) {
      const mean = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      const sd = Math.sqrt(pts.reduce((s, p) => s + (p.y - mean) ** 2, 0) / pts.length) || 1;
      const out = pts.find((p) => Math.abs(p.y - mean) / sd > 1.8);
      if (out) {
        items.push({
          id: "out",
          title: "Outlier",
          body: `${out.x} sits ${((out.y - mean) / sd).toFixed(1)}σ from the ${dims[0].name} mean for ${meas[0].name}.`,
          delta: out.y - mean,
          kind: "outlier",
        });
      }
    }
    if (pts.length >= 4) {
      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      if (prev.y) {
        const d = (last.y - prev.y) / Math.abs(prev.y);
        items.push({
          id: "trend",
          title: "Latest change",
          body: `${last.x} vs ${prev.x}: ${d >= 0 ? "+" : ""}${(d * 100).toFixed(1)}% on ${meas[0].name}.`,
          delta: d,
          kind: "trend",
        });
      }
    }
  }
  return items;
}

function fmt(n: number) {
  const a = Math.abs(n);
  if (a >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2);
}

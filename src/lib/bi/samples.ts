import { uid } from "@/lib/utils";
import type { Column, Dataset } from "./types";

function col(name: string, type: Column["type"], role: Column["role"], id: string): Column {
  return { id, name, type, role };
}

function ds(id: string, name: string, columns: Column[], records: Record<string, unknown>[]): Dataset {
  const mapped = records.map((r) => {
    const row: Record<string, unknown> = {};
    columns.forEach((c) => {
      row[c.id] = r[c.name];
    });
    return row;
  });
  return { id, name, source: "sample", columns, rows: mapped };
}

function ns(prefix?: string) {
  return prefix ?? uid("ds");
}

export function sampleRetail(prefix?: string): Dataset {
  const id = ns(prefix);
  const columns = [
    col("Month", "date", "dimension", `${id}_month`),
    col("Region", "string", "dimension", `${id}_region`),
    col("Channel", "string", "dimension", `${id}_channel`),
    col("Category", "string", "dimension", `${id}_category`),
    col("Sales", "number", "measure", `${id}_sales`),
    col("Profit", "number", "measure", `${id}_profit`),
    col("Units", "number", "measure", `${id}_units`),
  ];
  const months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"];
  const regions = ["North", "South", "East", "West"];
  const channels = ["Direct", "Partner", "Online"];
  const cats = ["Hardware", "Consumables", "Service"];
  const records: Record<string, unknown>[] = [];
  let seed = 17;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (const m of months) {
    for (const r of regions) {
      for (const ch of channels) {
        for (const c of cats) {
          const units = Math.round(20 + rnd() * 180);
          const sales = Math.round(units * (40 + rnd() * 90));
          const profit = Math.round(sales * (0.08 + rnd() * 0.22));
          records.push({ Month: m, Region: r, Channel: ch, Category: c, Sales: sales, Profit: profit, Units: units });
        }
      }
    }
  }
  return ds(id, "Harbor retail", columns, records);
}

export function sampleTransit(prefix?: string): Dataset {
  const id = ns(prefix);
  const columns = [
    col("Weekday", "string", "dimension", `${id}_weekday`),
    col("Route", "string", "dimension", `${id}_route`),
    col("Ridership", "number", "measure", `${id}_ridership`),
    col("OnTime", "number", "measure", `${id}_ontime`),
    col("DelayMin", "number", "measure", `${id}_delaymin`),
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const routes = ["A-Line", "B-Loop", "C-Express", "D-Harbor"];
  const records: Record<string, unknown>[] = [];
  let seed = 91;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (const d of days) {
    for (const r of routes) {
      const weekend = d === "Sat" || d === "Sun";
      const ridership = Math.round((weekend ? 420 : 980) * (0.7 + rnd() * 0.6));
      const onTime = Math.round((weekend ? 94 : 86) + rnd() * 8);
      records.push({
        Weekday: d,
        Route: r,
        Ridership: ridership,
        OnTime: Math.min(99, onTime),
        DelayMin: Math.round((100 - onTime) * 0.4),
      });
    }
  }
  return ds(id, "Transit board", columns, records);
}

export function sampleNps(prefix?: string): Dataset {
  const id = ns(prefix);
  const columns = [
    col("Segment", "string", "dimension", `${id}_segment`),
    col("Cohort", "string", "dimension", `${id}_cohort`),
    col("NPS", "number", "measure", `${id}_nps`),
    col("Responses", "number", "measure", `${id}_responses`),
    col("Renewal", "number", "measure", `${id}_renewal`),
  ];
  const segs = ["Starter", "Growth", "Enterprise"];
  const cohorts = ["Q1", "Q2", "Q3", "Q4"];
  const records: Record<string, unknown>[] = [];
  let seed = 3;
  const rnd = () => {
    seed = (seed * 214013 + 2531011) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (const s of segs) {
    for (const c of cohorts) {
      const nps = Math.round((s === "Enterprise" ? 42 : 18) + rnd() * 28);
      records.push({
        Segment: s,
        Cohort: c,
        NPS: nps,
        Responses: Math.round(80 + rnd() * 400),
        Renewal: Math.round(70 + nps * 0.35 + rnd() * 8),
      });
    }
  }
  return ds(id, "Account pulse", columns, records);
}

export const SAMPLE_FNS = [
  { id: "retail", label: "Harbor retail", run: () => sampleRetail() },
  { id: "transit", label: "Transit board", run: () => sampleTransit() },
  { id: "nps", label: "Account pulse", run: () => sampleNps() },
];

import { uid } from "@/lib/utils";
import type { Column, Dataset, FieldType, Role } from "./types";

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === "," || ch === "\t" || ch === ";") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function inferType(values: string[]): FieldType {
  const filled = values.filter((v) => v.trim() !== "");
  if (!filled.length) return "string";
  if (filled.every((v) => /^(true|false|yes|no|0|1)$/i.test(v.trim()))) return "bool";
  if (filled.every((v) => !Number.isNaN(Number(v.replace(/,/g, ""))))) return "number";
  if (filled.filter((v) => !Number.isNaN(Date.parse(v))).length / filled.length > 0.8) return "date";
  return "string";
}

function coerce(v: string, t: FieldType): unknown {
  const s = v.trim();
  if (s === "") return null;
  if (t === "number") {
    const n = Number(s.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  if (t === "bool") return /^(true|yes|1)$/i.test(s);
  return s;
}

export function parseTable(text: string): { names: string[]; rows: string[][] } {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim().length);
  if (!lines.length) return { names: [], rows: [] };
  const header = splitLine(lines[0]).map((h) => h.trim() || "Col");
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    while (cells.length < header.length) cells.push("");
    rows.push(cells.slice(0, header.length));
  }
  return { names: header, rows };
}

export function tableToDataset(name: string, names: string[], grid: string[][], source: Dataset["source"]): Dataset {
  const types = names.map((_, i) => inferType(grid.map((r) => r[i] ?? "")));
  const columns: Column[] = names.map((n, i) => {
    const type = types[i];
    const role: Role = type === "number" ? "measure" : "dimension";
    return { id: uid("col"), name: n, type, role };
  });
  const rows = grid.map((r) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((c, i) => {
      obj[c.id] = coerce(r[i] ?? "", c.type);
    });
    return obj;
  });
  return { id: uid("ds"), name, source, columns, rows };
}

export function datasetToCsv(ds: Dataset): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ds.columns.map((c) => esc(c.name)).join(",");
  const lines = ds.rows.map((r) => ds.columns.map((c) => esc(r[c.id])).join(","));
  return [header, ...lines].join("\n");
}

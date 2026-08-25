import type { CSSProperties } from "react";
import {
  FONT_STACKS,
  PALETTE,
  type AxisStyle,
  type ChartStyle,
  type FontId,
  type NumberFormat,
  type SeriesStyle,
  type TextStyle,
} from "./types";

const INK = "#1c2128";

export function defaultText(size = 12, color = INK, bold = false): TextStyle {
  return { font: "plex", size, color, bold, italic: false, underline: false };
}

function defaultAxis(): AxisStyle {
  return {
    title: "",
    showTitle: true,
    showLabels: true,
    titleStyle: defaultText(12, INK, true),
    labelStyle: defaultText(11, INK),
    titleRotate: 0,
    titleFlip: false,
    tickRotate: 0,
    tickFlip: false,
    lineColor: "#4a4641",
    lineWidth: 1,
    min: "",
    max: "",
  };
}

export function defaultChartStyle(): ChartStyle {
  return {
    plotFill: "#faf7f0",
    grid: true,
    gridColor: "#8c867c",
    x: defaultAxis(),
    y: defaultAxis(),
    legend: {
      show: true,
      title: "",
      position: "bottom",
      rotate: 0,
      flip: false,
      titleStyle: defaultText(11, INK, true),
      labelStyle: defaultText(11, INK),
    },
    dataLabels: {
      show: true,
      position: "end",
      format: "auto",
      decimals: 1,
      rotate: 0,
      flip: false,
      valueStyle: defaultText(10, INK, true),
    },
    pie: {
      showSliceLabels: true,
      showSliceValues: true,
      startAngle: 0,
      padAngle: 1,
      donutInner: 52,
    },
    bars: {
      categoryGap: 22,
      barGap: 4,
      cornerRadius: 3,
    },
    lines: {
      width: 2,
      dots: false,
      dash: "solid",
    },
    series: {},
  };
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (!isObj(base) || !isObj(patch)) return ((patch as T) ?? base) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = isObj(out[k]) && isObj(v) ? deepMerge(out[k], v) : v;
  }
  return out as T;
}

export function mergeChartStyle(partial?: ChartStyle | Partial<ChartStyle> | null): ChartStyle {
  return deepMerge(defaultChartStyle(), partial ?? {});
}

export function patchChartStyle(current: ChartStyle | undefined, patch: unknown): ChartStyle {
  return deepMerge(mergeChartStyle(current), patch);
}

export function seriesPaint(style: ChartStyle, key: string, index: number): SeriesStyle {
  const fallback: SeriesStyle = {
    fill: PALETTE[index % PALETTE.length],
    stroke: PALETTE[index % PALETTE.length],
    strokeWidth: 1,
  };
  const custom = style.series[key];
  return custom ? { ...fallback, ...custom } : fallback;
}

export function textCss(t: TextStyle): CSSProperties {
  return {
    fontFamily: FONT_STACKS[t.font],
    fontSize: t.size,
    fill: t.color,
    color: t.color,
    fontWeight: t.bold ? 700 : 400,
    fontStyle: t.italic ? "italic" : "normal",
    textDecoration: t.underline ? "underline" : "none",
  };
}

export function formatValue(n: number, format: NumberFormat, decimals: number): string {
  if (!Number.isFinite(n)) return "";
  if (format === "percent") return `${n.toFixed(decimals)}%`;
  if (format === "currency") {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  if (format === "number") {
    return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  const a = Math.abs(n);
  if (format === "compact" || (format === "auto" && a >= 1000)) {
    if (a >= 1e6) return `${(n / 1e6).toFixed(Math.min(decimals, 2))}M`;
    if (a >= 1e3) return `${(n / 1e3).toFixed(Math.min(decimals, 1))}k`;
  }
  if (Number.isInteger(n) && format === "auto") return String(n);
  return n.toFixed(decimals);
}

export function contrastOn(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return INK;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 160 ? INK : "#f4f1ea";
}

export function dashArray(dash: ChartStyle["lines"]["dash"], width: number): string | undefined {
  if (dash === "dashed") return `${width * 4} ${width * 3}`;
  if (dash === "dotted") return `${width} ${width * 2}`;
  return undefined;
}

export function yDomain(style: ChartStyle): [number | "auto", number | "auto"] | undefined {
  const min = style.y.min.trim() === "" ? undefined : Number(style.y.min);
  const max = style.y.max.trim() === "" ? undefined : Number(style.y.max);
  if (min == null && max == null) return undefined;
  return [Number.isFinite(min) ? (min as number) : "auto", Number.isFinite(max) ? (max as number) : "auto"];
}

export function rotateCss(deg: number, flip = false): CSSProperties {
  const a = (deg || 0) + (flip ? 180 : 0);
  if (!a) return {};
  return { transform: `rotate(${a}deg)`, display: "inline-block" };
}

export function labelTransform(cx: number, cy: number, rotate: number, flip = false): string | undefined {
  const a = (rotate || 0) + (flip ? 180 : 0);
  if (!a) return undefined;
  return `rotate(${a}, ${cx}, ${cy})`;
}

export function yTitleAngle(rotate: number, flip = false): number {
  return -90 + (rotate || 0) + (flip ? 180 : 0);
}

export function angledRoom(rotate: number, base: number, extra: number): number {
  const a = Math.abs(rotate) % 180;
  const t = (a > 90 ? 180 - a : a) * (Math.PI / 180);
  return base + Math.round(Math.sin(t) * extra);
}

export function axisBand(charCount: number, fontSize: number, rotate: number, flip: boolean, axis: "x" | "y"): number {
  const w = Math.max(2, charCount) * fontSize * 0.72;
  const h = fontSize + 4;
  const rad = (((rotate || 0) + (flip ? 180 : 0)) * Math.PI) / 180;
  const along = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
  const across = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  if (axis === "y") return Math.min(168, Math.max(76, Math.ceil(along) + 22));
  return Math.min(120, Math.max(32, Math.ceil(across) + 14));
}

export function titleGutter(text: string, fontSize: number, rotate: number, flip: boolean): number {
  const a = yTitleAngle(rotate, flip);
  const horiz = Math.max(36, text.length * fontSize * 0.62 + 12);
  const vert = fontSize + 18;
  const howHorizontal = Math.abs(Math.cos((a * Math.PI) / 180));
  return Math.ceil(vert + howHorizontal * (horiz - vert));
}

export function parseHex(raw: string): string | null {
  let v = raw.trim();
  if (v && !v.startsWith("#")) v = `#${v}`;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const s = v.slice(1);
    return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
  }
  return null;
}

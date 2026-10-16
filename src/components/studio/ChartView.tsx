import { useEffect, useState, type CSSProperties, type ReactElement } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { FONT_STACKS, PALETTE, type ChartStyle, type LabelPos, type Viz } from "@/lib/bi/types";
import type { QueryResult } from "@/lib/bi/engine";
import {
  axisBand,
  contrastOn,
  dashArray,
  formatValue,
  labelTransform,
  mergeChartStyle,
  angledRoom,
  rotateCss,
  seriesPaint,
  textCss,
  titleGutter,
  yDomain,
  yTitleAngle,
} from "@/lib/bi/chart-style";
import { cn } from "@/lib/utils";

type LegendItem = { name: string; fill: string };

function barLabelPos(pos: LabelPos, stacked: boolean): "top" | "center" | "insideTop" {
  if (stacked) return pos === "end" ? "insideTop" : "center";
  if (pos === "center" || pos === "inside") return "center";
  return "top";
}

type LabelProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number | string;
};

function makeBarLabel(style: ChartStyle, stacked?: boolean) {
  if (!style.dataLabels.show) return false;
  const pos = barLabelPos(style.dataLabels.position, !!stacked);
  const css = textCss(style.dataLabels.valueStyle);
  return (props: LabelProps) => {
    if (props.x == null || props.y == null || props.value == null || props.value === "") return <g />;
    const w = Number(props.width ?? 0);
    const h = Number(props.height ?? 0);
    const tx = Number(props.x) + w / 2;
    let ty = Number(props.y) - 8;
    let baseline: "auto" | "middle" | "hanging" = "auto";
    if (pos === "center") {
      ty = Number(props.y) + h / 2;
      baseline = "middle";
    } else if (pos === "insideTop") {
      ty = Number(props.y) + 4;
      baseline = "hanging";
    }
    return (
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline={baseline}
        fill={style.dataLabels.valueStyle.color}
        style={css as CSSProperties}
        transform={labelTransform(tx, ty, style.dataLabels.rotate, style.dataLabels.flip)}
      >
        {formatValue(Number(props.value), style.dataLabels.format, style.dataLabels.decimals)}
      </text>
    );
  };
}

function makePointLabel(style: ChartStyle) {
  if (!style.dataLabels.show) return false;
  const css = textCss(style.dataLabels.valueStyle);
  return (props: LabelProps) => {
    if (props.x == null || props.y == null || props.value == null || props.value === "") return <g />;
    const tx = Number(props.x);
    const ty = Number(props.y) - 8;
    return (
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        fill={style.dataLabels.valueStyle.color}
        style={css as CSSProperties}
        transform={labelTransform(tx, ty, style.dataLabels.rotate, style.dataLabels.flip)}
      >
        {formatValue(Number(props.value), style.dataLabels.format, style.dataLabels.decimals)}
      </text>
    );
  };
}

function AxisTick({
  x,
  y,
  payload,
  rotate,
  flip,
  fill,
  fontSize,
  fontFamily,
  fontWeight,
  axis,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string | number };
  rotate: number;
  flip: boolean;
  fill: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: number | string;
  axis: "x" | "y";
}) {
  if (x == null || y == null) return <g />;
  const angle = (rotate || 0) + (flip ? 180 : 0);
  if (axis === "y") {
    const ox = x - 10;
    const oy = y;
    return (
      <text
        x={ox}
        y={oy}
        textAnchor="end"
        dominantBaseline="middle"
        fill={fill}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        transform={angle ? `rotate(${angle}, ${ox}, ${oy})` : undefined}
      >
        {payload?.value}
      </text>
    );
  }
  const ox = x;
  const oy = y + 10;
  const mod = ((angle % 360) + 360) % 360;
  const textAnchor = mod === 0 ? "middle" : mod > 0 && mod < 180 ? "start" : "end";
  return (
    <text
      x={ox}
      y={oy}
      textAnchor={textAnchor}
      dominantBaseline="hanging"
      fill={fill}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      transform={angle ? `rotate(${angle}, ${ox}, ${oy})` : undefined}
    >
      {payload?.value}
    </text>
  );
}

function axes(
  style: ChartStyle,
  opts?: { yTick?: (n: number) => string; numeric?: boolean; yWidth?: number; xHeight?: number },
): ReactElement[] {
  const xFont = FONT_STACKS[style.x.labelStyle.font];
  const yFont = FONT_STACKS[style.y.labelStyle.font];
  const domain = yDomain(style);
  const yFmt =
    opts?.yTick ??
    ((n: number) =>
      formatValue(
        n,
        style.dataLabels.format === "percent" ? "auto" : style.dataLabels.format,
        style.dataLabels.decimals,
      ));
  const xLine = style.x.lineWidth > 0 ? { stroke: style.x.lineColor, strokeWidth: style.x.lineWidth } : false;
  const yLine = style.y.lineWidth > 0 ? { stroke: style.y.lineColor, strokeWidth: style.y.lineWidth } : false;
  const xTick = style.x.showLabels
    ? (props: object) => (
        <AxisTick
          {...(props as { x?: number; y?: number; payload?: { value?: string | number } })}
          axis="x"
          rotate={style.x.tickRotate}
          flip={style.x.tickFlip}
          fill={style.x.labelStyle.color}
          fontSize={style.x.labelStyle.size}
          fontFamily={xFont}
          fontWeight={style.x.labelStyle.bold ? 700 : 400}
        />
      )
    : false;
  const yTick = style.y.showLabels
    ? (props: { x?: number; y?: number; payload?: { value?: string | number } }) => (
        <AxisTick
          x={props.x}
          y={props.y}
          payload={{ value: yFmt(Number(props.payload?.value)) }}
          axis="y"
          rotate={style.y.tickRotate}
          flip={style.y.tickFlip}
          fill={style.y.labelStyle.color}
          fontSize={style.y.labelStyle.size}
          fontFamily={yFont}
          fontWeight={style.y.labelStyle.bold ? 700 : 400}
        />
      )
    : false;
  return [
    <CartesianGrid
      key="grid"
      stroke={style.grid ? style.gridColor : "transparent"}
      strokeWidth={style.grid ? 1 : 0}
      vertical={!!style.grid}
      horizontal={!!style.grid}
    />,
    <XAxis
      key="x"
      dataKey="x"
      type={opts?.numeric ? "number" : "category"}
      tick={xTick}
      axisLine={xLine}
      tickLine={style.x.showLabels && xLine ? { stroke: style.x.lineColor } : false}
      interval="preserveStartEnd"
      height={style.x.showLabels ? (opts?.xHeight ?? 36) : 12}
    />,
    <YAxis
      key="y"
      tick={yTick}
      axisLine={yLine}
      tickLine={style.y.showLabels && yLine ? { stroke: style.y.lineColor } : false}
      domain={domain}
      width={style.y.showLabels ? (opts?.yWidth ?? 84) : 16}
    />,
    <Tooltip
      key="tt"
      contentStyle={{
        background: style.plotFill,
        border: "1px solid #cfc9bc",
        borderRadius: 8,
        color: style.x.labelStyle.color,
        fontSize: 12,
      }}
    />,
  ];
}

function axisScale(values: number[], style: ChartStyle) {
  const parsedMin = style.y.min.trim() === "" ? undefined : Number(style.y.min);
  const parsedMax = style.y.max.trim() === "" ? undefined : Number(style.y.max);
  let lo = Math.min(0, ...values, 0);
  let hi = Math.max(...values, 1);
  if (!(hi > lo)) hi = lo + 1;
  if (parsedMin != null && Number.isFinite(parsedMin)) lo = parsedMin;
  if (parsedMax != null && Number.isFinite(parsedMax)) hi = parsedMax;
  if (!(hi > lo)) hi = lo + 1;
  const rough = (hi - lo) / 4;
  const mag = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-9)));
  const err = rough / mag;
  const step = err < 1.5 ? mag : err < 3 ? 2 * mag : err < 7 ? 5 * mag : 10 * mag;
  const safe = step || 1;
  const start = parsedMin != null && Number.isFinite(parsedMin) ? lo : Math.floor(lo / safe) * safe;
  const end = parsedMax != null && Number.isFinite(parsedMax) ? hi : Math.ceil(hi / safe) * safe;
  const ticks: number[] = [];
  for (let v = start, n = 0; v <= end + safe * 0.01 && n < 12; v += safe, n++) ticks.push(Math.round(v * 1e6) / 1e6);
  if (ticks.length < 2) return { min: lo, max: hi, ticks: [lo, hi] };
  return { min: ticks[0], max: ticks[ticks.length - 1], ticks };
}

function CategoryFrame({
  style,
  xLabels,
  scale,
  topPad,
  yFmt,
  children,
}: {
  style: ChartStyle;
  xLabels: string[];
  scale: { min: number; max: number; ticks: number[] };
  topPad: number;
  yFmt: (n: number) => string;
  children: ReactElement;
}) {
  const span = scale.max - scale.min || 1;
  const yPct = (v: number) => ((scale.max - v) / span) * 100;
  const yCss = textCss(style.y.labelStyle);
  const xCss = textCss(style.x.labelStyle);
  const yRot = rotateCss(style.y.tickRotate, style.y.tickFlip);
  const xRot = rotateCss(style.x.tickRotate, style.x.tickFlip);
  const yWidth = style.y.showLabels
    ? axisBand(
        Math.max(4, ...scale.ticks.map((t) => yFmt(t).length)),
        style.y.labelStyle.size,
        style.y.tickRotate,
        style.y.tickFlip,
        "y",
      )
    : 8;
  const xHeight = style.x.showLabels
    ? axisBand(Math.max(4, ...xLabels.map((x) => x.length), 4), style.x.labelStyle.size, style.x.tickRotate, style.x.tickFlip, "x")
    : 0;
  const yTop = (v: number) => `calc(${topPad}px + (100% - ${topPad}px) * ${yPct(v) / 100})`;
  const n = Math.max(1, xLabels.length);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className="relative shrink-0" style={{ width: yWidth }}>
          {style.y.showLabels
            ? scale.ticks.map((v) => (
                <span
                  key={v}
                  className="absolute right-2 leading-none"
                  style={{ top: yTop(v), transform: "translateY(-50%)", ...yCss, ...yRot }}
                >
                  {yFmt(v)}
                </span>
              ))
            : null}
        </div>
        <div className="relative min-h-0 min-w-0 flex-1">
          <div className="pointer-events-none absolute right-0 left-0" style={{ top: topPad, bottom: 0 }}>
            {style.grid
              ? scale.ticks.map((v) => (
                  <div key={`gh-${v}`} className="absolute right-0 left-0" style={{ top: `${yPct(v)}%`, borderTop: `1px solid ${style.gridColor}` }} />
                ))
              : null}
            {style.grid
              ? xLabels.map((_, i) => (
                  <div key={`gv-${i}`} className="absolute top-0 bottom-0" style={{ left: `${(i / n) * 100}%`, borderLeft: `1px solid ${style.gridColor}` }} />
                ))
              : null}
            {style.y.lineWidth > 0 ? (
              <div className="absolute top-0 bottom-0 left-0" style={{ width: Math.max(1, style.y.lineWidth), background: style.y.lineColor }} />
            ) : null}
            {style.x.lineWidth > 0 ? (
              <div className="absolute right-0 bottom-0 left-0" style={{ height: Math.max(1, style.x.lineWidth), background: style.x.lineColor }} />
            ) : null}
            {style.y.showLabels && style.y.lineWidth > 0
              ? scale.ticks.map((v) => (
                  <div key={`yt-${v}`} className="absolute left-0" style={{ top: `${yPct(v)}%`, width: 6, height: 1, background: style.y.lineColor }} />
                ))
              : null}
            {style.x.showLabels && style.x.lineWidth > 0
              ? xLabels.map((_, i) => (
                  <div
                    key={`xt-${i}`}
                    className="absolute bottom-0"
                    style={{ left: `${((i + 0.5) / n) * 100}%`, width: 1, height: 6, background: style.x.lineColor }}
                  />
                ))
              : null}
          </div>
          <div className="absolute right-0 bottom-0 left-0" style={{ top: topPad }}>
            <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
          </div>
        </div>
      </div>
      {style.x.showLabels ? (
        <div className="flex shrink-0" style={{ height: Math.max(xHeight, 22) }}>
          <div className="shrink-0" style={{ width: yWidth }} />
          <div className="relative min-w-0 flex-1">
            {xLabels.map((lab, i) => (
              <span
                key={`${lab}-${i}`}
                className="absolute leading-none"
                style={{
                  left: `${((i + 0.5) / n) * 100}%`,
                  top: 6,
                  transform: "translateX(-50%)",
                  maxWidth: `${Math.max(12, 100 / n)}%`,
                  ...xCss,
                  ...xRot,
                }}
              >
                {lab}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function scaleAxes(scale: { min: number; max: number }, style: ChartStyle): ReactElement[] {
  return [
    <XAxis key="x" dataKey="x" height={0} tick={false} axisLine={false} tickLine={false} />,
    <YAxis key="y" width={0} tick={false} axisLine={false} tickLine={false} domain={[scale.min, scale.max]} />,
    <Tooltip
      key="tt"
      contentStyle={{
        background: style.plotFill,
        border: "1px solid #cfc9bc",
        borderRadius: 8,
        color: style.x.labelStyle.color,
        fontSize: 12,
      }}
    />,
  ];
}

function HtmlLegend({ style, items }: { style: ChartStyle; items: LegendItem[] }) {
  if (!style.legend.show || items.length === 0) return null;
  const pos = style.legend.position;
  const side = pos === "left" || pos === "right";
  const rotCss = rotateCss(style.legend.rotate, style.legend.flip);
  const align =
    pos === "top-left" ? "items-start justify-start" : pos === "top-right" ? "items-end justify-end" : side ? "flex-col items-start" : "items-center justify-center";
  return (
    <div
      className={cn("shrink-0 px-3 py-1.5", side && "flex max-w-32 flex-col justify-center")}
      style={textCss(style.legend.labelStyle)}
    >
      {style.legend.title ? (
        <div
          className={cn("mb-1", pos === "top-left" ? "text-left" : pos === "top-right" ? "text-right" : "text-center")}
          style={{ ...textCss(style.legend.titleStyle), ...rotCss }}
        >
          {style.legend.title}
        </div>
      ) : null}
      <div className={cn("flex flex-wrap gap-x-3 gap-y-1", align)}>
        {items.map((it) => (
          <span key={it.name} className="inline-flex items-center gap-1.5" style={rotCss}>
            <span className="inline-block size-2.5 shrink-0 rounded-sm" style={{ background: it.fill }} />
            {it.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function PieOuterLabel({
  style,
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
}: {
  style: ChartStyle;
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  name?: string;
}) {
  if (!style.pie.showSliceLabels || cx == null || cy == null || midAngle == null || outerRadius == null) return null;
  const rad = Math.PI / 180;
  const r = outerRadius + 18;
  const x = cx + r * Math.cos(-midAngle * rad);
  const y = cy + r * Math.sin(-midAngle * rad);
  const rot = style.dataLabels.rotate || 0;
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={textCss(style.legend.labelStyle)}
      transform={labelTransform(x, y, rot, style.dataLabels.flip)}
    >
      {name}
    </text>
  );
}

function ChartShell({
  viz,
  style,
  xTitle,
  yTitle,
  legendItems,
  chartKey,
  className,
  html,
  bare,
  children,
}: {
  viz: Viz;
  style: ChartStyle;
  xTitle: string;
  yTitle: string;
  legendItems: LegendItem[];
  chartKey: string;
  className?: string;
  html?: boolean;
  bare?: boolean;
  children: ReactElement;
}) {
  const legend = <HtmlLegend style={style} items={legendItems} />;
  const pos = style.legend.position;
  const topLegend = pos === "top" || pos === "top-left" || pos === "top-right";
  const yAngle = yTitleAngle(style.y.titleRotate, style.y.titleFlip);
  const yTitleWidth = style.y.showTitle ? titleGutter(yTitle, style.y.titleStyle.size, style.y.titleRotate, style.y.titleFlip) : 0;
  const yAxisTitle = style.y.showTitle ? (
    <div className="relative shrink-0 self-stretch overflow-visible" style={{ width: yTitleWidth }}>
      <span
        className="absolute top-1/2 left-1/2 whitespace-nowrap"
        style={{
          ...textCss(style.y.titleStyle),
          transform: `translate(-50%, -50%) rotate(${yAngle}deg)`,
        }}
      >
        {yTitle}
      </span>
    </div>
  ) : null;

  const plotBody = html || bare ? (
    <div className="min-h-0 min-w-0 flex-1 overflow-visible">{children}</div>
  ) : (
    <div className="min-h-0 min-w-0 flex-1">
      <ResponsiveContainer key={chartKey} width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );

  const plot = (
    <div className="flex min-h-0 min-w-0 flex-1">
      {yAxisTitle}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {plotBody}
        {style.x.showTitle ? (
          <div
            className="flex shrink-0 items-center justify-center px-2 pb-1.5"
            style={{ minHeight: angledRoom(style.x.titleRotate, 22, 56) }}
          >
            <span style={{ ...textCss(style.x.titleStyle), ...rotateCss(style.x.titleRotate, style.x.titleFlip) }}>{xTitle}</span>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div
      className={cn("flex h-full min-h-0 flex-col", className)}
      style={{ background: style.plotFill, color: style.x.labelStyle.color }}
    >
      {viz.title ? (
        <div className="shrink-0 px-3 pt-2 text-center" style={textCss(style.x.titleStyle)}>
          {viz.title}
        </div>
      ) : null}
      {topLegend ? legend : null}
      {pos === "left" ? (
        <div className="flex min-h-0 min-w-0 flex-1">
          {legend}
          {plot}
        </div>
      ) : pos === "right" ? (
        <div className="flex min-h-0 min-w-0 flex-1">
          {plot}
          {legend}
        </div>
      ) : (
        plot
      )}
      {pos === "bottom" ? legend : null}
    </div>
  );
}

export function ChartView({
  viz,
  result,
  className,
}: {
  viz: Viz;
  result: QueryResult;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const style = mergeChartStyle(viz.style);
  const keys = result.series.map((s) => s.key);
  const xSet: string[] = [];
  for (const s of result.series) {
    for (const p of s.points) {
      const x = String(p.x);
      if (!xSet.includes(x)) xSet.push(x);
    }
  }
  const data = xSet.map((x) => {
    const row: Record<string, string | number> = { x };
    for (const s of result.series) {
      const pt = s.points.find((p) => String(p.x) === x);
      row[s.key] = pt?.y ?? 0;
      if (pt?.y2 != null) row[`${s.key}__2`] = pt.y2;
    }
    return row;
  });

  const xTitle = style.x.title.trim() || result.xLabel;
  const yTitle = style.y.title.trim() || result.yLabel;
  const dash = dashArray(style.lines.dash, style.lines.width);
  const stacked = viz.chart === "bar-stack";
  const yFmt = (n: number) =>
    formatValue(
      n,
      style.dataLabels.format === "percent" ? "auto" : style.dataLabels.format,
      style.dataLabels.decimals,
    );
  let maxV = 0;
  let yChars = 4;
  for (const row of data) {
    for (const k of keys) {
      const n = Number(row[k] ?? 0);
      if (n > maxV) maxV = n;
      yChars = Math.max(yChars, yFmt(n).length);
    }
  }
  const mag = maxV <= 0 ? 1 : 10 ** Math.floor(Math.log10(maxV));
  const top = Math.ceil((maxV * 1.08) / mag) * mag;
  for (const v of [0, top / 4, top / 2, top, top * 1.15]) yChars = Math.max(yChars, yFmt(v).length);
  const yWidth = axisBand(yChars, style.y.labelStyle.size, style.y.tickRotate, !!style.y.tickFlip, "y");
  const xChars = Math.max(4, ...xSet.map((x) => String(x).length));
  const xHeight = axisBand(xChars, style.x.labelStyle.size, style.x.tickRotate, !!style.x.tickFlip, "x");
  const axisOpts = { yWidth, xHeight };
  const chartMargin = {
    top: style.dataLabels.show ? angledRoom(style.dataLabels.rotate + (style.dataLabels.flip ? 180 : 0), 24, 28) : 12,
    right: 16,
    left: 6,
    bottom: 4,
  };
  const seriesValues: number[] = [];
  for (const row of data) {
    if (stacked) {
      let sum = 0;
      for (const k of keys) sum += Number(row[k] ?? 0);
      seriesValues.push(sum);
    } else {
      for (const k of keys) {
        seriesValues.push(Number(row[k] ?? 0));
        if (row[`${k}__2`] != null) seriesValues.push(Number(row[`${k}__2`]));
      }
    }
  }
  const topPad = chartMargin.top;
  const chartKey = JSON.stringify(style);
  const pieLike = viz.chart === "pie" || viz.chart === "donut" || viz.chart === "treemap";
  const legendItems: LegendItem[] = pieLike
    ? result.tree.map((t, i) => ({ name: t.name, fill: seriesPaint(style, t.name, i).fill }))
    : keys.map((k, i) => ({ name: k, fill: seriesPaint(style, k, i).fill }));
  const barLabel = makeBarLabel(style, stacked);
  const pointLabel = makePointLabel(style);

  const shell = (chart: ReactElement) => (
    <ChartShell
      viz={viz}
      style={style}
      xTitle={xTitle}
      yTitle={yTitle}
      legendItems={legendItems}
      chartKey={chartKey}
      className={className}
    >
      {chart}
    </ChartShell>
  );

  const framed = (labels: string[], yValues: number[], chart: (sc: { min: number; max: number; ticks: number[] }) => ReactElement) => {
    const sc = axisScale(yValues.length ? yValues : [0, 1], style);
    return (
      <ChartShell viz={viz} style={style} xTitle={xTitle} yTitle={yTitle} legendItems={legendItems} chartKey={chartKey} className={className} bare>
        <CategoryFrame style={style} xLabels={labels} scale={sc} topPad={topPad} yFmt={yFmt}>
          {chart(sc)}
        </CategoryFrame>
      </ChartShell>
    );
  };

  if (viz.chart === "kpi") {
    return (
      <div className={cn("grid h-full grid-cols-1 gap-3 p-4 sm:grid-cols-3", className)} style={{ background: style.plotFill }}>
        {result.kpi.map((k) => (
          <div key={k.label} className="flex flex-col justify-end rounded-lg px-4 py-5" style={{ color: style.x.labelStyle.color }}>
            <div className="text-xs font-medium uppercase tracking-wide opacity-50" style={textCss(style.x.labelStyle)}>
              {k.label}
            </div>
            <div className="mt-2 font-display text-3xl font-semibold tabular-nums" style={textCss(style.dataLabels.valueStyle)}>
              {formatValue(k.value, style.dataLabels.format, style.dataLabels.decimals)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viz.chart === "table") {
    return (
      <div className={cn("h-full overflow-auto p-3", className)} style={{ background: style.plotFill, color: style.x.labelStyle.color }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15">
              <th className="px-2 py-1.5 font-medium">{xTitle}</th>
              {keys.map((k) => (
                <th key={k} className="px-2 py-1.5 font-medium">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={String(row.x)} className="border-b border-ink/10">
                <td className="px-2 py-1.5">{row.x}</td>
                {keys.map((k) => (
                  <td key={k} className="px-2 py-1.5 tabular-nums">
                    {formatValue(Number(row[k] ?? 0), style.dataLabels.format, style.dataLabels.decimals)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (viz.chart === "heatmap") {
    const xs = [...new Set(result.heat.map((h) => h.x))];
    const ys = [...new Set(result.heat.map((h) => h.y))];
    const max = Math.max(1, ...result.heat.map((h) => h.v));
    const fill0 = seriesPaint(style, keys[0] ?? "Value", 0).fill;
    return (
      <ChartShell viz={viz} style={style} xTitle={xTitle} yTitle={yTitle} legendItems={legendItems} chartKey={chartKey} className={className} html>
        <div
          className="grid h-full gap-px overflow-auto p-2"
          style={{ gridTemplateColumns: `minmax(72px,1fr) repeat(${xs.length}, minmax(36px,1fr))` }}
        >
          <div />
          {xs.map((x) => (
            <div key={x} className="truncate px-1 text-center" style={{ ...textCss(style.x.labelStyle), fontSize: 10, ...rotateCss(style.x.tickRotate, style.x.tickFlip) }}>
              {style.x.showLabels ? x : ""}
            </div>
          ))}
          {ys.map((y) => (
            <div key={y} className="contents">
              <div className="truncate pr-2 text-right" style={{ ...textCss(style.y.labelStyle), fontSize: 11, ...rotateCss(style.y.tickRotate, style.y.tickFlip) }}>
                {style.y.showLabels ? y : ""}
              </div>
              {xs.map((x) => {
                const cell = result.heat.find((h) => h.x === x && h.y === y);
                const t = (cell?.v ?? 0) / max;
                return (
                  <div
                    key={x}
                    title={`${x} / ${y}: ${formatValue(cell?.v ?? 0, style.dataLabels.format, style.dataLabels.decimals)}`}
                    className="flex h-7 items-center justify-center rounded-sm"
                    style={{ background: `color-mix(in oklab, ${fill0} ${Math.round(t * 90)}%, ${style.plotFill})` }}
                  >
                    {style.dataLabels.show ? (
                      <span style={{ ...textCss(style.dataLabels.valueStyle), fontSize: 9, ...rotateCss(style.dataLabels.rotate, style.dataLabels.flip) }}>
                        {formatValue(cell?.v ?? 0, style.dataLabels.format, 0)}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ChartShell>
    );
  }

  if (!ready) {
    return <div className={cn("h-full", className)} style={{ background: style.plotFill }} />;
  }

  if (viz.chart === "histogram") {
    const vals = result.series.flatMap((s) => s.points.map((p) => p.y));
    const min = Math.min(...vals, 0);
    const max = Math.max(...vals, 1);
    const bins = 8;
    const step = (max - min) / bins || 1;
    const hist = Array.from({ length: bins }, (_, i) => {
      const lo = min + i * step;
      const hi = lo + step;
      return {
        x: `${formatValue(lo, "auto", 1)}–${formatValue(hi, "auto", 1)}`,
        n: vals.filter((v) => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length,
      };
    });
    const paint = seriesPaint(style, "n", 0);
    const labels = hist.map((h) => h.x);
    const counts = hist.map((h) => h.n);
    return framed(labels, counts, (sc) => (
      <BarChart data={hist} barCategoryGap={`${style.bars.categoryGap}%`} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        {[
          ...scaleAxes(sc, style),
          <Bar
            key="n"
            dataKey="n"
            name="Count"
            fill={paint.fill}
            stroke={paint.stroke}
            strokeWidth={paint.strokeWidth}
            radius={[style.bars.cornerRadius, style.bars.cornerRadius, 0, 0]}
            isAnimationActive={false}
            label={makeBarLabel(style)}
          />,
        ]}
      </BarChart>
    ));
  }

  if (viz.chart === "pie" || viz.chart === "donut") {
    const inner = viz.chart === "donut" ? `${style.pie.donutInner}%` : 0;
    const valueCss = textCss(style.dataLabels.valueStyle);
    return shell(
      <PieChart margin={{ top: 12, right: 80, left: 80, bottom: 12 }}>
        <Tooltip
          contentStyle={{
            background: style.plotFill,
            border: "1px solid #cfc9bc",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Pie
          data={result.tree}
          dataKey="value"
          nameKey="name"
          innerRadius={inner}
          outerRadius="68%"
          startAngle={90 - style.pie.startAngle}
          endAngle={90 - style.pie.startAngle - 360}
          paddingAngle={style.pie.padAngle}
          isAnimationActive={false}
          label={style.pie.showSliceLabels ? (props) => <PieOuterLabel style={style} {...props} /> : false}
          labelLine={style.pie.showSliceLabels}
        >
          {result.tree.map((slice, i) => {
            const paint = seriesPaint(style, slice.name, i);
            return <Cell key={slice.name} fill={paint.fill} stroke={paint.stroke} strokeWidth={paint.strokeWidth} />;
          })}
          {style.pie.showSliceValues ? (
            <LabelList
              dataKey="value"
              position="inside"
              fill={style.dataLabels.valueStyle.color}
              style={valueCss as CSSProperties}
              angle={(style.dataLabels.rotate || 0) + (style.dataLabels.flip ? 180 : 0)}
              formatter={(v: unknown) => formatValue(Number(v), style.dataLabels.format, style.dataLabels.decimals)}
            />
          ) : null}
        </Pie>
      </PieChart>,
    );
  }

  if (viz.chart === "treemap") {
    const tree = result.tree.map((t, i) => ({ ...t, fill: seriesPaint(style, t.name, i).fill }));
    return shell(
      <Treemap data={tree} dataKey="value" nameKey="name" stroke={style.plotFill} isAnimationActive={false} content={<TreemapCell style={style} />} />,
    );
  }

  if (viz.chart === "scatter") {
    return shell(
      <ScatterChart margin={chartMargin}>
        {[
          ...axes(style, { numeric: true, ...axisOpts }),
          ...result.series.map((s, i) => {
            const paint = seriesPaint(style, s.key, i);
            return (
              <Scatter
                key={s.key}
                name={s.key}
                data={s.points.map((p) => ({ x: typeof p.x === "number" ? p.x : Number(p.x) || 0, y: p.y }))}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.strokeWidth}
                isAnimationActive={false}
                label={pointLabel}
              />
            );
          }),
        ]}
      </ScatterChart>,
    );
  }

  if (viz.chart === "line") {
    return framed(xSet, seriesValues, (sc) => (
      <LineChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        {[
          ...scaleAxes(sc, style),
          ...keys.map((k, i) => {
            const paint = seriesPaint(style, k, i);
            return (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                name={k}
                stroke={paint.stroke}
                strokeWidth={style.lines.width}
                strokeDasharray={dash}
                dot={style.lines.dots ? { fill: paint.fill, r: 3 } : false}
                isAnimationActive={false}
                label={pointLabel}
              />
            );
          }),
        ]}
      </LineChart>
    ));
  }

  if (viz.chart === "area") {
    return framed(xSet, seriesValues, (sc) => (
      <AreaChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        {[
          ...scaleAxes(sc, style),
          ...keys.map((k, i) => {
            const paint = seriesPaint(style, k, i);
            return (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                name={k}
                stroke={paint.stroke}
                fill={paint.fill}
                fillOpacity={0.28}
                strokeWidth={style.lines.width}
                strokeDasharray={dash}
                isAnimationActive={false}
                label={pointLabel}
              />
            );
          }),
        ]}
      </AreaChart>
    ));
  }

  if (viz.chart === "combo") {
    const paint0 = seriesPaint(style, keys[0] ?? "Value", 0);
    const paint1 = seriesPaint(style, keys[0] ? `${keys[0]}__2` : "Value2", 1);
    return framed(xSet, seriesValues, (sc) => (
      <ComposedChart data={data} barCategoryGap={`${style.bars.categoryGap}%`} barGap={style.bars.barGap} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        {[
          ...scaleAxes(sc, style),
          keys[0] ? (
            <Bar
              key="bar"
              dataKey={keys[0]}
              name={keys[0]}
              fill={paint0.fill}
              stroke={paint0.stroke}
              strokeWidth={paint0.strokeWidth}
              radius={[style.bars.cornerRadius, style.bars.cornerRadius, 0, 0]}
              isAnimationActive={false}
              label={makeBarLabel(style)}
            />
          ) : (
            <g key="no-bar" />
          ),
          keys[0] ? (
            <Line
              key="line"
              type="monotone"
              dataKey={`${keys[0]}__2`}
              name="Series 2"
              stroke={paint1.stroke}
              strokeWidth={style.lines.width}
              dot={style.lines.dots}
              isAnimationActive={false}
            />
          ) : (
            <g key="no-line" />
          ),
        ]}
      </ComposedChart>
    ));
  }

  return framed(xSet, seriesValues, (sc) => (
    <BarChart data={data} barCategoryGap={`${style.bars.categoryGap}%`} barGap={style.bars.barGap} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
      {[
        ...scaleAxes(sc, style),
        ...keys.map((k, i) => {
          const paint = seriesPaint(style, k, i);
          return (
            <Bar
              key={k}
              dataKey={k}
              name={k}
              stackId={stacked ? "a" : undefined}
              fill={paint.fill}
              stroke={paint.stroke}
              strokeWidth={paint.strokeWidth}
              radius={stacked ? 0 : [style.bars.cornerRadius, style.bars.cornerRadius, 0, 0]}
              isAnimationActive={false}
              label={barLabel}
            />
          );
        }),
      ]}
    </BarChart>
  ));
}

function TreemapCell({
  x,
  y,
  width,
  height,
  name,
  value,
  fill,
  style,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  fill?: string;
  style: ChartStyle;
}) {
  if (x == null || y == null || width == null || height == null) return null;
  const color = fill ?? PALETTE[0];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} stroke={style.plotFill} />
      {width > 40 && height > 22 ? (
        <text x={x + 6} y={y + 16} fill={contrastOn(color)} fontSize={11}>
          {name}
          {style.dataLabels.show
            ? ` ${formatValue(Number(value ?? 0), style.dataLabels.format, style.dataLabels.decimals)}`
            : ""}
        </text>
      ) : null}
    </g>
  );
}

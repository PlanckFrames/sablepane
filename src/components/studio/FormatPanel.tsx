import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { ChartStyle, FontId, LabelPos, LegendPos, LineDash, NumberFormat, TextStyle, Viz } from "@/lib/bi/types";
import { FONT_OPTIONS, PALETTE } from "@/lib/bi/types";
import { mergeChartStyle, parseHex, seriesPaint } from "@/lib/bi/chart-style";
import type { QueryResult } from "@/lib/bi/engine";
import { useStudio } from "@/store/studio";
import { cn } from "@/lib/utils";
import { ColorSwatch } from "./ColorPicker";

export function FormatPanel({ viz, result }: { viz: Viz; result: QueryResult }) {
  const patchStyle = useStudio((s) => s.patchStyle);
  const style = mergeChartStyle(viz.style);
  const set = (patch: unknown) => patchStyle(viz.id, patch);
  const keys =
    viz.chart === "pie" || viz.chart === "donut" || viz.chart === "treemap"
      ? result.tree.map((t) => t.name)
      : result.series.map((s) => s.key);
  const cartesian = !["pie", "donut", "kpi", "table", "treemap"].includes(viz.chart);
  const isBar = viz.chart === "bar" || viz.chart === "bar-stack" || viz.chart === "histogram" || viz.chart === "combo";
  const isLine = viz.chart === "line" || viz.chart === "area" || viz.chart === "combo" || viz.chart === "scatter";
  const isPie = viz.chart === "pie" || viz.chart === "donut";

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-auto bg-panel lg:w-72 lg:shrink-0 lg:border-l lg:border-border">
      <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
        Format chart
      </div>
      <Section title="Chart area">
        <ColorRow label="Plot fill" value={style.plotFill} onChange={(v) => set({ plotFill: v })} />
        <Toggle label="Gridlines" checked={style.grid} onChange={(v) => set({ grid: v })} />
        {style.grid ? <ColorRow label="Grid color" value={style.gridColor} onChange={(v) => set({ gridColor: v })} /> : null}
      </Section>

      {cartesian ? (
        <>
          <AxisSection axis="x" label="Horizontal axis" auto={result.xLabel} style={style} set={set} />
          <AxisSection axis="y" label="Vertical axis" auto={result.yLabel} style={style} set={set} showScale />
        </>
      ) : null}

      <Section title="Legend">
        <Toggle label="Show legend" checked={style.legend.show} onChange={(v) => set({ legend: { show: v } })} />
        <Field label="Legend title">
          <input
            className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
            value={style.legend.title}
            placeholder="Optional heading"
            onChange={(e) => set({ legend: { title: e.target.value } })}
          />
        </Field>
        <Field label="Position">
          <select
            className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
            value={style.legend.position}
            onChange={(e) => set({ legend: { position: e.target.value as LegendPos } })}
          >
            <option value="top">Top</option>
            <option value="top-left">Top left</option>
            <option value="top-right">Top right</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <RotateField
          label="Legend rotation"
          value={style.legend.rotate}
          flip={style.legend.flip}
          onChange={(v) => set({ legend: { rotate: v } })}
          onFlip={(v) => set({ legend: { flip: v } })}
        />
        <TextEditor label="Legend text" value={style.legend.labelStyle} onChange={(v) => set({ legend: { labelStyle: v } })} />
        {style.legend.title ? (
          <TextEditor label="Legend heading" value={style.legend.titleStyle} onChange={(v) => set({ legend: { titleStyle: v } })} />
        ) : null}
      </Section>

      <Section title="Series">
        <p className="mb-2 text-[11px] text-muted">Fill, outline, and edge thickness for each series or slice.</p>
        {keys.map((k, i) => {
          const paint = seriesPaint(style, k, i);
          return (
            <div key={k} className="mb-2 rounded-md border border-border bg-bg p-2">
              <div className="mb-1 truncate text-xs font-medium">{k}</div>
              <div className="grid grid-cols-2 gap-2">
                <ColorRow label="Fill" value={paint.fill} onChange={(v) => set({ series: { [k]: { fill: v, stroke: paint.stroke, strokeWidth: paint.strokeWidth } } })} />
                <ColorRow label="Edge" value={paint.stroke} onChange={(v) => set({ series: { [k]: { fill: paint.fill, stroke: v, strokeWidth: paint.strokeWidth } } })} />
              </div>
              <Field label={`Edge ${paint.strokeWidth}px`}>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={1}
                  value={paint.strokeWidth}
                  onChange={(e) =>
                    set({ series: { [k]: { fill: paint.fill, stroke: paint.stroke, strokeWidth: Number(e.target.value) } } })
                  }
                />
              </Field>
              <div className="mt-1 flex flex-wrap gap-1">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    className={cn("size-5 rounded-sm border", paint.fill === c ? "border-fg" : "border-transparent")}
                    style={{ background: c }}
                    onClick={() => set({ series: { [k]: { fill: c, stroke: c, strokeWidth: paint.strokeWidth } } })}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="Data labels">
        <Toggle
          label={isPie ? "Values on slices" : "Show values"}
          checked={isPie ? style.pie.showSliceValues : style.dataLabels.show}
          onChange={(v) => (isPie ? set({ pie: { showSliceValues: v } }) : set({ dataLabels: { show: v } }))}
        />
        {isPie ? (
          <Toggle label="Names next to slices" checked={style.pie.showSliceLabels} onChange={(v) => set({ pie: { showSliceLabels: v } })} />
        ) : (
          <Field label="Position">
            <select
              className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
              value={style.dataLabels.position}
              onChange={(e) => set({ dataLabels: { position: e.target.value as LabelPos } })}
            >
              <option value="end">Outside / on top</option>
              <option value="center">Center</option>
              <option value="inside">Inside</option>
            </select>
          </Field>
        )}
        <Field label="Number format">
          <select
            className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
            value={style.dataLabels.format}
            onChange={(e) => set({ dataLabels: { format: e.target.value as NumberFormat } })}
          >
            <option value="auto">General</option>
            <option value="number">Number</option>
            <option value="compact">Compact (k / M)</option>
            <option value="percent">Percent</option>
            <option value="currency">Currency</option>
          </select>
        </Field>
        <Field label={`Decimals (${style.dataLabels.decimals})`}>
          <input
            type="range"
            min={0}
            max={4}
            value={style.dataLabels.decimals}
            onChange={(e) => set({ dataLabels: { decimals: Number(e.target.value) } })}
          />
        </Field>
        <TextEditor label="Value font" value={style.dataLabels.valueStyle} onChange={(v) => set({ dataLabels: { valueStyle: v } })} />
        <RotateField
          label="Value rotation"
          value={style.dataLabels.rotate}
          flip={style.dataLabels.flip}
          onChange={(v) => set({ dataLabels: { rotate: v } })}
          onFlip={(v) => set({ dataLabels: { flip: v } })}
        />
      </Section>

      {isBar ? (
        <Section title="Bars">
          <Field label={`Gap between categories (${style.bars.categoryGap}%)`}>
            <input
              type="range"
              min={0}
              max={60}
              value={style.bars.categoryGap}
              onChange={(e) => set({ bars: { categoryGap: Number(e.target.value) } })}
            />
          </Field>
          <Field label={`Gap between series (${style.bars.barGap}px)`}>
            <input
              type="range"
              min={0}
              max={24}
              value={style.bars.barGap}
              onChange={(e) => set({ bars: { barGap: Number(e.target.value) } })}
            />
          </Field>
          <Field label={`Corner radius (${style.bars.cornerRadius}px)`}>
            <input
              type="range"
              min={0}
              max={12}
              value={style.bars.cornerRadius}
              onChange={(e) => set({ bars: { cornerRadius: Number(e.target.value) } })}
            />
          </Field>
        </Section>
      ) : null}

      {isLine ? (
        <Section title="Lines">
          <Field label={`Weight (${style.lines.width}px)`}>
            <input
              type="range"
              min={1}
              max={8}
              value={style.lines.width}
              onChange={(e) => set({ lines: { width: Number(e.target.value) } })}
            />
          </Field>
          <Field label="Dash">
            <select
              className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
              value={style.lines.dash}
              onChange={(e) => set({ lines: { dash: e.target.value as LineDash } })}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </Field>
          <Toggle label="Markers" checked={style.lines.dots} onChange={(v) => set({ lines: { dots: v } })} />
        </Section>
      ) : null}

      {isPie ? (
        <Section title="Pie">
          <Field label={`Rotation (${style.pie.startAngle}°)`}>
            <input
              type="range"
              min={0}
              max={360}
              value={style.pie.startAngle}
              onChange={(e) => set({ pie: { startAngle: Number(e.target.value) } })}
            />
          </Field>
          <Field label={`Gap between slices (${style.pie.padAngle}°)`}>
            <input
              type="range"
              min={0}
              max={12}
              value={style.pie.padAngle}
              onChange={(e) => set({ pie: { padAngle: Number(e.target.value) } })}
            />
          </Field>
          {viz.chart === "donut" ? (
            <Field label={`Hole (${style.pie.donutInner}%)`}>
              <input
                type="range"
                min={20}
                max={80}
                value={style.pie.donutInner}
                onChange={(e) => set({ pie: { donutInner: Number(e.target.value) } })}
              />
            </Field>
          ) : null}
        </Section>
      ) : null}
    </aside>
  );
}

function AxisSection({
  axis,
  label,
  auto,
  style,
  set,
  showScale,
}: {
  axis: "x" | "y";
  label: string;
  auto: string;
  style: ChartStyle;
  set: (patch: unknown) => void;
  showScale?: boolean;
}) {
  const a = style[axis];
  return (
    <Section title={label}>
      <Toggle label="Show title" checked={a.showTitle} onChange={(v) => set({ [axis]: { showTitle: v } })} />
      <Field label="Title">
        <input
          className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
          value={a.title || auto}
          onChange={(e) => set({ [axis]: { title: e.target.value === auto ? "" : e.target.value } })}
        />
      </Field>
      <Toggle label="Show tick labels" checked={a.showLabels} onChange={(v) => set({ [axis]: { showLabels: v } })} />
      <ColorRow label="Axis line" value={a.lineColor} onChange={(v) => set({ [axis]: { lineColor: v } })} />
      <Field label={`Line weight (${a.lineWidth}px)`}>
        <input
          type="range"
          min={0}
          max={4}
          value={a.lineWidth}
          onChange={(e) => set({ [axis]: { lineWidth: Number(e.target.value) } })}
        />
      </Field>
      {showScale ? (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Min">
            <input
              className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
              placeholder="Auto"
              value={a.min}
              onChange={(e) => set({ [axis]: { min: e.target.value } })}
            />
          </Field>
          <Field label="Max">
            <input
              className="h-9 w-full rounded-md border border-border bg-bg px-2 text-xs"
              placeholder="Auto"
              value={a.max}
              onChange={(e) => set({ [axis]: { max: e.target.value } })}
            />
          </Field>
        </div>
      ) : null}
      <TextEditor label="Title font" value={a.titleStyle} onChange={(v) => set({ [axis]: { titleStyle: v } })} />
      <RotateField
        label="Title rotation"
        hint={axis === "y" ? "0° is vertical along the axis" : undefined}
        value={a.titleRotate}
        flip={a.titleFlip}
        onChange={(v) => set({ [axis]: { titleRotate: v } })}
        onFlip={(v) => set({ [axis]: { titleFlip: v } })}
      />
      <TextEditor label="Label font" value={a.labelStyle} onChange={(v) => set({ [axis]: { labelStyle: v } })} />
      <RotateField
        label="Tick rotation"
        value={a.tickRotate}
        flip={a.tickFlip}
        onChange={(v) => set({ [axis]: { tickRotate: v } })}
        onFlip={(v) => set({ [axis]: { tickFlip: v } })}
      />
    </Section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="border-b border-border">
      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold">{title}</summary>
      <div className="space-y-2 px-3 pb-3">{children}</div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">{label}</div>
      {children}
    </label>
  );
}

function RotateField({
  label,
  hint,
  value,
  flip,
  onChange,
  onFlip,
}: {
  label: string;
  hint?: string;
  value: number;
  flip: boolean;
  onChange: (n: number) => void;
  onFlip: (v: boolean) => void;
}) {
  const deg = Number.isFinite(value) ? value : 0;
  const preset = deg === 0 ? "0" : deg === 45 ? "45" : deg === 90 ? "90" : deg === 135 ? "135" : "custom";
  return (
    <div>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">{label}</div>
      {hint ? <div className="mb-1 text-[10px] text-subtle">{hint}</div> : null}
      <div className="grid grid-cols-4 gap-1">
        {([0, 45, 90, 135] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={cn(
              "h-8 rounded-sm text-[11px]",
              preset === String(d) ? "bg-primary text-primary-fg" : "border border-border bg-bg",
            )}
            onClick={() => onChange(d)}
          >
            {d}°
          </button>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-1">
        <button
          type="button"
          className={cn("h-8 rounded-sm text-[11px]", preset === "custom" ? "bg-primary text-primary-fg" : "border border-border bg-bg")}
          onClick={() => onChange(preset === "custom" ? deg : 30)}
        >
          Custom
        </button>
        <button
          type="button"
          className={cn("h-8 rounded-sm text-[11px]", flip ? "bg-primary text-primary-fg" : "border border-border bg-bg")}
          onClick={() => onFlip(!flip)}
        >
          Flip / mirror
        </button>
      </div>
      {preset === "custom" ? (
        <input
          type="number"
          min={-180}
          max={180}
          step={1}
          aria-label={`${label} degrees`}
          className="mt-1.5 h-8 w-full rounded-md border border-border bg-bg px-2 text-xs"
          value={deg}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      ) : null}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-0 text-left text-xs"
    >
      <span>{label}</span>
      <span className={cn("inline-flex h-5 w-9 items-center rounded-full p-0.5", checked ? "bg-accent" : "bg-raised")}>
        <span className={cn("size-4 rounded-full bg-fg transition-transform", checked ? "translate-x-4 bg-primary-fg" : "")} />
      </span>
    </button>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex min-h-9 flex-wrap items-center justify-between gap-2 text-xs">
      <span className="text-muted">{label}</span>
      <span className="inline-flex items-center gap-1.5">
        <input type="color" className="size-7 cursor-pointer rounded-sm border border-border" value={toHex(value)} onChange={(e) => onChange(e.target.value)} />
        <HexField value={value} onChange={onChange} />
      </span>
    </label>
  );
}

function HexField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const hex = toHex(value);
  const [text, setText] = useState(hex);
  useEffect(() => {
    setText(hex);
  }, [hex]);
  return (
    <input
      aria-label="Hex color"
      spellCheck={false}
      className="h-8 w-[4.75rem] rounded-sm border border-border bg-bg px-1.5 font-mono text-[11px] uppercase"
      value={text}
      onChange={(e) => {
        const next = e.target.value;
        setText(next);
        const parsed = parseHex(next);
        if (parsed) onChange(parsed);
      }}
      onBlur={() => setText(toHex(value))}
    />
  );
}

function TextEditor({ label, value, onChange }: { label: string; value: TextStyle; onChange: (v: TextStyle) => void }) {
  const set = (patch: Partial<TextStyle>) => onChange({ ...value, ...patch });
  return (
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">{label}</div>
      <select
        className="mb-1.5 h-8 w-full rounded-sm border border-border bg-panel px-2 text-[11px]"
        value={value.font}
        onChange={(e) => set({ font: e.target.value as FontId })}
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={8}
          max={32}
          className="h-8 w-14 rounded-sm border border-border bg-panel px-1 text-[11px]"
          value={value.size}
          onChange={(e) => set({ size: Number(e.target.value) || 12 })}
        />
        <StyleBtn active={value.bold} onClick={() => set({ bold: !value.bold })}>
          B
        </StyleBtn>
        <StyleBtn active={value.italic} onClick={() => set({ italic: !value.italic })}>
          <span className="italic">I</span>
        </StyleBtn>
        <StyleBtn active={value.underline} onClick={() => set({ underline: !value.underline })}>
          <span className="underline">U</span>
        </StyleBtn>
      </div>
      <div className="mt-1.5">
        <ColorSwatch label="Font color" value={value.color} onChange={(c) => set({ color: c })} />
      </div>
    </div>
  );
}

function StyleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("size-8 rounded-sm text-xs font-semibold", active ? "bg-primary text-primary-fg" : "bg-panel text-muted")}
    >
      {children}
    </button>
  );
}

function toHex(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return "#1c2128";
}

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Pipette } from "lucide-react";
import { parseHex } from "@/lib/bi/chart-style";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
};

function toHex(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c.toLowerCase();
  return parseHex(c) ?? "#1c2128";
}

function hexToRgb(hex: string) {
  const h = toHex(hex).slice(1);
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function rgbToHex(r: number, g: number, b: number) {
  const n = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${n(r)}${n(g)}${n(b)}`;
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rp = 0,
    gp = 0,
    bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

function hueHex(h: number) {
  const { r, g, b } = hsvToRgb(h, 1, 1);
  return rgbToHex(r, g, b);
}

export function ColorPicker({ value, onChange, label }: Props) {
  const hex = toHex(value);
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const [text, setText] = useState(hex);
  const svRef = useRef<HTMLDivElement>(null);
  const dropOk = typeof window !== "undefined" && "EyeDropper" in window;

  useEffect(() => setText(hex), [hex]);

  const setRgb = (r: number, g: number, b: number) => onChange(rgbToHex(r, g, b));
  const setHsv = (h: number, s: number, v: number) => {
    const n = hsvToRgb(h, s, v);
    setRgb(n.r, n.g, n.b);
  };

  const onSv = (e: PointerEvent) => {
    const el = svRef.current;
    if (!el) return;
    const rec = el.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - rec.left) / rec.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rec.top) / rec.height));
    setHsv(hsv.h, s, v);
  };

  const pickEye = async () => {
    try {
      const Eye = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const { sRGBHex } = await new Eye().open();
      const parsed = parseHex(sRGBHex);
      if (parsed) onChange(parsed);
    } catch {
      /* user cancel */
    }
  };

  const hueColor = useMemo(() => hueHex(hsv.h), [hsv.h]);

  return (
    <div className="space-y-2">
      {label ? <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div> : null}
      <div
        ref={svRef}
        className="relative h-28 w-full cursor-crosshair rounded-md border border-border"
        style={{ background: `linear-gradient(to right, #fff, ${hueColor})` }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          onSv(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons) onSv(e);
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-md" style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={360}
        aria-label="Hue"
        value={Math.round(hsv.h)}
        onChange={(e) => setHsv(Number(e.target.value), hsv.s, hsv.v)}
        className="h-3 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background:
            "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
      />
      <div className="grid grid-cols-3 gap-1">
        {(["r", "g", "b"] as const).map((ch) => (
          <label key={ch} className="block">
            <span className="text-[10px] uppercase text-muted">{ch}</span>
            <input
              type="number"
              min={0}
              max={255}
              className="h-8 w-full rounded-sm border border-border bg-bg px-1 font-mono text-[11px]"
              value={rgb[ch]}
              onChange={(e) => {
                const n = Number(e.target.value);
                setRgb(ch === "r" ? n : rgb.r, ch === "g" ? n : rgb.g, ch === "b" ? n : rgb.b);
              }}
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <input type="color" className="size-8 cursor-pointer rounded-sm border border-border" value={hex} onChange={(e) => onChange(e.target.value)} />
        <input
          aria-label="Hex color"
          spellCheck={false}
          className="h-8 min-w-0 flex-1 rounded-sm border border-border bg-bg px-1.5 font-mono text-[11px] uppercase"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const parsed = parseHex(e.target.value);
            if (parsed) onChange(parsed);
          }}
          onBlur={() => setText(hex)}
        />
        {dropOk ? (
          <button type="button" aria-label="Eyedropper" className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-bg" onClick={() => void pickEye()}>
            <Pipette className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ColorSwatch({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className={cn("flex h-8 w-full items-center gap-2 rounded-sm border border-border bg-bg px-2 text-left text-[11px]")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="size-4 rounded-sm border border-border" style={{ background: toHex(value) }} />
        <span className="font-mono uppercase">{toHex(value)}</span>
        {label ? <span className="ml-auto text-muted">{label}</span> : null}
      </button>
      {open ? (
        <div className="mt-2 rounded-md border border-border bg-panel p-2">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}

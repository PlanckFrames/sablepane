import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Sparkles, c as Moon, d as LayoutGrid, f as Download, i as Sun, l as MessageSquare, m as ChartColumn, o as SlidersHorizontal, p as Database, r as Trash2, s as Plus, t as Upload, u as Link2 } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { _ as Cell, a as PieChart, b as Legend, c as YAxis, d as Area, f as Line, g as LabelList, h as Pie, i as Treemap, l as XAxis, m as Bar, n as AreaChart, o as BarChart, p as CartesianGrid, r as ScatterChart, s as LineChart, t as ComposedChart, u as Scatter, v as ResponsiveContainer, y as Tooltip } from "../_libs/recharts+[...].mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BygfggQ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHARTS = [
	{
		id: "bar",
		label: "Bar"
	},
	{
		id: "bar-stack",
		label: "Stacked"
	},
	{
		id: "line",
		label: "Line"
	},
	{
		id: "area",
		label: "Area"
	},
	{
		id: "scatter",
		label: "Scatter"
	},
	{
		id: "pie",
		label: "Pie"
	},
	{
		id: "donut",
		label: "Donut"
	},
	{
		id: "kpi",
		label: "KPI"
	},
	{
		id: "table",
		label: "Table"
	},
	{
		id: "heatmap",
		label: "Heat"
	},
	{
		id: "treemap",
		label: "Treemap"
	},
	{
		id: "histogram",
		label: "Histogram"
	},
	{
		id: "combo",
		label: "Combo"
	}
];
var AGGS = [
	{
		id: "sum",
		label: "Sum"
	},
	{
		id: "avg",
		label: "Average"
	},
	{
		id: "median",
		label: "Median"
	},
	{
		id: "min",
		label: "Min"
	},
	{
		id: "max",
		label: "Max"
	},
	{
		id: "count",
		label: "Count"
	},
	{
		id: "dcount",
		label: "Distinct"
	}
];
var PALETTE = [
	"#3d5a4c",
	"#8a6a4a",
	"#4a5e78",
	"#7a4e4a",
	"#5a6e52",
	"#6a5a78",
	"#4e6e6a",
	"#7a6248"
];
var FONT_STACKS = {
	plex: "\"IBM Plex Sans\", \"Segoe UI\", system-ui, sans-serif",
	"plex-mono": "\"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
	georgia: "Georgia, \"Times New Roman\", serif",
	arial: "Arial, Helvetica, sans-serif",
	times: "\"Times New Roman\", Times, serif"
};
var FONT_OPTIONS = [
	{
		id: "plex",
		label: "Plex Sans"
	},
	{
		id: "plex-mono",
		label: "Plex Mono"
	},
	{
		id: "georgia",
		label: "Georgia"
	},
	{
		id: "arial",
		label: "Arial"
	},
	{
		id: "times",
		label: "Times"
	}
];
var INK = "#1c2128";
function defaultText(size = 12, color = INK, bold = false) {
	return {
		font: "plex",
		size,
		color,
		bold,
		italic: false,
		underline: false
	};
}
function defaultAxis() {
	return {
		title: "",
		showTitle: true,
		showLabels: true,
		titleStyle: defaultText(12, INK, true),
		labelStyle: defaultText(11, INK),
		lineColor: "#c4bfb4",
		lineWidth: 1,
		min: "",
		max: ""
	};
}
function defaultChartStyle() {
	return {
		plotFill: "#faf7f0",
		grid: true,
		gridColor: "#d8d3c8",
		x: defaultAxis(),
		y: defaultAxis(),
		legend: {
			show: true,
			title: "",
			position: "bottom",
			titleStyle: defaultText(11, INK, true),
			labelStyle: defaultText(11, INK)
		},
		dataLabels: {
			show: false,
			position: "end",
			format: "auto",
			decimals: 1,
			valueStyle: defaultText(10, INK, true)
		},
		pie: {
			showSliceLabels: true,
			showSliceValues: true,
			startAngle: 0,
			padAngle: 1,
			donutInner: 52
		},
		bars: {
			categoryGap: 22,
			barGap: 4,
			cornerRadius: 3
		},
		lines: {
			width: 2,
			dots: false,
			dash: "solid"
		},
		series: {}
	};
}
function isObj(v) {
	return !!v && typeof v === "object" && !Array.isArray(v);
}
function deepMerge(base, patch) {
	if (!isObj(base) || !isObj(patch)) return patch ?? base;
	const out = { ...base };
	for (const [k, v] of Object.entries(patch)) out[k] = isObj(out[k]) && isObj(v) ? deepMerge(out[k], v) : v;
	return out;
}
function mergeChartStyle(partial) {
	return deepMerge(defaultChartStyle(), partial ?? {});
}
function patchChartStyle(current, patch) {
	return deepMerge(mergeChartStyle(current), patch);
}
function seriesPaint(style, key, index) {
	const fallback = {
		fill: PALETTE[index % PALETTE.length],
		stroke: PALETTE[index % PALETTE.length],
		strokeWidth: 1
	};
	const custom = style.series[key];
	return custom ? {
		...fallback,
		...custom
	} : fallback;
}
function textCss(t) {
	return {
		fontFamily: FONT_STACKS[t.font],
		fontSize: t.size,
		fill: t.color,
		color: t.color,
		fontWeight: t.bold ? 700 : 400,
		fontStyle: t.italic ? "italic" : "normal",
		textDecoration: t.underline ? "underline" : "none"
	};
}
function formatValue(n, format, decimals) {
	if (!Number.isFinite(n)) return "";
	if (format === "percent") return `${n.toFixed(decimals)}%`;
	if (format === "currency") return n.toLocaleString(void 0, {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
	if (format === "number") return n.toLocaleString(void 0, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
	const a = Math.abs(n);
	if (format === "compact" || format === "auto" && a >= 1e3) {
		if (a >= 1e6) return `${(n / 1e6).toFixed(Math.min(decimals, 2))}M`;
		if (a >= 1e3) return `${(n / 1e3).toFixed(Math.min(decimals, 1))}k`;
	}
	if (Number.isInteger(n) && format === "auto") return String(n);
	return n.toFixed(decimals);
}
function contrastOn(hex) {
	const h = hex.replace("#", "");
	if (h.length < 6) return INK;
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	return r * .299 + g * .587 + b * .114 > 160 ? INK : "#f4f1ea";
}
function dashArray(dash, width) {
	if (dash === "dashed") return `${width * 4} ${width * 3}`;
	if (dash === "dotted") return `${width} ${width * 2}`;
}
function yDomain(style) {
	const min = style.y.min.trim() === "" ? void 0 : Number(style.y.min);
	const max = style.y.max.trim() === "" ? void 0 : Number(style.y.max);
	if (min == null && max == null) return void 0;
	return [Number.isFinite(min) ? min : "auto", Number.isFinite(max) ? max : "auto"];
}
Object.keys(FONT_STACKS);
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function barLabelPos(pos, stacked) {
	if (stacked) return pos === "end" ? "insideTop" : "center";
	if (pos === "center" || pos === "inside") return "center";
	return "top";
}
function ValueLabels({ dataKey, style, stacked }) {
	if (!style.dataLabels.show) return null;
	const css = textCss(style.dataLabels.valueStyle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
		dataKey,
		position: barLabelPos(style.dataLabels.position, !!stacked),
		formatter: (v) => formatValue(Number(v), style.dataLabels.format, style.dataLabels.decimals),
		style: css,
		fill: style.dataLabels.valueStyle.color
	});
}
function ChartLegend({ style }) {
	if (!style.legend.show) return null;
	const pos = style.legend.position;
	const verticalAlign = pos === "top" ? "top" : pos === "bottom" ? "bottom" : "middle";
	const align = pos === "left" ? "left" : pos === "right" ? "right" : "center";
	const layout = pos === "left" || pos === "right" ? "vertical" : "horizontal";
	const labelCss = textCss(style.legend.labelStyle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
		verticalAlign,
		align,
		layout,
		iconType: "square",
		iconSize: 10,
		wrapperStyle: {
			paddingTop: pos === "bottom" ? 8 : 0,
			paddingBottom: pos === "top" ? 8 : 0
		},
		content: (props) => {
			const payload = props.payload ?? [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex flex-wrap items-center gap-x-3 gap-y-1 px-2", pos === "left" || pos === "right" ? "flex-col items-start" : "justify-center"),
				style: labelCss,
				children: [style.legend.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full text-center",
					style: textCss(style.legend.titleStyle),
					children: style.legend.title
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center justify-center gap-x-3 gap-y-1",
					children: payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block size-2.5 rounded-sm",
							style: { background: String(p.color) }
						}), p.value]
					}, String(p.value)))
				})]
			});
		}
	});
}
function Axes({ style, xTitle, yTitle, yTick, numeric }) {
	const xLabelCss = textCss(style.x.labelStyle);
	const yLabelCss = textCss(style.y.labelStyle);
	const xTitleCss = textCss(style.x.titleStyle);
	const yTitleCss = textCss(style.y.titleStyle);
	const domain = yDomain(style);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		style.grid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
			stroke: style.gridColor,
			strokeDasharray: "3 3",
			vertical: false
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
			dataKey: "x",
			type: numeric ? "number" : "category",
			hide: !style.x.showLabels && !style.x.showTitle,
			tick: style.x.showLabels ? {
				fill: style.x.labelStyle.color,
				fontSize: style.x.labelStyle.size,
				fontFamily: xLabelCss.fontFamily,
				fontWeight: xLabelCss.fontWeight,
				fontStyle: xLabelCss.fontStyle
			} : false,
			axisLine: {
				stroke: style.x.lineColor,
				strokeWidth: style.x.lineWidth
			},
			tickLine: { stroke: style.x.lineColor },
			label: style.x.showTitle ? {
				value: xTitle,
				position: "insideBottom",
				offset: -2,
				style: xTitleCss
			} : void 0,
			height: style.x.showTitle ? 50 : 30,
			interval: "preserveStartEnd"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
			hide: !style.y.showLabels && !style.y.showTitle,
			tick: style.y.showLabels ? {
				fill: style.y.labelStyle.color,
				fontSize: style.y.labelStyle.size,
				fontFamily: yLabelCss.fontFamily
			} : false,
			axisLine: {
				stroke: style.y.lineColor,
				strokeWidth: style.y.lineWidth
			},
			tickLine: { stroke: style.y.lineColor },
			tickFormatter: yTick ?? ((n) => formatValue(n, style.dataLabels.format === "percent" ? "auto" : style.dataLabels.format, style.dataLabels.decimals)),
			domain,
			label: style.y.showTitle ? {
				value: yTitle,
				angle: -90,
				position: "insideLeft",
				style: {
					...yTitleCss,
					textAnchor: "middle"
				}
			} : void 0,
			width: style.y.showTitle ? 78 : 48
		})
	] });
}
function tooltipBox(style) {
	return { contentStyle: {
		background: style.plotFill,
		border: "1px solid #cfc9bc",
		borderRadius: 8,
		color: style.x.labelStyle.color,
		fontSize: 12
	} };
}
function PieOuterLabel({ style, cx, cy, midAngle, outerRadius, name, value, percent }) {
	if (!style.pie.showSliceLabels || cx == null || cy == null || midAngle == null || outerRadius == null) return null;
	const rad = Math.PI / 180;
	const r = outerRadius + 18;
	const x = cx + r * Math.cos(-midAngle * rad);
	const y = cy + r * Math.sin(-midAngle * rad);
	const val = style.dataLabels.format === "percent" ? formatValue((percent ?? 0) * 100, "percent", style.dataLabels.decimals) : formatValue(Number(value ?? 0), style.dataLabels.format, style.dataLabels.decimals);
	const text = style.pie.showSliceValues ? `${name} · ${val}` : String(name ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y,
		textAnchor: x > cx ? "start" : "end",
		dominantBaseline: "central",
		style: textCss(style.legend.labelStyle),
		children: text
	});
}
function ChartView({ viz, result, className }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	const style = mergeChartStyle(viz.style);
	const keys = result.series.map((s) => s.key);
	const xSet = [];
	for (const s of result.series) for (const p of s.points) {
		const x = String(p.x);
		if (!xSet.includes(x)) xSet.push(x);
	}
	const data = xSet.map((x) => {
		const row = { x };
		for (const s of result.series) {
			const pt = s.points.find((p) => String(p.x) === x);
			row[s.key] = pt?.y ?? 0;
			if (pt?.y2 != null) row[`${s.key}__2`] = pt.y2;
		}
		return row;
	});
	const xTitle = style.x.title.trim() || result.xLabel;
	const yTitle = style.y.title.trim() || result.yLabel;
	const tooltip = tooltipBox(style);
	const dash = dashArray(style.lines.dash, style.lines.width);
	const stacked = viz.chart === "bar-stack";
	const chartMargin = {
		top: 12,
		right: 16,
		left: 6,
		bottom: 4
	};
	if (viz.chart === "kpi") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid h-full grid-cols-1 gap-3 p-4 sm:grid-cols-3", className),
		style: { background: style.plotFill },
		children: result.kpi.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-end rounded-lg px-4 py-5",
			style: {
				background: style.plotFill,
				color: style.x.labelStyle.color
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium uppercase tracking-wide opacity-50",
				style: textCss(style.x.labelStyle),
				children: k.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-3xl font-semibold tabular-nums",
				style: textCss(style.dataLabels.valueStyle),
				children: formatValue(k.value, style.dataLabels.format, style.dataLabels.decimals)
			})]
		}, k.label))
	});
	if (viz.chart === "table") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-full overflow-auto p-3", className),
		style: {
			background: style.plotFill,
			color: style.x.labelStyle.color
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-ink/15",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-2 py-1.5 font-medium",
					children: xTitle
				}), keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-2 py-1.5 font-medium",
					children: k
				}, k))]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-ink/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-2 py-1.5",
					children: row.x
				}), keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-2 py-1.5 tabular-nums",
					children: formatValue(Number(row[k] ?? 0), style.dataLabels.format, style.dataLabels.decimals)
				}, k))]
			}, String(row.x))) })]
		})
	});
	if (viz.chart === "heatmap") {
		const xs = [...new Set(result.heat.map((h) => h.x))];
		const ys = [...new Set(result.heat.map((h) => h.y))];
		const max = Math.max(1, ...result.heat.map((h) => h.v));
		const fill0 = seriesPaint(style, keys[0] ?? "Value", 0).fill;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex h-full flex-col overflow-auto p-3", className),
			style: {
				background: style.plotFill,
				color: style.x.labelStyle.color
			},
			children: [
				style.y.showTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-center",
					style: textCss(style.y.titleStyle),
					children: yTitle
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-px",
					style: { gridTemplateColumns: `minmax(72px,1fr) repeat(${xs.length}, minmax(36px,1fr))` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						xs.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate px-1 text-center",
							style: {
								...textCss(style.x.labelStyle),
								fontSize: 10
							},
							children: x
						}, x)),
						ys.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contents",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate pr-2 text-right",
								style: {
									...textCss(style.y.labelStyle),
									fontSize: 11
								},
								children: y
							}), xs.map((x) => {
								const cell = result.heat.find((h) => h.x === x && h.y === y);
								const t = (cell?.v ?? 0) / max;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									title: `${x} / ${y}: ${formatValue(cell?.v ?? 0, style.dataLabels.format, style.dataLabels.decimals)}`,
									className: "flex h-7 items-center justify-center rounded-sm",
									style: { background: `color-mix(in oklab, ${fill0} ${Math.round(t * 90)}%, ${style.plotFill})` },
									children: style.dataLabels.show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											...textCss(style.dataLabels.valueStyle),
											fontSize: 9
										},
										children: formatValue(cell?.v ?? 0, style.dataLabels.format, 0)
									}) : null
								}, x);
							})]
						}, y))
					]
				}),
				style.x.showTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-center",
					style: textCss(style.x.titleStyle),
					children: xTitle
				}) : null
			]
		});
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-full", className),
		style: { background: style.plotFill }
	});
	const frame = (chart) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full flex-col", className),
		style: { background: style.plotFill },
		children: [viz.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pt-2 text-center",
			style: textCss(style.x.titleStyle),
			children: viz.title
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 p-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: chart
			})
		})]
	});
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
				n: vals.filter((v) => v >= lo && (i === 7 ? v <= hi : v < hi)).length
			};
		});
		const paint = seriesPaint(style, "n", 0);
		return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data: hist,
			barCategoryGap: `${style.bars.categoryGap}%`,
			margin: chartMargin,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
					style,
					xTitle,
					yTitle: "Count",
					yTick: (n) => String(n)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "n",
					name: "Count",
					fill: paint.fill,
					stroke: paint.stroke,
					strokeWidth: paint.strokeWidth,
					radius: [
						style.bars.cornerRadius,
						style.bars.cornerRadius,
						0,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: "n",
						style
					})
				})
			]
		}));
	}
	if (viz.chart === "pie" || viz.chart === "donut") {
		const inner = viz.chart === "donut" ? `${style.pie.donutInner}%` : 0;
		return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, {
			margin: {
				top: 8,
				right: 72,
				left: 72,
				bottom: 8
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
					data: result.tree,
					dataKey: "value",
					nameKey: "name",
					innerRadius: inner,
					outerRadius: "68%",
					startAngle: 90 - style.pie.startAngle,
					endAngle: 90 - style.pie.startAngle - 360,
					paddingAngle: style.pie.padAngle,
					label: style.pie.showSliceLabels ? (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieOuterLabel, {
						style,
						...props
					}) : false,
					labelLine: style.pie.showSliceLabels,
					children: [result.tree.map((slice, i) => {
						const paint = seriesPaint(style, slice.name, i);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							fill: paint.fill,
							stroke: paint.stroke,
							strokeWidth: paint.strokeWidth
						}, slice.name);
					}), style.pie.showSliceValues ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
						dataKey: "value",
						position: "inside",
						formatter: (v) => formatValue(Number(v), style.dataLabels.format, style.dataLabels.decimals),
						fill: style.dataLabels.valueStyle.color,
						style: textCss(style.dataLabels.valueStyle)
					}) : null]
				})
			]
		}));
	}
	if (viz.chart === "treemap") {
		const tree = result.tree.map((t, i) => ({
			...t,
			fill: seriesPaint(style, t.name, i).fill
		}));
		return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Treemap, {
			data: tree,
			dataKey: "value",
			nameKey: "name",
			stroke: style.plotFill,
			content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreemapCell, { style }),
			children: style.legend.show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }) : null
		}));
	}
	if (viz.chart === "scatter") return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, {
		margin: chartMargin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
				style,
				xTitle,
				yTitle,
				numeric: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
			result.series.map((s, i) => {
				const paint = seriesPaint(style, s.key, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
					name: s.key,
					data: s.points.map((p) => ({
						x: typeof p.x === "number" ? p.x : Number(p.x) || 0,
						y: p.y
					})),
					fill: paint.fill,
					stroke: paint.stroke,
					strokeWidth: paint.strokeWidth,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: "y",
						style
					})
				}, s.key);
			})
		]
	}));
	if (viz.chart === "line") return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
		data,
		margin: chartMargin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
				style,
				xTitle,
				yTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
			keys.map((k, i) => {
				const paint = seriesPaint(style, k, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: k,
					name: k,
					stroke: paint.stroke,
					strokeWidth: style.lines.width,
					strokeDasharray: dash,
					dot: style.lines.dots ? {
						fill: paint.fill,
						r: 3
					} : false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: k,
						style
					})
				}, k);
			})
		]
	}));
	if (viz.chart === "area") return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
		data,
		margin: chartMargin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
				style,
				xTitle,
				yTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
			keys.map((k, i) => {
				const paint = seriesPaint(style, k, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: k,
					name: k,
					stroke: paint.stroke,
					fill: paint.fill,
					fillOpacity: .28,
					strokeWidth: style.lines.width,
					strokeDasharray: dash,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: k,
						style
					})
				}, k);
			})
		]
	}));
	if (viz.chart === "combo") {
		const paint0 = seriesPaint(style, keys[0] ?? "Value", 0);
		const paint1 = seriesPaint(style, keys[0] ? `${keys[0]}__2` : "Value2", 1);
		return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
			data,
			barCategoryGap: `${style.bars.categoryGap}%`,
			barGap: style.bars.barGap,
			margin: chartMargin,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
					style,
					xTitle,
					yTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
				keys[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: keys[0],
					name: keys[0],
					fill: paint0.fill,
					stroke: paint0.stroke,
					strokeWidth: paint0.strokeWidth,
					radius: [
						style.bars.cornerRadius,
						style.bars.cornerRadius,
						0,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: keys[0],
						style
					})
				}) : null,
				keys[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: `${keys[0]}__2`,
					name: "Series 2",
					stroke: paint1.stroke,
					strokeWidth: style.lines.width,
					dot: style.lines.dots
				}) : null
			]
		}));
	}
	return frame(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
		data,
		barCategoryGap: `${style.bars.categoryGap}%`,
		barGap: style.bars.barGap,
		margin: chartMargin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axes, {
				style,
				xTitle,
				yTitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { ...tooltip }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, { style }),
			keys.map((k, i) => {
				const paint = seriesPaint(style, k, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: k,
					name: k,
					stackId: stacked ? "a" : void 0,
					fill: paint.fill,
					stroke: paint.stroke,
					strokeWidth: paint.strokeWidth,
					radius: stacked ? 0 : [
						style.bars.cornerRadius,
						style.bars.cornerRadius,
						0,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueLabels, {
						dataKey: k,
						style,
						stacked
					})
				}, k);
			})
		]
	}));
}
function TreemapCell({ x, y, width, height, name, value, fill, style }) {
	if (x == null || y == null || width == null || height == null) return null;
	const color = fill ?? PALETTE[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x,
		y,
		width,
		height,
		fill: color,
		stroke: style.plotFill
	}), width > 40 && height > 22 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
		x: x + 6,
		y: y + 16,
		fill: contrastOn(color),
		fontSize: 11,
		children: [name, style.dataLabels.show ? ` ${formatValue(Number(value ?? 0), style.dataLabels.format, style.dataLabels.decimals)}` : ""]
	}) : null] });
}
function col$1(name, type, role, id) {
	return {
		id,
		name,
		type,
		role
	};
}
function ds(id, name, columns, records) {
	return {
		id,
		name,
		source: "sample",
		columns,
		rows: records.map((r) => {
			const row = {};
			columns.forEach((c) => {
				row[c.id] = r[c.name];
			});
			return row;
		})
	};
}
function ns(prefix) {
	return prefix ?? uid("ds");
}
function sampleRetail(prefix) {
	const id = ns(prefix);
	const columns = [
		col$1("Month", "date", "dimension", `${id}_month`),
		col$1("Region", "string", "dimension", `${id}_region`),
		col$1("Channel", "string", "dimension", `${id}_channel`),
		col$1("Category", "string", "dimension", `${id}_category`),
		col$1("Sales", "number", "measure", `${id}_sales`),
		col$1("Profit", "number", "measure", `${id}_profit`),
		col$1("Units", "number", "measure", `${id}_units`)
	];
	const months = [
		"2025-01",
		"2025-02",
		"2025-03",
		"2025-04",
		"2025-05",
		"2025-06"
	];
	const regions = [
		"North",
		"South",
		"East",
		"West"
	];
	const channels = [
		"Direct",
		"Partner",
		"Online"
	];
	const cats = [
		"Hardware",
		"Consumables",
		"Service"
	];
	const records = [];
	let seed = 17;
	const rnd = () => {
		seed = seed * 1103515245 + 12345 & 2147483647;
		return seed / 2147483647;
	};
	for (const m of months) for (const r of regions) for (const ch of channels) for (const c of cats) {
		const units = Math.round(20 + rnd() * 180);
		const sales = Math.round(units * (40 + rnd() * 90));
		const profit = Math.round(sales * (.08 + rnd() * .22));
		records.push({
			Month: m,
			Region: r,
			Channel: ch,
			Category: c,
			Sales: sales,
			Profit: profit,
			Units: units
		});
	}
	return ds(id, "Harbor retail", columns, records);
}
function sampleTransit(prefix) {
	const id = ns(prefix);
	const columns = [
		col$1("Weekday", "string", "dimension", `${id}_weekday`),
		col$1("Route", "string", "dimension", `${id}_route`),
		col$1("Ridership", "number", "measure", `${id}_ridership`),
		col$1("OnTime", "number", "measure", `${id}_ontime`),
		col$1("DelayMin", "number", "measure", `${id}_delaymin`)
	];
	const days = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	];
	const routes = [
		"A-Line",
		"B-Loop",
		"C-Express",
		"D-Harbor"
	];
	const records = [];
	let seed = 91;
	const rnd = () => {
		seed = seed * 1664525 + 1013904223 >>> 0;
		return seed / 4294967295;
	};
	for (const d of days) for (const r of routes) {
		const weekend = d === "Sat" || d === "Sun";
		const ridership = Math.round((weekend ? 420 : 980) * (.7 + rnd() * .6));
		const onTime = Math.round((weekend ? 94 : 86) + rnd() * 8);
		records.push({
			Weekday: d,
			Route: r,
			Ridership: ridership,
			OnTime: Math.min(99, onTime),
			DelayMin: Math.round((100 - onTime) * .4)
		});
	}
	return ds(id, "Transit board", columns, records);
}
function sampleNps(prefix) {
	const id = ns(prefix);
	const columns = [
		col$1("Segment", "string", "dimension", `${id}_segment`),
		col$1("Cohort", "string", "dimension", `${id}_cohort`),
		col$1("NPS", "number", "measure", `${id}_nps`),
		col$1("Responses", "number", "measure", `${id}_responses`),
		col$1("Renewal", "number", "measure", `${id}_renewal`)
	];
	const segs = [
		"Starter",
		"Growth",
		"Enterprise"
	];
	const cohorts = [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	];
	const records = [];
	let seed = 3;
	const rnd = () => {
		seed = seed * 214013 + 2531011 & 2147483647;
		return seed / 2147483647;
	};
	for (const s of segs) for (const c of cohorts) {
		const nps = Math.round((s === "Enterprise" ? 42 : 18) + rnd() * 28);
		records.push({
			Segment: s,
			Cohort: c,
			NPS: nps,
			Responses: Math.round(80 + rnd() * 400),
			Renewal: Math.round(70 + nps * .35 + rnd() * 8)
		});
	}
	return ds(id, "Account pulse", columns, records);
}
var SAMPLE_FNS = [
	{
		id: "retail",
		label: "Harbor retail",
		run: () => sampleRetail()
	},
	{
		id: "transit",
		label: "Transit board",
		run: () => sampleTransit()
	},
	{
		id: "nps",
		label: "Account pulse",
		run: () => sampleNps()
	}
];
function num$1(v) {
	if (v == null || v === "") return null;
	if (typeof v === "number") return Number.isFinite(v) ? v : null;
	if (typeof v === "boolean") return v ? 1 : 0;
	const n = Number(String(v).replace(/,/g, ""));
	return Number.isFinite(n) ? n : null;
}
function str(v) {
	if (v == null) return "(null)";
	if (typeof v === "number") return String(v);
	return String(v);
}
function applyFilters(ds, filters) {
	return ds.rows.filter((row) => filters.every((f) => {
		const v = row[f.field];
		const sv = str(v);
		const nv = num$1(v);
		const fn = Number(f.value);
		if (f.op === "eq") return sv === f.value;
		if (f.op === "neq") return sv !== f.value;
		if (f.op === "contains") return sv.toLowerCase().includes(f.value.toLowerCase());
		if (f.op === "gt") return nv != null && nv > fn;
		if (f.op === "lt") return nv != null && nv < fn;
		return true;
	}));
}
function aggNums(vals, how) {
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
function col(ds, id) {
	if (!id) return void 0;
	return ds.columns.find((c) => c.id === id);
}
function measures(ds) {
	return ds.columns.filter((c) => c.role === "measure" || c.type === "number");
}
function dimensions(ds) {
	return ds.columns.filter((c) => c.role === "dimension" && c.type !== "number");
}
function uniqueValues(ds, fieldId, cap = 40) {
	const set = /* @__PURE__ */ new Set();
	for (const r of ds.rows) {
		set.add(str(r[fieldId]));
		if (set.size >= cap) break;
	}
	return [...set];
}
function query(ds, viz) {
	const rows = applyFilters(ds, viz.filters);
	const dimX = col(ds, viz.rows[0]) ?? dimensions(ds)[0];
	const dimY = col(ds, viz.rows[1]);
	const split = col(ds, viz.color);
	const measure = col(ds, viz.columns[0]) ?? measures(ds)[0];
	const measure2 = col(ds, viz.columns[1]) ?? (viz.chart === "combo" || viz.chart === "scatter" ? measures(ds)[1] : void 0);
	const xLabel = dimX?.name ?? "Category";
	const yLabel = measure ? `${viz.agg} of ${measure.name}` : "Value";
	if (!measure && viz.chart !== "table") return {
		series: [],
		table: [],
		kpi: [],
		heat: [],
		tree: [],
		xLabel,
		yLabel
	};
	const groups = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const x = dimX ? str(r[dimX.id]) : "All";
		const g = split ? str(r[split.id]) : "Value";
		const y = dimY ? str(r[dimY.id]) : "";
		const key = `${x}||${g}||${y}`;
		let slot = groups.get(key);
		if (!slot) {
			slot = {
				x,
				g,
				y,
				vals: [],
				vals2: []
			};
			groups.set(key, slot);
		}
		if (measure) {
			if (viz.agg === "count") slot.vals.push(1);
			else if (viz.agg === "dcount") slot.vals.push(num$1(r[measure.id]) ?? 0);
			else {
				const n = num$1(r[measure.id]);
				if (n != null) slot.vals.push(n);
			}
		}
		if (measure2) {
			const n = num$1(r[measure2.id]);
			if (n != null) slot.vals2.push(n);
		}
	}
	const seriesMap = /* @__PURE__ */ new Map();
	const table = [];
	const heat = [];
	const treeMap = /* @__PURE__ */ new Map();
	for (const slot of groups.values()) {
		const y = aggNums(slot.vals, viz.agg === "dcount" ? "dcount" : viz.agg);
		const y2 = slot.vals2.length ? aggNums(slot.vals2, viz.agg) : void 0;
		const pts = seriesMap.get(slot.g) ?? [];
		pts.push({
			x: slot.x,
			y,
			g: slot.g,
			y2
		});
		seriesMap.set(slot.g, pts);
		table.push({
			label: slot.y ? `${slot.x} / ${slot.y}` : slot.x,
			values: { [slot.g]: y }
		});
		if (dimY) heat.push({
			x: slot.x,
			y: slot.y,
			v: y
		});
		treeMap.set(split ? `${slot.g}` : slot.x, (treeMap.get(split ? slot.g : slot.x) ?? 0) + y);
	}
	const series = [...seriesMap.entries()].map(([key, points]) => ({
		key,
		points: points.sort((a, b) => String(a.x).localeCompare(String(b.x), void 0, { numeric: true }))
	}));
	return {
		series,
		table,
		kpi: [
			{
				label: yLabel,
				value: aggNums(series.flatMap((s) => s.points.map((p) => p.y)), viz.agg === "count" ? "sum" : viz.agg),
				fmt: "num"
			},
			{
				label: "Groups",
				value: series.reduce((n, s) => n + s.points.length, 0),
				fmt: "int"
			},
			{
				label: "Rows in view",
				value: rows.length,
				fmt: "int"
			}
		],
		heat,
		tree: [...treeMap.entries()].map(([name, value]) => ({
			name,
			value
		})),
		xLabel,
		yLabel
	};
}
function showMe(ds, selected) {
	const cols = selected.map((id) => col(ds, id)).filter(Boolean);
	const dims = cols.filter((c) => c.role === "dimension" || c.type !== "number");
	const meas = cols.filter((c) => c.role === "measure" || c.type === "number");
	if (!meas.length && measures(ds)[0]) meas.push(measures(ds)[0]);
	if (dims.length >= 2 && meas.length) return {
		chart: "heatmap",
		rows: [dims[0].id, dims[1].id],
		columns: [meas[0].id]
	};
	if (meas.length >= 2 && !dims.length) return {
		chart: "scatter",
		rows: [],
		columns: [meas[0].id, meas[1].id]
	};
	if (dims[0]?.type === "date" && meas[0]) return {
		chart: "line",
		rows: [dims[0].id],
		columns: [meas[0].id]
	};
	if (dims.length === 1 && meas.length === 1) return {
		chart: "bar",
		rows: [dims[0].id],
		columns: [meas[0].id]
	};
	if (dims.length === 1 && !meas.length) return {
		chart: "bar",
		rows: [dims[0].id],
		columns: []
	};
	return {
		chart: "bar",
		rows: dims[0] ? [dims[0].id] : [],
		columns: meas[0] ? [meas[0].id] : [],
		color: dims[1]?.id
	};
}
function heuristicAsk(ds, prompt) {
	const p = prompt.toLowerCase();
	const chart = p.includes("pie") || p.includes("share") ? "pie" : p.includes("line") || p.includes("trend") || p.includes("over time") ? "line" : p.includes("scatter") || p.includes("correlation") ? "scatter" : p.includes("heat") ? "heatmap" : p.includes("tree") ? "treemap" : p.includes("kpi") || p.includes("total") ? "kpi" : p.includes("table") ? "table" : p.includes("stack") ? "bar-stack" : p.includes("area") ? "area" : p.includes("histogram") || p.includes("distribution") ? "histogram" : "bar";
	const dim = ds.columns.find((c) => p.includes(c.name.toLowerCase()) && (c.role === "dimension" || c.type !== "number")) ?? dimensions(ds)[0];
	const meas = ds.columns.find((c) => p.includes(c.name.toLowerCase()) && (c.role === "measure" || c.type === "number")) ?? measures(ds)[0];
	const split = ds.columns.find((c) => c.id !== dim?.id && p.includes(c.name.toLowerCase()) && c.role === "dimension");
	const agg = p.includes("average") || p.includes("avg") ? "avg" : p.includes("count") ? "count" : "sum";
	return {
		chart,
		rows: dim ? [dim.id] : [],
		columns: meas ? [meas.id] : [],
		color: split?.id,
		agg,
		title: prompt.slice(0, 72),
		insight: `Mapped “${prompt}” to ${chart} of ${meas?.name ?? "value"} by ${dim?.name ?? "all"}.`
	};
}
function seedViz(ds) {
	const dim = ds.columns.find((c) => c.role === "dimension");
	const meas = ds.columns.find((c) => c.role === "measure");
	const split = ds.columns.find((c) => c.role === "dimension" && c.id !== dim?.id);
	return {
		id: uid("viz"),
		title: `${meas?.name ?? "Value"} by ${dim?.name ?? "category"}`,
		datasetId: ds.id,
		chart: "bar",
		rows: dim ? [dim.id] : [],
		columns: meas ? [meas.id] : [],
		color: split?.id,
		filters: [],
		agg: "sum"
	};
}
function seed() {
	const ds = sampleRetail("harbor");
	const dim = ds.columns.find((c) => c.role === "dimension");
	const meas = ds.columns.find((c) => c.role === "measure");
	const split = ds.columns.find((c) => c.role === "dimension" && c.id !== dim?.id);
	const viz = {
		id: "viz_seed",
		title: `${meas?.name ?? "Value"} by ${dim?.name ?? "category"}`,
		datasetId: ds.id,
		chart: "bar",
		rows: dim ? [dim.id] : [],
		columns: meas ? [meas.id] : [],
		color: split?.id,
		filters: [],
		agg: "sum"
	};
	return {
		name: "Sablepane workspace",
		datasets: [ds],
		activeDatasetId: ds.id,
		vizs: [viz],
		activeVizId: viz.id,
		tiles: [{
			id: "tile_seed",
			vizId: viz.id
		}],
		tab: "visualize",
		theme: "light"
	};
}
var useStudio = create()(persist((set, get) => ({
	...seed(),
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setTab: (tab) => set({ tab }),
	setName: (name) => set({ name }),
	setTheme: (theme) => set({ theme }),
	setActiveDataset: (id) => set({ activeDatasetId: id }),
	setActiveViz: (id) => set({ activeVizId: id }),
	addDataset: (ds) => set((s) => {
		const viz = seedViz(ds);
		return {
			datasets: [...s.datasets, ds],
			activeDatasetId: ds.id,
			vizs: [...s.vizs, viz],
			activeVizId: viz.id,
			tiles: [...s.tiles, {
				id: uid("tile"),
				vizId: viz.id
			}],
			tab: "visualize"
		};
	}),
	removeDataset: (id) => set((s) => {
		const datasets = s.datasets.filter((d) => d.id !== id);
		const vizs = s.vizs.filter((v) => v.datasetId !== id);
		const keep = new Set(vizs.map((v) => v.id));
		return {
			datasets,
			vizs,
			tiles: s.tiles.filter((t) => keep.has(t.vizId)),
			activeDatasetId: datasets[0]?.id ?? "",
			activeVizId: vizs[0]?.id ?? ""
		};
	}),
	setColMeta: (dsId, colId, patch) => set((s) => ({ datasets: s.datasets.map((d) => d.id !== dsId ? d : {
		...d,
		columns: d.columns.map((c) => c.id === colId ? {
			...c,
			...patch
		} : c)
	}) })),
	addViz: () => set((s) => {
		const ds = s.datasets.find((d) => d.id === s.activeDatasetId);
		if (!ds) return s;
		const viz = seedViz(ds);
		return {
			vizs: [...s.vizs, viz],
			activeVizId: viz.id,
			tab: "visualize"
		};
	}),
	patchViz: (id, patch) => set((s) => ({ vizs: s.vizs.map((v) => v.id === id ? {
		...v,
		...patch
	} : v) })),
	patchStyle: (id, patch) => {
		const viz = get().vizs.find((v) => v.id === id);
		if (!viz) return;
		get().patchViz(id, { style: patchChartStyle(viz.style, patch) });
	},
	dropField: (slot, colId) => {
		const id = get().activeVizId;
		const viz = get().vizs.find((v) => v.id === id);
		if (!viz) return;
		if (slot === "color" || slot === "size") {
			get().patchViz(id, { [slot]: colId || void 0 });
			return;
		}
		if (!colId) {
			get().patchViz(id, { [slot]: [] });
			return;
		}
		const next = viz[slot].includes(colId) ? viz[slot] : [...viz[slot], colId];
		get().patchViz(id, { [slot]: next });
	},
	setChart: (chart) => get().patchViz(get().activeVizId, { chart }),
	setAgg: (agg) => get().patchViz(get().activeVizId, { agg }),
	addFilter: (f) => {
		const viz = get().vizs.find((v) => v.id === get().activeVizId);
		if (!viz) return;
		get().patchViz(viz.id, { filters: [...viz.filters, f] });
	},
	removeFilter: (i) => {
		const viz = get().vizs.find((v) => v.id === get().activeVizId);
		if (!viz) return;
		get().patchViz(viz.id, { filters: viz.filters.filter((_, idx) => idx !== i) });
	},
	applyShowMe: (selected) => {
		const s = get();
		const ds = s.datasets.find((d) => d.id === s.activeDatasetId);
		const viz = s.vizs.find((v) => v.id === s.activeVizId);
		if (!ds || !viz) return;
		const spec = showMe(ds, selected);
		get().patchViz(viz.id, spec);
	},
	applyAsk: (spec) => {
		const viz = get().vizs.find((v) => v.id === get().activeVizId);
		if (!viz) return;
		get().patchViz(viz.id, spec);
		set({ tab: "visualize" });
	},
	addTile: (vizId) => set((s) => ({ tiles: [...s.tiles, {
		id: uid("tile"),
		vizId: vizId ?? s.activeVizId
	}] })),
	removeTile: (id) => set((s) => ({ tiles: s.tiles.filter((t) => t.id !== id) })),
	loadProject: (p) => set({
		...seed(),
		...p,
		theme: p.theme ?? "light",
		hydrated: true
	}),
	reset: () => set({
		...seed(),
		hydrated: true
	})
}), {
	name: "sablepane-v1",
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			...p,
			theme: p.theme ?? "light"
		};
	},
	partialize: (s) => ({
		name: s.name,
		datasets: s.datasets,
		activeDatasetId: s.activeDatasetId,
		vizs: s.vizs,
		activeVizId: s.activeVizId,
		tiles: s.tiles,
		tab: s.tab,
		theme: s.theme
	})
}));
function FormatPanel({ viz, result }) {
	const patchStyle = useStudio((s) => s.patchStyle);
	const style = mergeChartStyle(viz.style);
	const set = (patch) => patchStyle(viz.id, patch);
	const keys = viz.chart === "pie" || viz.chart === "donut" || viz.chart === "treemap" ? result.tree.map((t) => t.name) : result.series.map((s) => s.key);
	const cartesian = ![
		"pie",
		"donut",
		"kpi",
		"table",
		"treemap"
	].includes(viz.chart);
	const isBar = viz.chart === "bar" || viz.chart === "bar-stack" || viz.chart === "histogram" || viz.chart === "combo";
	const isLine = viz.chart === "line" || viz.chart === "area" || viz.chart === "combo" || viz.chart === "scatter";
	const isPie = viz.chart === "pie" || viz.chart === "donut";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full min-h-0 w-full flex-col overflow-auto bg-panel lg:w-72 lg:shrink-0 lg:border-l lg:border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted",
				children: "Format chart"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Chart area",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
						label: "Plot fill",
						value: style.plotFill,
						onChange: (v) => set({ plotFill: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Gridlines",
						checked: style.grid,
						onChange: (v) => set({ grid: v })
					}),
					style.grid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
						label: "Grid color",
						value: style.gridColor,
						onChange: (v) => set({ gridColor: v })
					}) : null
				]
			}),
			cartesian ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisSection, {
				axis: "x",
				label: "Horizontal axis",
				auto: result.xLabel,
				style,
				set
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisSection, {
				axis: "y",
				label: "Vertical axis",
				auto: result.yLabel,
				style,
				set,
				showScale: true
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Legend",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Show legend",
						checked: style.legend.show,
						onChange: (v) => set({ legend: { show: v } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Legend title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
							value: style.legend.title,
							placeholder: "Optional heading",
							onChange: (e) => set({ legend: { title: e.target.value } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Position",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
							value: style.legend.position,
							onChange: (e) => set({ legend: { position: e.target.value } }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "top",
									children: "Top"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "bottom",
									children: "Bottom"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "left",
									children: "Left"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "right",
									children: "Right"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditor, {
						label: "Legend text",
						value: style.legend.labelStyle,
						onChange: (v) => set({ legend: { labelStyle: v } })
					}),
					style.legend.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditor, {
						label: "Legend heading",
						value: style.legend.titleStyle,
						onChange: (v) => set({ legend: { titleStyle: v } })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Series",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] text-muted",
					children: "Fill, outline, and edge thickness for each series or slice."
				}), keys.map((k, i) => {
					const paint = seriesPaint(style, k, i);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 rounded-md border border-border bg-bg p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 truncate text-xs font-medium",
								children: k
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
									label: "Fill",
									value: paint.fill,
									onChange: (v) => set({ series: { [k]: {
										fill: v,
										stroke: paint.stroke,
										strokeWidth: paint.strokeWidth
									} } })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
									label: "Edge",
									value: paint.stroke,
									onChange: (v) => set({ series: { [k]: {
										fill: paint.fill,
										stroke: v,
										strokeWidth: paint.strokeWidth
									} } })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Edge ${paint.strokeWidth}px`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 8,
									step: 1,
									value: paint.strokeWidth,
									onChange: (e) => set({ series: { [k]: {
										fill: paint.fill,
										stroke: paint.stroke,
										strokeWidth: Number(e.target.value)
									} } })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": c,
									className: cn("size-5 rounded-sm border", paint.fill === c ? "border-fg" : "border-transparent"),
									style: { background: c },
									onClick: () => set({ series: { [k]: {
										fill: c,
										stroke: c,
										strokeWidth: paint.strokeWidth
									} } })
								}, c))
							})
						]
					}, k);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Data labels",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: isPie ? "Values on slices" : "Show values",
						checked: isPie ? style.pie.showSliceValues : style.dataLabels.show,
						onChange: (v) => isPie ? set({ pie: { showSliceValues: v } }) : set({ dataLabels: { show: v } })
					}),
					isPie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Names next to slices",
						checked: style.pie.showSliceLabels,
						onChange: (v) => set({ pie: { showSliceLabels: v } })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Position",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
							value: style.dataLabels.position,
							onChange: (e) => set({ dataLabels: { position: e.target.value } }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "end",
									children: "Outside / on top"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "center",
									children: "Center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "inside",
									children: "Inside"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Number format",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
							value: style.dataLabels.format,
							onChange: (e) => set({ dataLabels: { format: e.target.value } }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "auto",
									children: "General"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "number",
									children: "Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "compact",
									children: "Compact (k / M)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "percent",
									children: "Percent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "currency",
									children: "Currency"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Decimals (${style.dataLabels.decimals})`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 4,
							value: style.dataLabels.decimals,
							onChange: (e) => set({ dataLabels: { decimals: Number(e.target.value) } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditor, {
						label: "Value font",
						value: style.dataLabels.valueStyle,
						onChange: (v) => set({ dataLabels: { valueStyle: v } })
					})
				]
			}),
			isBar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Bars",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Gap between categories (${style.bars.categoryGap}%)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 60,
							value: style.bars.categoryGap,
							onChange: (e) => set({ bars: { categoryGap: Number(e.target.value) } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Gap between series (${style.bars.barGap}px)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 24,
							value: style.bars.barGap,
							onChange: (e) => set({ bars: { barGap: Number(e.target.value) } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Corner radius (${style.bars.cornerRadius}px)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 12,
							value: style.bars.cornerRadius,
							onChange: (e) => set({ bars: { cornerRadius: Number(e.target.value) } })
						})
					})
				]
			}) : null,
			isLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Lines",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Weight (${style.lines.width}px)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 8,
							value: style.lines.width,
							onChange: (e) => set({ lines: { width: Number(e.target.value) } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Dash",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
							value: style.lines.dash,
							onChange: (e) => set({ lines: { dash: e.target.value } }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "solid",
									children: "Solid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "dashed",
									children: "Dashed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "dotted",
									children: "Dotted"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Markers",
						checked: style.lines.dots,
						onChange: (v) => set({ lines: { dots: v } })
					})
				]
			}) : null,
			isPie ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Pie",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Rotation (${style.pie.startAngle}°)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 360,
							value: style.pie.startAngle,
							onChange: (e) => set({ pie: { startAngle: Number(e.target.value) } })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Gap between slices (${style.pie.padAngle}°)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 12,
							value: style.pie.padAngle,
							onChange: (e) => set({ pie: { padAngle: Number(e.target.value) } })
						})
					}),
					viz.chart === "donut" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: `Hole (${style.pie.donutInner}%)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 20,
							max: 80,
							value: style.pie.donutInner,
							onChange: (e) => set({ pie: { donutInner: Number(e.target.value) } })
						})
					}) : null
				]
			}) : null
		]
	});
}
function AxisSection({ axis, label, auto, style, set, showScale }) {
	const a = style[axis];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: label,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
				label: "Show title",
				checked: a.showTitle,
				onChange: (v) => set({ [axis]: { showTitle: v } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
					value: a.title || auto,
					onChange: (e) => set({ [axis]: { title: e.target.value === auto ? "" : e.target.value } })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
				label: "Show tick labels",
				checked: a.showLabels,
				onChange: (v) => set({ [axis]: { showLabels: v } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorRow, {
				label: "Axis line",
				value: a.lineColor,
				onChange: (v) => set({ [axis]: { lineColor: v } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: `Line weight (${a.lineWidth}px)`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 4,
					value: a.lineWidth,
					onChange: (e) => set({ [axis]: { lineWidth: Number(e.target.value) } })
				})
			}),
			showScale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Min",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
						placeholder: "Auto",
						value: a.min,
						onChange: (e) => set({ [axis]: { min: e.target.value } })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Max",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "h-9 w-full rounded-md border border-border bg-bg px-2 text-xs",
						placeholder: "Auto",
						value: a.max,
						onChange: (e) => set({ [axis]: { max: e.target.value } })
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditor, {
				label: "Title font",
				value: a.titleStyle,
				onChange: (v) => set({ [axis]: { titleStyle: v } })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextEditor, {
				label: "Label font",
				value: a.labelStyle,
				onChange: (v) => set({ [axis]: { labelStyle: v } })
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		open: true,
		className: "border-b border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer px-3 py-2 text-xs font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 px-3 pb-3",
			children
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[10px] uppercase tracking-wide text-muted",
			children: label
		}), children]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onChange(!checked),
		className: "flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-0 text-left text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-flex h-5 w-9 items-center rounded-full p-0.5", checked ? "bg-accent" : "bg-raised"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-4 rounded-full bg-fg transition-transform", checked ? "translate-x-4 bg-primary-fg" : "") })
		})]
	});
}
function ColorRow({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-9 items-center justify-between gap-2 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				className: "size-7 cursor-pointer rounded-sm border border-border",
				value: toHex(value),
				onChange: (e) => onChange(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] text-muted",
				children: toHex(value)
			})]
		})]
	});
}
function TextEditor({ label, value, onChange }) {
	const set = (patch) => onChange({
		...value,
		...patch
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-bg p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[10px] uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-8 min-w-0 flex-1 rounded-sm border border-border bg-panel px-1 text-[11px]",
					value: value.font,
					onChange: (e) => set({ font: e.target.value }),
					children: FONT_OPTIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: f.id,
						children: f.label
					}, f.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 8,
					max: 32,
					className: "h-8 w-12 rounded-sm border border-border bg-panel px-1 text-[11px]",
					value: value.size,
					onChange: (e) => set({ size: Number(e.target.value) || 12 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "color",
					className: "size-8 cursor-pointer rounded-sm border border-border",
					value: toHex(value.color),
					onChange: (e) => set({ color: e.target.value })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleBtn, {
					active: value.bold,
					onClick: () => set({ bold: !value.bold }),
					children: "B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleBtn, {
					active: value.italic,
					onClick: () => set({ italic: !value.italic }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic",
						children: "I"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleBtn, {
					active: value.underline,
					onClick: () => set({ underline: !value.underline }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "underline",
						children: "U"
					})
				})
			]
		})]
	});
}
function StyleBtn({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("size-8 rounded-sm text-xs font-semibold", active ? "bg-primary text-primary-fg" : "bg-panel text-muted"),
		children
	});
}
function toHex(c) {
	if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
	return "#1c2128";
}
function splitLine(line) {
	const out = [];
	let cur = "";
	let q = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (q) {
			if (ch === "\"" && line[i + 1] === "\"") {
				cur += "\"";
				i++;
			} else if (ch === "\"") q = false;
			else cur += ch;
		} else if (ch === "\"") q = true;
		else if (ch === "," || ch === "	" || ch === ";") {
			out.push(cur);
			cur = "";
		} else cur += ch;
	}
	out.push(cur);
	return out;
}
function inferType(values) {
	const filled = values.filter((v) => v.trim() !== "");
	if (!filled.length) return "string";
	if (filled.every((v) => /^(true|false|yes|no|0|1)$/i.test(v.trim()))) return "bool";
	if (filled.every((v) => !Number.isNaN(Number(v.replace(/,/g, ""))))) return "number";
	if (filled.filter((v) => !Number.isNaN(Date.parse(v))).length / filled.length > .8) return "date";
	return "string";
}
function coerce(v, t) {
	const s = v.trim();
	if (s === "") return null;
	if (t === "number") {
		const n = Number(s.replace(/,/g, ""));
		return Number.isFinite(n) ? n : null;
	}
	if (t === "bool") return /^(true|yes|1)$/i.test(s);
	return s;
}
function parseTable(text) {
	const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim().length);
	if (!lines.length) return {
		names: [],
		rows: []
	};
	const header = splitLine(lines[0]).map((h) => h.trim() || "Col");
	const rows = [];
	for (let i = 1; i < lines.length; i++) {
		const cells = splitLine(lines[i]);
		while (cells.length < header.length) cells.push("");
		rows.push(cells.slice(0, header.length));
	}
	return {
		names: header,
		rows
	};
}
function tableToDataset(name, names, grid, source) {
	const types = names.map((_, i) => inferType(grid.map((r) => r[i] ?? "")));
	const columns = names.map((n, i) => {
		const type = types[i];
		const role = type === "number" ? "measure" : "dimension";
		return {
			id: uid("col"),
			name: n,
			type,
			role
		};
	});
	const rows = grid.map((r) => {
		const obj = {};
		columns.forEach((c, i) => {
			obj[c.id] = coerce(r[i] ?? "", c.type);
		});
		return obj;
	});
	return {
		id: uid("ds"),
		name,
		source,
		columns,
		rows
	};
}
function datasetToCsv(ds) {
	const esc = (v) => {
		const s = v == null ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [ds.columns.map((c) => esc(c.name)).join(","), ...ds.rows.map((r) => ds.columns.map((c) => esc(r[c.id])).join(","))].join("\n");
}
function num(v) {
	return typeof v === "number" ? v : Number(v) || 0;
}
function pulse(ds) {
	const items = [];
	const meas = measures(ds);
	const dims = dimensions(ds);
	if (!meas.length) return items;
	for (const m of meas.slice(0, 3)) {
		const vals = ds.rows.map((r) => num(r[m.id])).filter((n) => Number.isFinite(n));
		if (!vals.length) continue;
		const sum = vals.reduce((a, b) => a + b, 0);
		const avg = sum / vals.length;
		const sorted = [...vals].sort((a, b) => a - b);
		const p90 = sorted[Math.floor(sorted.length * .9)];
		items.push({
			id: `kpi-${m.id}`,
			title: m.name,
			body: `Total ${fmt(sum)} · mean ${fmt(avg)} · P90 ${fmt(p90)} across ${vals.length} rows.`,
			kind: "kpi"
		});
	}
	if (dims[0] && meas[0]) {
		const pts = query(ds, {
			id: "tmp",
			title: "",
			datasetId: ds.id,
			chart: "bar",
			rows: [dims[0].id],
			columns: [meas[0].id],
			filters: [],
			agg: "sum"
		}).series[0]?.points ?? [];
		const ranked = [...pts].sort((a, b) => b.y - a.y);
		if (ranked[0] && ranked[1]) {
			const share = ranked[0].y / ranked.reduce((s, p) => s + p.y, 0);
			items.push({
				id: "mix",
				title: `${dims[0].name} mix`,
				body: `${ranked[0].x} leads ${meas[0].name} at ${(share * 100).toFixed(1)}% (${fmt(ranked[0].y)}), ahead of ${ranked[1].x}.`,
				kind: "mix"
			});
		}
		if (pts.length >= 3) {
			const mean = pts.reduce((s, p) => s + p.y, 0) / pts.length;
			const sd = Math.sqrt(pts.reduce((s, p) => s + (p.y - mean) ** 2, 0) / pts.length) || 1;
			const out = pts.find((p) => Math.abs(p.y - mean) / sd > 1.8);
			if (out) items.push({
				id: "out",
				title: "Outlier",
				body: `${out.x} sits ${((out.y - mean) / sd).toFixed(1)}σ from the ${dims[0].name} mean for ${meas[0].name}.`,
				delta: out.y - mean,
				kind: "outlier"
			});
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
					kind: "trend"
				});
			}
		}
	}
	return items;
}
function fmt(n) {
	const a = Math.abs(n);
	if (a >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	if (a >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
	if (Number.isInteger(n)) return String(n);
	return n.toFixed(2);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askGrok = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b20434d4d339d44e35c1e1963eb9e8a5f3361e9df18474c134c916b7f5010f5b"));
function exportCsv(ds) {
	downloadBlob(new Blob([datasetToCsv(ds)], { type: "text/csv" }), `${slug(ds.name)}.csv`);
}
function exportSvgAs(kind, name, svg) {
	if (!svg) return;
	const xml = new XMLSerializer().serializeToString(svg);
	const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement("canvas");
		const w = Math.max(svg.clientWidth || 900, 640);
		const h = Math.max(svg.clientHeight || 480, 360);
		canvas.width = w * 2;
		canvas.height = h * 2;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#f4f1ea";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		canvas.toBlob((b) => {
			if (b) downloadBlob(b, `${slug(name)}.${kind}`);
		}, kind === "jpg" ? "image/jpeg" : "image/png", .92);
		URL.revokeObjectURL(url);
	};
	img.src = url;
}
function exportPdf(name, svg) {
	if (!svg) return;
	const xml = new XMLSerializer().serializeToString(svg);
	const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement("canvas");
		const w = 900;
		const h = Math.max(400, Math.round(img.height / Math.max(1, img.width) * w));
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#f4f1ea";
		ctx.fillRect(0, 0, w, h);
		ctx.drawImage(img, 0, 0, w, h);
		const pdf = wrapJpegPdf(dataUrlToBytes(canvas.toDataURL("image/jpeg", .92)), 792, Math.round(h / w * 792), w, h);
		downloadBlob(new Blob([pdf], { type: "application/pdf" }), `${slug(name)}.pdf`);
		URL.revokeObjectURL(url);
	};
	img.src = url;
}
function slug(s) {
	return s.replace(/[^\w.-]+/g, "_").slice(0, 48) || "sablepane";
}
function dataUrlToBytes(data) {
	const b64 = data.split(",")[1] ?? "";
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}
function wrapJpegPdf(jpeg, w, h, iw, ih) {
	const enc = (s) => new TextEncoder().encode(s);
	const header = "%PDF-1.4\n";
	const imgObj = `<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`;
	const pages = `<< /Type /Pages /Kids [4 0 R] /Count 1 >>`;
	const page = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 5 0 R /Resources << /XObject << /Im0 3 0 R >> >> >>`;
	const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;
	const catalog = `<< /Type /Catalog /Pages 2 0 R >>`;
	const parts = [];
	const offsets = [0];
	let pos = enc(header).length;
	const pushObj = (_n, body) => {
		const open = enc(`${_n} 0 obj\n`);
		const close = enc(`\nendobj\n`);
		offsets.push(pos);
		parts.push(open, body, close);
		pos += open.length + body.length + close.length;
	};
	parts.push(enc(header));
	pushObj(1, enc(catalog));
	pushObj(2, enc(pages));
	const imgHead = enc(imgObj);
	const imgTail = enc("\nendstream");
	const imgBody = new Uint8Array(imgHead.length + jpeg.length + imgTail.length);
	imgBody.set(imgHead, 0);
	imgBody.set(jpeg, imgHead.length);
	imgBody.set(imgTail, imgHead.length + jpeg.length);
	pushObj(3, imgBody);
	pushObj(4, enc(page));
	pushObj(5, enc(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
	const xrefPos = pos;
	let xref = `xref\n0 6\n0000000000 65535 f \n`;
	for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
	const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
	parts.push(enc(xref), enc(trailer));
	const total = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(total);
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}
var TABS = [
	{
		id: "data",
		label: "Data",
		icon: Database
	},
	{
		id: "sources",
		label: "Sources",
		icon: Link2
	},
	{
		id: "visualize",
		label: "Visualize",
		icon: ChartColumn
	},
	{
		id: "board",
		label: "Board",
		icon: LayoutGrid
	},
	{
		id: "pulse",
		label: "Pulse",
		icon: Sparkles
	},
	{
		id: "ask",
		label: "Ask",
		icon: MessageSquare
	}
];
function StudioApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const api = useStudio.persist;
		if (!api?.rehydrate) {
			useStudio.getState().setHydrated(true);
			setReady(true);
			return;
		}
		Promise.resolve(api.rehydrate()).then(() => {
			useStudio.getState().setHydrated(true);
			setReady(true);
		});
	}, []);
	const tab = useStudio((s) => s.tab);
	const setTab = useStudio((s) => s.setTab);
	const theme = useStudio((s) => s.theme ?? "light");
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", theme === "dark" ? "#0b0d10" : "#f3efe6");
	}, [theme]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex items-center gap-3 border-b border-border px-3 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-tight",
					children: "Sablepane"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Visual analytics"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-0 flex-1 bg-bg" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-border px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold tracking-tight",
							children: "Sablepane"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wide text-muted",
							children: "Visual analytics"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex",
						children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
							id: t.id,
							label: t.label,
							icon: t.icon,
							active: tab === t.id,
							onClick: () => setTab(t.id)
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportMenu, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-h-0 flex-1 overflow-hidden",
				children: [
					tab === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTab, {}),
					tab === "sources" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourcesTab, {}),
					tab === "visualize" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VizTab, {}),
					tab === "board" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardTab, {}),
					tab === "pulse" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseTab, {}),
					tab === "ask" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskTab, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "grid grid-cols-6 border-t border-border md:hidden",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(t.id),
					className: cn("flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px]", tab === t.id ? "text-fg" : "text-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "size-4" }), t.label]
				}, t.id))
			})
		]
	});
}
function TabBtn({ id, label, icon: Icon, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-tab": id,
		onClick,
		className: cn("inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium", active ? "bg-raised text-fg" : "text-muted hover:bg-panel hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), label]
	});
}
function ThemeToggle() {
	const theme = useStudio((s) => s.theme ?? "light");
	const setTheme = useStudio((s) => s.setTheme);
	const next = theme === "dark" ? "light" : "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `Switch to ${next} mode`,
		onClick: () => setTheme(next),
		className: "inline-flex size-9 items-center justify-center rounded-md border border-border bg-panel text-fg hover:bg-raised",
		children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
function ExportMenu() {
	const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
	const viz = useStudio((s) => s.vizs.find((v) => v.id === s.activeVizId));
	const run = (kind) => {
		if (kind === "csv" && ds) {
			exportCsv(ds);
			return;
		}
		const svg = document.querySelector(".sable-chart svg");
		if (!viz || !svg) return;
		if (kind === "pdf") exportPdf(viz.title, svg);
		else exportSvgAs(kind === "jpg" ? "jpg" : "png", viz.title, svg);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-muted" }), [
			"csv",
			"pdf",
			"jpg",
			"png"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => run(k),
			className: "h-9 rounded-md bg-primary px-2 text-[11px] font-semibold uppercase tracking-wide text-primary-fg hover:opacity-90",
			children: k
		}, k))]
	});
}
function DataTab() {
	const datasets = useStudio((s) => s.datasets);
	const activeId = useStudio((s) => s.activeDatasetId);
	const setActive = useStudio((s) => s.setActiveDataset);
	const setColMeta = useStudio((s) => s.setColMeta);
	const ds = datasets.find((d) => d.id === activeId);
	if (!ds) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Load a source first." });
	const preview = ds.rows.slice(0, 80);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col md:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "w-full shrink-0 border-b border-border p-3 md:w-56 md:border-b-0 md:border-r",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-[11px] uppercase tracking-wide text-muted",
				children: "Sets"
			}), datasets.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setActive(d.id),
				className: cn("mb-1 flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm", d.id === activeId ? "bg-raised" : "hover:bg-panel"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: d.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted",
					children: d.rows.length
				})]
			}, d.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-auto p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: ds.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-md border border-border bg-panel px-2 py-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "bg-transparent text-muted",
						value: `${c.role}:${c.type}`,
						onChange: (e) => {
							const [role, type] = e.target.value.split(":");
							setColMeta(ds.id, c.id, {
								role,
								type
							});
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dimension:string",
								children: "Dimension"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "measure:number",
								children: "Measure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dimension:date",
								children: "Date"
							})
						]
					})]
				}, c.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-panel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: ds.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "whitespace-nowrap px-2 py-2 font-medium",
							children: c.name
						}, c.id)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-t border-border",
						children: ds.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "whitespace-nowrap px-2 py-1.5 tabular-nums text-muted",
							children: r[c.id] == null ? "" : String(r[c.id])
						}, c.id))
					}, i)) })]
				})
			})]
		})]
	});
}
function SourcesTab() {
	const addDataset = useStudio((s) => s.addDataset);
	const removeDataset = useStudio((s) => s.removeDataset);
	const datasets = useStudio((s) => s.datasets);
	const [paste, setPaste] = (0, import_react.useState)("");
	const onFile = async (file) => {
		const { names, rows } = parseTable(await file.text());
		if (!names.length) return;
		addDataset(tableToDataset(file.name.replace(/\.[^.]+$/, ""), names, rows, "csv"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-auto p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-3xl gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Local files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "CSV or TSV stays in this browser. Nothing is uploaded."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
								"Choose CSV",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".csv,.tsv,text/csv,text/tab-separated-values",
									className: "hidden",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) onFile(f);
									}
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Paste table"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: paste,
							onChange: (e) => setPaste(e.target.value),
							placeholder: "Paste comma- or tab-separated values with a header row.",
							className: "mt-2 h-32 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 h-11 rounded-md border border-border px-3 text-sm",
							onClick: () => {
								const { names, rows } = parseTable(paste);
								if (!names.length) return;
								addDataset(tableToDataset("Pasted table", names, rows, "paste"));
								setPaste("");
							},
							children: "Add pasted table"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-panel p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Sample sets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: SAMPLE_FNS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => addDataset(s.run()),
							className: "h-11 rounded-md border border-border bg-raised px-3 text-sm",
							children: s.label
						}, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-panel p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Loaded"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: datasets.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								d.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										d.rows.length,
										" rows · ",
										d.source
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "p-2 text-muted hover:text-danger",
								onClick: () => removeDataset(d.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}, d.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceIo, {})
			]
		})
	});
}
function VizTab() {
	const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
	const viz = useStudio((s) => s.vizs.find((v) => v.id === s.activeVizId));
	const vizs = useStudio((s) => s.vizs);
	const setActiveViz = useStudio((s) => s.setActiveViz);
	const addViz = useStudio((s) => s.addViz);
	const patchViz = useStudio((s) => s.patchViz);
	const dropField = useStudio((s) => s.dropField);
	const setChart = useStudio((s) => s.setChart);
	const setAgg = useStudio((s) => s.setAgg);
	const addFilter = useStudio((s) => s.addFilter);
	const removeFilter = useStudio((s) => s.removeFilter);
	const applyShowMe = useStudio((s) => s.applyShowMe);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [formatOpen, setFormatOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(min-width: 1024px)").matches) setFormatOpen(true);
	}, []);
	const result = (0, import_react.useMemo)(() => ds && viz ? query(ds, viz) : null, [ds, viz]);
	if (!ds || !viz || !result) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Add a data source to visualize." });
	const onDragStart = (id) => (e) => {
		e.dataTransfer.setData("text/plain", id);
	};
	const onDrop = (slot) => (e) => {
		e.preventDefault();
		dropField(slot, e.dataTransfer.getData("text/plain"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col lg:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "max-h-[40%] overflow-auto border-b border-border p-3 lg:max-h-none lg:w-56 lg:border-b-0 lg:border-r",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] uppercase tracking-wide text-muted",
					children: "Fields"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[11px] text-accent",
					onClick: () => applyShowMe(picked.length ? picked : ds.columns.map((c) => c.id)),
					children: "Auto layout"
				})]
			}), ds.columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				draggable: true,
				onDragStart: onDragStart(c.id),
				onClick: () => setPicked((p) => p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]),
				className: cn("mb-1 flex w-full cursor-grab items-center justify-between rounded-md border px-2 py-2 text-left text-xs", picked.includes(c.id) ? "border-accent bg-raised" : "border-border bg-panel"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase text-muted",
					children: c.role === "measure" ? "123" : "abc"
				})]
			}, c.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 border-b border-border p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "h-9 rounded-md border border-border bg-panel px-2 text-xs",
							value: viz.id,
							onChange: (e) => setActiveViz(e.target.value),
							children: vizs.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.id,
								children: v.title
							}, v.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex h-9 items-center gap-1 rounded-md border border-border px-2 text-xs",
							onClick: addViz,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " New"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-9 min-w-32 flex-1 rounded-md border border-border bg-bg px-2 text-sm",
							value: viz.title,
							onChange: (e) => patchViz(viz.id, { title: e.target.value })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFormatOpen((v) => !v),
							className: cn("inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs", formatOpen ? "border-accent bg-raised text-fg" : "border-border text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5" }), " Format"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-b border-border p-2",
					children: [CHARTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setChart(c.id),
						className: cn("h-9 rounded-md px-2 text-[11px] font-medium", viz.chart === c.id ? "bg-primary text-primary-fg" : "bg-panel text-muted"),
						children: c.label
					}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-9 rounded-md border border-border bg-panel px-2 text-xs",
						value: viz.agg,
						onChange: (e) => setAgg(e.target.value),
						children: AGGS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: a.id,
							children: a.label
						}, a.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 border-b border-border p-2 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
							label: "Rows",
							items: viz.rows,
							ds,
							onDrop: onDrop("rows"),
							onClear: () => dropField("rows", null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
							label: "Columns",
							items: viz.columns,
							ds,
							onDrop: onDrop("columns"),
							onClear: () => dropField("columns", null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
							label: "Split",
							items: viz.color ? [viz.color] : [],
							ds,
							onDrop: onDrop("color"),
							onClear: () => dropField("color", null)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterShelf, {
							ds,
							vizId: viz.id,
							filters: viz.filters,
							add: addFilter,
							remove: removeFilter
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1 flex-col lg:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sable-chart min-h-0 flex-1 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full overflow-hidden rounded-lg border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartView, {
								viz,
								result
							})
						})
					}), formatOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[50%] min-h-0 border-t border-border lg:max-h-none lg:h-auto lg:border-t-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormatPanel, {
							viz,
							result
						})
					}) : null]
				})
			]
		})]
	});
}
function Shelf({ label, items, ds, onDrop, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver: (e) => e.preventDefault(),
		onDrop,
		className: "min-h-16 rounded-md border border-dashed border-border bg-panel p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-muted",
				onClick: onClear,
				children: "clear"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1",
			children: items.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-sm bg-raised px-1.5 py-0.5 text-[11px]",
				children: ds.columns.find((c) => c.id === id)?.name ?? id
			}, id))
		})]
	});
}
function FilterShelf({ ds, vizId, filters, add, remove }) {
	const field = ds.columns[0]?.id ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-16 rounded-md border border-dashed border-border bg-panel p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[10px] uppercase tracking-wide text-muted",
				children: "Filter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: filters.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-sm bg-raised px-1.5 py-0.5 text-[11px]",
					onClick: () => remove(i),
					children: [
						ds.columns.find((c) => c.id === f.field)?.name,
						"=",
						f.value,
						" ×"
					]
				}, `${vizId}-${i}`))
			}),
			field ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "mt-1 h-8 w-full rounded-sm bg-bg text-[11px]",
				defaultValue: "",
				onChange: (e) => {
					const v = e.target.value;
					if (!v) return;
					const [fid, val] = v.split("::");
					add({
						field: fid,
						op: "eq",
						value: val
					});
					e.target.value = "";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Add value…"
				}), ds.columns.filter((c) => c.role === "dimension").flatMap((c) => uniqueValues(ds, c.id, 12).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: `${c.id}::${v}`,
					children: [
						c.name,
						": ",
						v
					]
				}, `${c.id}-${v}`)))]
			}) : null
		]
	});
}
function BoardTab() {
	const tiles = useStudio((s) => s.tiles);
	const vizs = useStudio((s) => s.vizs);
	const datasets = useStudio((s) => s.datasets);
	const addTile = useStudio((s) => s.addTile);
	const removeTile = useStudio((s) => s.removeTile);
	const activeVizId = useStudio((s) => s.activeVizId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 border-b border-border p-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-primary-fg",
				onClick: () => addTile(activeVizId),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Pin current view"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-auto p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: tiles.map((t) => {
					const viz = vizs.find((v) => v.id === t.vizId);
					const ds = viz && datasets.find((d) => d.id === viz.datasetId);
					if (!viz || !ds) return null;
					const result = query(ds, viz);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "flex h-72 flex-col overflow-hidden rounded-lg border border-border bg-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center justify-between px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-medium",
								children: viz.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "p-1 text-muted hover:text-danger",
								onClick: () => removeTile(t.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sable-chart min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartView, {
								viz,
								result
							})
						})]
					}, t.id);
				})
			})
		})]
	});
}
function PulseTab() {
	const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
	const items = (0, import_react.useMemo)(() => ds ? pulse(ds) : [], [ds]);
	if (!ds) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Load data to generate a pulse." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-auto p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-3xl gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Automatic read of ",
					ds.name,
					": mix, outliers, and latest change from the measures in view."
				]
			}), items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-border bg-panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wide text-muted",
						children: it.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 text-sm font-semibold",
						children: it.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: it.body
					})
				]
			}, it.id))]
		})
	});
}
function AskTab() {
	const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
	const applyAsk = useStudio((s) => s.applyAsk);
	const [q, setQ] = (0, import_react.useState)("Show sales by region as a stacked bar, split by channel");
	const [log, setLog] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const run = async () => {
		if (!ds) return;
		setBusy(true);
		const local = heuristicAsk(ds, q);
		const nameToId = (names, role) => (names ?? []).map((n) => ds.columns.find((c) => c.name.toLowerCase() === n.toLowerCase() && (!role || c.role === role))?.id).filter(Boolean);
		try {
			const sample = ds.rows.slice(0, 24).map((r) => {
				const o = {};
				ds.columns.forEach((c) => {
					o[c.name] = r[c.id];
				});
				return o;
			});
			const res = await askGrok({ data: {
				prompt: q,
				columns: ds.columns.map((c) => ({
					name: c.name,
					type: c.type,
					role: c.role
				})),
				sample
			} });
			if (res.ok) {
				const spec = res.spec;
				applyAsk({
					title: spec.title || q,
					chart: spec.chart,
					rows: nameToId(spec.rows),
					columns: nameToId(spec.columns),
					color: nameToId(spec.color ? [spec.color] : [])[0],
					agg: spec.agg
				});
				setLog((l) => [`Grok: ${spec.insight}`, ...l].slice(0, 8));
			} else {
				applyAsk(local);
				setLog((l) => [`Local layout (${res.error}): ${local.insight}`, ...l].slice(0, 8));
			}
		} catch {
			applyAsk(local);
			setLog((l) => [`Local layout: ${local.insight}`, ...l].slice(0, 8));
		} finally {
			setBusy(false);
		}
	};
	if (!ds) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Load data before asking." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-auto p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Describe the chart. Grok maps your wording onto the current table when the app connection is available; otherwise a local layout engine still builds a view."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "mt-3 h-28 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void run(),
					className: "mt-3 h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg disabled:opacity-50",
					children: busy ? "Working…" : "Build chart"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted",
					children: log.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-md border border-border bg-panel px-3 py-2",
						children: line
					}, i))
				})
			]
		})
	});
}
function WorkspaceIo() {
	const loadProject = useStudio((s) => s.loadProject);
	const save = () => {
		const s = useStudio.getState();
		const payload = {
			name: s.name,
			datasets: s.datasets,
			activeDatasetId: s.activeDatasetId,
			vizs: s.vizs,
			activeVizId: s.activeVizId,
			tiles: s.tiles,
			tab: s.tab,
			theme: s.theme ?? "light"
		};
		downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "sablepane-workspace.json");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-panel p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold",
			children: "Workspace file"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 rounded-md border border-border px-3 text-sm",
				onClick: save,
				children: "Download JSON"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "inline-flex h-11 cursor-pointer items-center rounded-md border border-border px-3 text-sm",
				children: ["Open JSON", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "application/json",
					className: "hidden",
					onChange: async (e) => {
						const f = e.target.files?.[0];
						if (!f) return;
						try {
							const p = JSON.parse(await f.text());
							if (p.datasets && p.vizs) loadProject(p);
						} catch {}
					}
				})]
			})]
		})]
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center p-6 text-sm text-muted",
		children
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { Home as component };

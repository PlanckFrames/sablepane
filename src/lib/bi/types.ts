export type FieldType = "string" | "number" | "date" | "bool";
export type Role = "dimension" | "measure";
export type Agg = "sum" | "avg" | "min" | "max" | "count" | "dcount" | "median";
export type ChartType =
  | "bar"
  | "bar-stack"
  | "line"
  | "area"
  | "scatter"
  | "pie"
  | "donut"
  | "table"
  | "kpi"
  | "heatmap"
  | "treemap"
  | "histogram"
  | "combo";

export type Column = {
  id: string;
  name: string;
  type: FieldType;
  role: Role;
};

export type Dataset = {
  id: string;
  name: string;
  source: "sample" | "csv" | "paste";
  columns: Column[];
  rows: Record<string, unknown>[];
};

export type Filter = {
  field: string;
  op: "eq" | "neq" | "contains" | "gt" | "lt";
  value: string;
};

export type ThemeId = "light" | "dark";

export type FontId = "plex" | "plex-mono" | "georgia" | "arial" | "times";

export type TextStyle = {
  font: FontId;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type NumberFormat = "auto" | "number" | "compact" | "percent" | "currency";

export type LegendPos = "top" | "top-left" | "top-right" | "bottom" | "left" | "right";

export type LabelPos = "end" | "center" | "inside" | "outside";

export type LineDash = "solid" | "dashed" | "dotted";

export type SeriesStyle = {
  fill: string;
  stroke: string;
  strokeWidth: number;
};

export type AxisStyle = {
  title: string;
  showTitle: boolean;
  showLabels: boolean;
  titleStyle: TextStyle;
  labelStyle: TextStyle;
  titleRotate: number;
  titleFlip: boolean;
  tickRotate: number;
  tickFlip: boolean;
  lineColor: string;
  lineWidth: number;
  min: string;
  max: string;
};

export type ChartStyle = {
  plotFill: string;
  grid: boolean;
  gridColor: string;
  x: AxisStyle;
  y: AxisStyle;
  legend: {
    show: boolean;
    title: string;
    position: LegendPos;
    rotate: number;
    flip: boolean;
    titleStyle: TextStyle;
    labelStyle: TextStyle;
  };
  dataLabels: {
    show: boolean;
    position: LabelPos;
    format: NumberFormat;
    decimals: number;
    rotate: number;
    flip: boolean;
    valueStyle: TextStyle;
  };
  pie: {
    showSliceLabels: boolean;
    showSliceValues: boolean;
    startAngle: number;
    padAngle: number;
    donutInner: number;
  };
  bars: {
    categoryGap: number;
    barGap: number;
    cornerRadius: number;
  };
  lines: {
    width: number;
    dots: boolean;
    dash: LineDash;
  };
  series: Record<string, SeriesStyle>;
};

export type Viz = {
  id: string;
  title: string;
  datasetId: string;
  chart: ChartType;
  rows: string[];
  columns: string[];
  color?: string;
  size?: string;
  filters: Filter[];
  agg: Agg;
  style?: ChartStyle;
};

export type DashTile = {
  id: string;
  vizId: string;
};

export type TabId = "data" | "sources" | "visualize" | "board" | "pulse" | "ask";

export type Project = {
  name: string;
  datasets: Dataset[];
  activeDatasetId: string;
  vizs: Viz[];
  activeVizId: string;
  tiles: DashTile[];
  tab: TabId;
  theme: ThemeId;
};

export const CHARTS: { id: ChartType; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "bar-stack", label: "Stacked" },
  { id: "line", label: "Line" },
  { id: "area", label: "Area" },
  { id: "scatter", label: "Scatter" },
  { id: "pie", label: "Pie" },
  { id: "donut", label: "Donut" },
  { id: "kpi", label: "KPI" },
  { id: "table", label: "Table" },
  { id: "heatmap", label: "Heat" },
  { id: "treemap", label: "Treemap" },
  { id: "histogram", label: "Histogram" },
  { id: "combo", label: "Combo" },
];

export const AGGS: { id: Agg; label: string }[] = [
  { id: "sum", label: "Sum" },
  { id: "avg", label: "Average" },
  { id: "median", label: "Median" },
  { id: "min", label: "Min" },
  { id: "max", label: "Max" },
  { id: "count", label: "Count" },
  { id: "dcount", label: "Distinct" },
];

export const PALETTE = [
  "#3d5a4c",
  "#8a6a4a",
  "#4a5e78",
  "#7a4e4a",
  "#5a6e52",
  "#6a5a78",
  "#4e6e6a",
  "#7a6248",
];

export const FONT_STACKS: Record<FontId, string> = {
  plex: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
  "plex-mono": '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  georgia: 'Georgia, "Times New Roman", serif',
  arial: "Arial, Helvetica, sans-serif",
  times: '"Times New Roman", Times, serif',
};

export const FONT_OPTIONS: { id: FontId; label: string }[] = [
  { id: "plex", label: "Plex Sans" },
  { id: "plex-mono", label: "Plex Mono" },
  { id: "georgia", label: "Georgia" },
  { id: "arial", label: "Arial" },
  { id: "times", label: "Times" },
];

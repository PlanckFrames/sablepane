import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  LayoutGrid,
  Link2,
  Moon,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { ChartView } from "./ChartView";
import { FormatPanel } from "./FormatPanel";
import { useStudio } from "@/store/studio";
import { AGGS, CHARTS, type Agg, type Column, type Dataset, type Filter, type Project, type TabId } from "@/lib/bi/types";
import { query, uniqueValues, heuristicAsk } from "@/lib/bi/engine";
import { parseTable, tableToDataset } from "@/lib/bi/csv";
import { SAMPLE_FNS } from "@/lib/bi/samples";
import { pulse } from "@/lib/bi/insights";
import { askChart, listAiModels } from "@/lib/bi/ask";
import { AI_PROVIDERS, type AiProviderId } from "@/lib/bi/ai-providers";
import { loadAiKeys, loadAiModels, loadAiProvider, saveAiKey, saveAiModel, saveAiProvider } from "@/lib/bi/user-api-key";
import { exportCsv, exportPdf, exportSvgAs } from "@/lib/bi/export";
import { cn, downloadBlob } from "@/lib/utils";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Link } from "@tanstack/react-router";

const TABS: { id: TabId; label: string; short: string; icon: typeof Database }[] = [
  { id: "data", label: "Data", short: "Data", icon: Database },
  { id: "sources", label: "Sources", short: "Sources", icon: Link2 },
  { id: "visualize", label: "Visualize", short: "Viz", icon: BarChart3 },
  { id: "board", label: "Board", short: "Board", icon: LayoutGrid },
  { id: "ask", label: "Chart with AI", short: "AI", icon: Sparkles },
];

export function StudioApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const api = useStudio.persist;
    if (!api?.rehydrate) {
      useStudio.getState().setHydrated(true);
      setReady(true);
      return;
    }
    void Promise.resolve(api.rehydrate()).then(() => {
      useStudio.getState().setHydrated(true);
      setReady(true);
    });
  }, []);

  const tab = useStudio((s) => s.tab);
  const setTab = useStudio((s) => s.setTab);
  const theme = useStudio((s) => s.theme ?? "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0b0d10" : "#f3efe6");
  }, [theme]);

  if (!ready) {
    return (
      <div className="flex h-dvh flex-col bg-bg text-fg">
        <header className="flex items-center gap-3 border-b border-border px-3 py-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">Sablepane</div>
            <div className="text-[11px] uppercase tracking-wide text-muted">Visual analytics</div>
          </div>
        </header>
        <main className="min-h-0 flex-1 bg-bg" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      <header className="flex items-center gap-3 border-b border-border px-3 py-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight">Sablepane</div>
          <div className="text-[11px] uppercase tracking-wide text-muted">Visual analytics</div>
        </div>
        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
          {TABS.map((t) => (
            <TabBtn key={t.id} id={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </nav>
        <ThemeToggle />
        <AuthSlot />
        <ExportMenu />
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        {tab === "data" || tab === "pulse" ? <DataTab /> : null}
        {tab === "sources" && <SourcesTab />}
        {tab === "visualize" && <VizTab />}
        {tab === "board" && <BoardTab />}
        {tab === "ask" && <AskTab />}
      </main>

      <nav className="grid grid-cols-5 border-t border-border md:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-0.5 text-[10px]",
              tab === t.id ? "text-fg" : "text-muted",
            )}
          >
            <t.icon className="size-4" />
            {t.short}
          </button>
        ))}
      </nav>
    </div>
  );
}

function TabBtn({
  id,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: TabId;
  label: string;
  icon: typeof Database;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-tab={id}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium",
        active ? "bg-raised text-fg" : "text-muted hover:bg-panel hover:text-fg",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-raised" />;
  if (user) {
    return (
      <div className="min-w-0 max-w-[42vw] overflow-hidden sm:max-w-none">
        <UserButton />
      </div>
    );
  }
  return (
    <Link
      to="/login"
      className="inline-flex h-9 shrink-0 items-center rounded-full border border-border bg-panel px-3 text-xs font-medium"
    >
      Sign in
    </Link>
  );
}

function ThemeToggle() {
  const theme = useStudio((s) => s.theme ?? "light");
  const setTheme = useStudio((s) => s.setTheme);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-panel text-fg hover:bg-raised"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

function ExportMenu() {
  const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
  const viz = useStudio((s) => s.vizs.find((v) => v.id === s.activeVizId));
  const run = (kind: "csv" | "pdf" | "jpg" | "png") => {
    if (kind === "csv" && ds) {
      exportCsv(ds);
      return;
    }
    const svg = document.querySelector(".sable-chart svg") as SVGElement | null;
    if (!viz || !svg) return;
    if (kind === "pdf") exportPdf(viz.title, svg);
    else exportSvgAs(kind === "jpg" ? "jpg" : "png", viz.title, svg);
  };
  return (
    <div className="flex items-center gap-1">
      <Download className="size-3.5 text-muted" />
      {(["csv", "pdf", "jpg", "png"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => run(k)}
          className="h-9 rounded-md bg-primary px-2 text-[11px] font-semibold uppercase tracking-wide text-primary-fg hover:opacity-90"
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function DataTab() {
  const datasets = useStudio((s) => s.datasets);
  const activeId = useStudio((s) => s.activeDatasetId);
  const setActive = useStudio((s) => s.setActiveDataset);
  const setColMeta = useStudio((s) => s.setColMeta);
  const ds = datasets.find((d) => d.id === activeId);
  if (!ds) return <Empty>Load a source first.</Empty>;
  const preview = ds.rows.slice(0, 80);
  return (
    <div className="flex h-full flex-col md:flex-row">
      <aside className="w-full shrink-0 overflow-auto border-b border-border p-3 md:w-72 md:border-b-0 md:border-r">
        <div className="mb-2 text-[11px] uppercase tracking-wide text-muted">Sets</div>
        {datasets.map((d) => (
          <div key={d.id} className="mb-3">
            <button
              type="button"
              onClick={() => setActive(d.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm",
                d.id === activeId ? "bg-raised" : "hover:bg-panel",
              )}
            >
              <span className="truncate">{d.name}</span>
              <span className="text-[11px] text-muted">{d.rows.length}</span>
            </button>
            <SetSummary ds={d} />
          </div>
        ))}
      </aside>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {ds.columns.map((c) => (
            <label key={c.id} className="flex items-center gap-2 rounded-md border border-border bg-panel px-2 py-1.5 text-xs">
              <span className="font-medium">{c.name}</span>
              <select
                className="bg-transparent text-muted"
                value={`${c.role}:${c.type}`}
                onChange={(e) => {
                  const [role, type] = e.target.value.split(":") as [Column["role"], Column["type"]];
                  setColMeta(ds.id, c.id, { role, type });
                }}
              >
                <option value="dimension:string">Dimension</option>
                <option value="measure:number">Measure</option>
                <option value="dimension:date">Date</option>
              </select>
            </label>
          ))}
        </div>
        <div className="overflow-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-panel">
              <tr>
                {ds.columns.map((c) => (
                  <th key={c.id} className="whitespace-nowrap px-2 py-2 font-medium">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {ds.columns.map((c) => (
                    <td key={c.id} className="whitespace-nowrap px-2 py-1.5 tabular-nums text-muted">
                      {r[c.id] == null ? "" : String(r[c.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SetSummary({ ds }: { ds: Dataset }) {
  const items = useMemo(() => pulse(ds), [ds]);
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-1 rounded-md border border-border bg-panel px-2.5 py-2">
      <button
        type="button"
        className="flex w-full items-center gap-1 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronDown className="size-3.5 shrink-0 text-muted" /> : <ChevronRight className="size-3.5 shrink-0 text-muted" />}
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Summary</span>
      </button>
      {open ? (
        items.length === 0 ? (
          <p className="mt-1 text-[11px] text-muted">No numeric measures to summarize.</p>
        ) : (
          <ul className="mt-1.5 space-y-1.5">
            {items.map((it) => (
              <li key={it.id}>
                <div className="text-[11px] font-semibold leading-tight">{it.title}</div>
                <p className="text-[11px] leading-snug text-muted">{it.body}</p>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}

function SourcesTab() {
  const addDataset = useStudio((s) => s.addDataset);
  const removeDataset = useStudio((s) => s.removeDataset);
  const datasets = useStudio((s) => s.datasets);
  const [paste, setPaste] = useState("");
  const onFile = async (file: File) => {
    const text = await file.text();
    const { names, rows } = parseTable(text);
    if (!names.length) return;
    addDataset(tableToDataset(file.name.replace(/\.[^.]+$/, ""), names, rows, "csv"));
  };
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto grid max-w-3xl gap-4">
        <section className="rounded-lg border border-border bg-panel p-4">
          <h2 className="text-sm font-semibold">Local files</h2>
          <p className="mt-1 text-xs text-muted">CSV or TSV stays in this browser. Nothing is uploaded.</p>
          <label className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg">
            <Upload className="size-4" />
            Choose CSV
            <input
              type="file"
              accept=".csv,.tsv,text/csv,text/tab-separated-values"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
          </label>
        </section>
        <section className="rounded-lg border border-border bg-panel p-4">
          <h2 className="text-sm font-semibold">Paste table</h2>
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="Paste comma- or tab-separated values with a header row."
            className="mt-2 h-32 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="mt-2 h-11 rounded-md border border-border px-3 text-sm"
            onClick={() => {
              const { names, rows } = parseTable(paste);
              if (!names.length) return;
              addDataset(tableToDataset("Pasted table", names, rows, "paste"));
              setPaste("");
            }}
          >
            Add pasted table
          </button>
        </section>
        <section className="rounded-lg border border-border bg-panel p-4">
          <h2 className="text-sm font-semibold">Sample sets</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_FNS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => addDataset(s.run())}
                className="h-11 rounded-md border border-border bg-raised px-3 text-sm"
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-border bg-panel p-4">
          <h2 className="text-sm font-semibold">Loaded</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {datasets.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2">
                <span>
                  {d.name}{" "}
                  <span className="text-muted">
                    {d.rows.length} rows · {d.source}
                  </span>
                </span>
                <button type="button" className="p-2 text-muted hover:text-danger" onClick={() => removeDataset(d.id)}>
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <WorkspaceIo />
      </div>
    </div>
  );
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
  const [picked, setPicked] = useState<string[]>([]);
  const [formatOpen, setFormatOpen] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setFormatOpen(true);
  }, []);
  const result = useMemo(() => (ds && viz ? query(ds, viz) : null), [ds, viz]);
  if (!ds || !viz || !result) return <Empty>Add a data source to visualize.</Empty>;

  const onDragStart = (id: string) => (e: DragEvent) => {
    e.dataTransfer.setData("text/plain", id);
  };
  const onDrop = (slot: "rows" | "columns" | "color" | "size") => (e: DragEvent) => {
    e.preventDefault();
    dropField(slot, e.dataTransfer.getData("text/plain"));
  };

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <aside className="max-h-[40%] overflow-auto border-b border-border p-3 lg:max-h-none lg:w-56 lg:border-b-0 lg:border-r">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-muted">Fields</span>
          <button
            type="button"
            className="text-[11px] text-accent"
            onClick={() => applyShowMe(picked.length ? picked : ds.columns.map((c) => c.id))}
          >
            Auto layout
          </button>
        </div>
        {ds.columns.map((c) => (
          <button
            key={c.id}
            type="button"
            draggable
            onDragStart={onDragStart(c.id)}
            onClick={() => setPicked((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))}
            className={cn(
              "mb-1 flex w-full cursor-grab items-center justify-between rounded-md border px-2 py-2 text-left text-xs",
              picked.includes(c.id) ? "border-accent bg-raised" : "border-border bg-panel",
            )}
          >
            <span className="truncate">{c.name}</span>
            <span className="text-[10px] uppercase text-muted">{c.role === "measure" ? "123" : "abc"}</span>
          </button>
        ))}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-2">
          <select
            className="h-9 rounded-md border border-border bg-panel px-2 text-xs"
            value={viz.id}
            onChange={(e) => setActiveViz(e.target.value)}
          >
            {vizs.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
          <button type="button" className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2 text-xs" onClick={addViz}>
            <Plus className="size-3.5" /> New
          </button>
          <input
            className="h-9 min-w-32 flex-1 rounded-md border border-border bg-bg px-2 text-sm"
            value={viz.title}
            onChange={(e) => patchViz(viz.id, { title: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setFormatOpen((v) => !v)}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-md border px-2 text-xs",
              formatOpen ? "border-accent bg-raised text-fg" : "border-border text-muted",
            )}
          >
            <SlidersHorizontal className="size-3.5" /> Format
          </button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-border p-2">
          {CHARTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChart(c.id)}
              className={cn(
                "h-9 rounded-md px-2 text-[11px] font-medium",
                viz.chart === c.id ? "bg-primary text-primary-fg" : "bg-panel text-muted",
              )}
            >
              {c.label}
            </button>
          ))}
          <select
            className="h-9 rounded-md border border-border bg-panel px-2 text-xs"
            value={viz.agg}
            onChange={(e) => setAgg(e.target.value as Agg)}
          >
            {AGGS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2 border-b border-border p-2 sm:grid-cols-2 lg:grid-cols-4">
          <Shelf label="Rows" items={viz.rows} ds={ds} onDrop={onDrop("rows")} onClear={() => dropField("rows", null)} />
          <Shelf
            label="Columns"
            items={viz.columns}
            ds={ds}
            onDrop={onDrop("columns")}
            onClear={() => dropField("columns", null)}
          />
          <Shelf
            label="Split"
            items={viz.color ? [viz.color] : []}
            ds={ds}
            onDrop={onDrop("color")}
            onClear={() => dropField("color", null)}
          />
          <FilterShelf ds={ds} vizId={viz.id} filters={viz.filters} add={addFilter} remove={removeFilter} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="sable-chart min-h-0 flex-1 p-2">
            <div className="h-full min-h-0 overflow-auto rounded-lg border border-border">
              <ChartView viz={viz} result={result} />
            </div>
          </div>
          {formatOpen ? (
            <div className="max-h-[50%] min-h-0 border-t border-border lg:max-h-none lg:h-auto lg:border-t-0">
              <FormatPanel viz={viz} result={result} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Shelf({
  label,
  items,
  ds,
  onDrop,
  onClear,
}: {
  label: string;
  items: string[];
  ds: { columns: Column[] };
  onDrop: (e: DragEvent) => void;
  onClear: () => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="min-h-16 rounded-md border border-dashed border-border bg-panel p-2"
    >
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted">
        {label}
        <button type="button" className="text-muted" onClick={onClear}>
          clear
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((id) => (
          <span key={id} className="rounded-sm bg-raised px-1.5 py-0.5 text-[11px]">
            {ds.columns.find((c) => c.id === id)?.name ?? id}
          </span>
        ))}
      </div>
    </div>
  );
}

function FilterShelf({
  ds,
  vizId,
  filters,
  add,
  remove,
}: {
  ds: Dataset;
  vizId: string;
  filters: Filter[];
  add: (f: Filter) => void;
  remove: (i: number) => void;
}) {
  const field = ds.columns[0]?.id ?? "";
  return (
    <div className="min-h-16 rounded-md border border-dashed border-border bg-panel p-2">
      <div className="mb-1 text-[10px] uppercase tracking-wide text-muted">Filter</div>
      <div className="flex flex-wrap gap-1">
        {filters.map((f, i) => (
          <button key={`${vizId}-${i}`} type="button" className="rounded-sm bg-raised px-1.5 py-0.5 text-[11px]" onClick={() => remove(i)}>
            {ds.columns.find((c) => c.id === f.field)?.name}={f.value} ×
          </button>
        ))}
      </div>
      {field ? (
        <select
          className="mt-1 h-8 w-full rounded-sm bg-bg text-[11px]"
          defaultValue=""
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            const [fid, val] = v.split("::");
            add({ field: fid, op: "eq", value: val });
            e.target.value = "";
          }}
        >
          <option value="">Add value…</option>
          {ds.columns
            .filter((c) => c.role === "dimension")
            .flatMap((c) =>
              uniqueValues(ds, c.id, 12).map((v) => (
                <option key={`${c.id}-${v}`} value={`${c.id}::${v}`}>
                  {c.name}: {v}
                </option>
              )),
            )}
        </select>
      ) : null}
    </div>
  );
}

function BoardTab() {
  const tiles = useStudio((s) => s.tiles);
  const vizs = useStudio((s) => s.vizs);
  const datasets = useStudio((s) => s.datasets);
  const addTile = useStudio((s) => s.addTile);
  const removeTile = useStudio((s) => s.removeTile);
  const activeVizId = useStudio((s) => s.activeVizId);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border p-2">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-primary-fg"
          onClick={() => addTile(activeVizId)}
        >
          <Plus className="size-3.5" /> Pin current view
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <div className="grid gap-3 md:grid-cols-2">
          {tiles.map((t) => {
            const viz = vizs.find((v) => v.id === t.vizId);
            const ds = viz && datasets.find((d) => d.id === viz.datasetId);
            if (!viz || !ds) return null;
            const result = query(ds, viz);
            return (
              <article key={t.id} className="flex h-72 flex-col overflow-hidden rounded-lg border border-border bg-panel">
                <header className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="truncate font-medium">{viz.title}</span>
                  <button type="button" className="p-1 text-muted hover:text-danger" onClick={() => removeTile(t.id)}>
                    <Trash2 className="size-4" />
                  </button>
                </header>
                <div className="sable-chart min-h-0 flex-1">
                  <ChartView viz={viz} result={result} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AskTab() {
  const ds = useStudio((s) => s.datasets.find((d) => d.id === s.activeDatasetId));
  const applyAsk = useStudio((s) => s.applyAsk);
  const [q, setQ] = useState("Show sales by region as a stacked bar, split by channel");
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<AiProviderId>("xai");
  const [keys, setKeys] = useState<Record<AiProviderId, string>>({ xai: "", openai: "", anthropic: "", google: "" });
  const [models, setModels] = useState<Record<AiProviderId, string>>({
    xai: "grok-4.5",
    openai: "gpt-4o",
    anthropic: "claude-sonnet-4-5",
    google: "gemini-2.5-flash",
  });
  const [keyReady, setKeyReady] = useState(false);
  const [catalog, setCatalog] = useState<string[]>([]);
  const [catalogNote, setCatalogNote] = useState("");
  const [listing, setListing] = useState(false);

  useEffect(() => {
    setKeys(loadAiKeys());
    setModels(loadAiModels());
    setProvider(loadAiProvider());
    setKeyReady(true);
  }, []);

  const meta = AI_PROVIDERS.find((p) => p.id === provider) ?? AI_PROVIDERS[0];
  const apiKey = keys[provider] ?? "";
  const model = models[provider] ?? meta.models[0];

  const applyLocal = (local: ReturnType<typeof heuristicAsk>, note?: string) => {
    applyAsk(local);
    setLog((l) => [`${note ? `${note} ` : ""}${local.insight}`, ...l].slice(0, 8));
  };

  const nameToId = (names: string[] | undefined, role?: Column["role"]) =>
    (names ?? [])
      .map((n) => ds?.columns.find((c) => c.name.toLowerCase() === n.toLowerCase() && (!role || c.role === role))?.id)
      .filter(Boolean) as string[];

  const runLocal = () => {
    if (!ds) return;
    applyLocal(heuristicAsk(ds, q));
  };

  const loadCatalog = async () => {
    const key = apiKey.trim();
    if (key.length < 12) {
      setCatalogNote("Paste your API key first, then load the model list.");
      return;
    }
    setListing(true);
    setCatalogNote("");
    try {
      const res = await listAiModels({ data: { provider, apiKey: key } });
      if (res.ok && res.models.length) {
        setCatalog(res.models);
        setCatalogNote(`${res.models.length} models from your ${meta.label} key. Type any id if yours isn’t listed.`);
      } else {
        setCatalog([]);
        setCatalogNote(res.ok ? "No models returned. Type the id yourself." : res.error);
      }
    } catch {
      setCatalog([]);
      setCatalogNote("Could not list models. Type the id yourself.");
    } finally {
      setListing(false);
    }
  };

  const runAi = async () => {
    if (!ds) return;
    const local = heuristicAsk(ds, q);
    const key = apiKey.trim();
    if (!key) {
      applyLocal(local, "Local layout:");
      return;
    }
    setBusy(true);
    try {
      const sample = ds.rows.slice(0, 24).map((r) => {
        const o: Record<string, unknown> = {};
        ds.columns.forEach((c) => {
          o[c.name] = r[c.id];
        });
        return o;
      });
      const res = await askChart({
        data: {
          prompt: q,
          columns: ds.columns.map((c) => ({ name: c.name, type: c.type, role: c.role })),
          sample,
          apiKey: key,
          provider,
          model,
        },
      });
      if (res.ok) {
        const spec = res.spec;
        applyAsk({
          title: spec.title || q,
          chart: spec.chart,
          rows: nameToId(spec.rows),
          columns: nameToId(spec.columns),
          color: nameToId(spec.color ? [spec.color] : [])[0],
          agg: spec.agg,
        });
        setLog((l) => [`${meta.label} ${model} (your key): ${spec.insight}`, ...l].slice(0, 8));
      } else {
        applyLocal(local, `Local layout (${res.error}):`);
      }
    } catch {
      applyLocal(local, "Local layout:");
    } finally {
      setBusy(false);
    }
  };

  if (!ds) return <Empty>Load data before asking.</Empty>;
  const aiReady = apiKey.trim().length > 8 && model.trim().length > 1;
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted">
          Describe the chart. Local layout is free. Optional AI uses a key you paste — OpenAI, Anthropic, Google Gemini, or
          xAI. No X or Google account needed. This app never uses the publisher’s credits.
        </p>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-3 h-28 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={runLocal}
            className="h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg disabled:opacity-50"
          >
            Build with local layout
          </button>
          <button
            type="button"
            disabled={busy || !aiReady}
            onClick={() => void runAi()}
            className="h-11 rounded-md border border-border bg-panel px-4 text-sm font-medium disabled:opacity-50"
          >
            {busy ? `Asking ${model}…` : `Build with ${meta.label}`}
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-panel p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted">Your AI provider</div>
          <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={cn(
                  "h-9 rounded-sm px-2 text-[11px]",
                  provider === p.id ? "bg-primary text-primary-fg" : "border border-border bg-bg",
                )}
                onClick={() => {
                  setProvider(p.id);
                  saveAiProvider(p.id);
                  setCatalog([]);
                  setCatalogNote("");
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted">
              Paste a key from{" "}
              <a className="underline" href={meta.docs} target="_blank" rel="noreferrer">
                {meta.docsLabel}
              </a>
              . It stays in this browser and bills that provider only. Type any model id your key can call — including
              custom, fine-tuned, or deployment names. Suggestions are shortcuts, not a limit.
            </p>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wide text-muted">Model</span>
                <button
                  type="button"
                  disabled={listing || apiKey.trim().length < 12}
                  className="text-[11px] text-accent disabled:text-muted"
                  onClick={() => void loadCatalog()}
                >
                  {listing ? "Loading…" : "Load models from my key"}
                </button>
              </div>
              <input
                aria-label={`${meta.label} model`}
                list={`sable-models-${provider}`}
                spellCheck={false}
                value={model}
                placeholder="Type any model id"
                className="h-10 w-full rounded-md border border-border bg-bg px-3 font-mono text-xs"
                onChange={(e) => {
                  const v = e.target.value;
                  setModels((prev) => ({ ...prev, [provider]: v }));
                  saveAiModel(provider, v);
                }}
              />
              <datalist id={`sable-models-${provider}`}>
                {(catalog.length ? catalog : [...meta.models]).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {(catalog.length ? catalog.slice(0, 12) : [...meta.models]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={cn(
                      "h-8 max-w-full truncate rounded-sm px-2 font-mono text-[10px]",
                      model === m ? "bg-primary text-primary-fg" : "border border-border bg-bg",
                    )}
                    onClick={() => {
                      setModels((prev) => ({ ...prev, [provider]: m }));
                      saveAiModel(provider, m);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {catalogNote ? <p className="mt-1 text-[11px] text-muted">{catalogNote}</p> : null}
            </div>
            {keyReady ? (
              <label className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Your {meta.label} API key</span>
                <input
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  value={apiKey}
                  placeholder={meta.placeholder}
                  className="h-10 w-full rounded-md border border-border bg-bg px-3 font-mono text-xs"
                  onChange={(e) => {
                    const v = e.target.value;
                    setKeys((k) => ({ ...k, [provider]: v }));
                    saveAiKey(provider, v);
                  }}
                />
              </label>
            ) : null}
            {apiKey ? (
              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => {
                  setKeys((k) => ({ ...k, [provider]: "" }));
                  saveAiKey(provider, "");
                }}
              >
                Forget this key on this device
              </button>
            ) : null}
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-muted">
          {log.map((line, i) => (
            <li key={i} className="rounded-md border border-border bg-panel px-3 py-2">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WorkspaceIo() {
  const loadProject = useStudio((s) => s.loadProject);
  const save = () => {
    const s = useStudio.getState();
    const payload: Project = {
      name: s.name,
      datasets: s.datasets,
      activeDatasetId: s.activeDatasetId,
      vizs: s.vizs,
      activeVizId: s.activeVizId,
      tiles: s.tiles,
      tab: s.tab,
      theme: s.theme ?? "light",
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "sablepane-workspace.json");
  };
  return (
    <section className="rounded-lg border border-border bg-panel p-4">
      <h2 className="text-sm font-semibold">Workspace file</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="h-11 rounded-md border border-border px-3 text-sm" onClick={save}>
          Download JSON
        </button>
        <label className="inline-flex h-11 cursor-pointer items-center rounded-md border border-border px-3 text-sm">
          Open JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const p = JSON.parse(await f.text()) as Project;
                if (p.datasets && p.vizs) loadProject(p);
              } catch {
                /* ignore */
              }
            }}
          />
        </label>
      </div>
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <div className="flex h-full items-center justify-center p-6 text-sm text-muted">{children}</div>;
}

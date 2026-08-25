import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import type { Agg, ChartType, Column, Dataset, Filter, Project, TabId, ThemeId, Viz } from "@/lib/bi/types";
import { sampleRetail } from "@/lib/bi/samples";
import { showMe } from "@/lib/bi/engine";
import { patchChartStyle } from "@/lib/bi/chart-style";

function seedViz(ds: Dataset): Viz {
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
    agg: "sum",
  };
}

function seed(): Project {
  const ds = sampleRetail("harbor");
  const dim = ds.columns.find((c) => c.role === "dimension");
  const meas = ds.columns.find((c) => c.role === "measure");
  const split = ds.columns.find((c) => c.role === "dimension" && c.id !== dim?.id);
  const viz: Viz = {
    id: "viz_seed",
    title: `${meas?.name ?? "Value"} by ${dim?.name ?? "category"}`,
    datasetId: ds.id,
    chart: "bar",
    rows: dim ? [dim.id] : [],
    columns: meas ? [meas.id] : [],
    color: split?.id,
    filters: [],
    agg: "sum",
  };
  return {
    name: "Sablepane workspace",
    datasets: [ds],
    activeDatasetId: ds.id,
    vizs: [viz],
    activeVizId: viz.id,
    tiles: [{ id: "tile_seed", vizId: viz.id }],
    tab: "visualize",
    theme: "light",
  };
}

type Studio = Project & {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setTab: (t: TabId) => void;
  setName: (n: string) => void;
  setTheme: (t: ThemeId) => void;
  setActiveDataset: (id: string) => void;
  setActiveViz: (id: string) => void;
  addDataset: (ds: Dataset) => void;
  removeDataset: (id: string) => void;
  setColMeta: (dsId: string, colId: string, patch: Partial<Column>) => void;
  addViz: () => void;
  patchViz: (id: string, patch: Partial<Viz>) => void;
  patchStyle: (id: string, patch: unknown) => void;
  dropField: (slot: "rows" | "columns" | "color" | "size", colId: string | null) => void;
  setChart: (chart: ChartType) => void;
  setAgg: (agg: Agg) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (i: number) => void;
  applyShowMe: (selected: string[]) => void;
  applyAsk: (spec: Partial<Viz> & { title?: string }) => void;
  addTile: (vizId?: string) => void;
  removeTile: (id: string) => void;
  loadProject: (p: Project) => void;
  reset: () => void;
};

export const useStudio = create<Studio>()(
  persist(
    (set, get) => ({
      ...seed(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setTab: (tab) => set({ tab: tab === "pulse" ? "data" : tab }),
      setName: (name) => set({ name }),
      setTheme: (theme) => set({ theme }),
      setActiveDataset: (id) => set({ activeDatasetId: id }),
      setActiveViz: (id) => set({ activeVizId: id }),
      addDataset: (ds) =>
        set((s) => {
          const viz = seedViz(ds);
          return {
            datasets: [...s.datasets, ds],
            activeDatasetId: ds.id,
            vizs: [...s.vizs, viz],
            activeVizId: viz.id,
            tiles: [...s.tiles, { id: uid("tile"), vizId: viz.id }],
            tab: "visualize",
          };
        }),
      removeDataset: (id) =>
        set((s) => {
          const datasets = s.datasets.filter((d) => d.id !== id);
          const vizs = s.vizs.filter((v) => v.datasetId !== id);
          const keep = new Set(vizs.map((v) => v.id));
          return {
            datasets,
            vizs,
            tiles: s.tiles.filter((t) => keep.has(t.vizId)),
            activeDatasetId: datasets[0]?.id ?? "",
            activeVizId: vizs[0]?.id ?? "",
          };
        }),
      setColMeta: (dsId, colId, patch) =>
        set((s) => ({
          datasets: s.datasets.map((d) =>
            d.id !== dsId
              ? d
              : { ...d, columns: d.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)) },
          ),
        })),
      addViz: () =>
        set((s) => {
          const ds = s.datasets.find((d) => d.id === s.activeDatasetId);
          if (!ds) return s;
          const viz = seedViz(ds);
          return { vizs: [...s.vizs, viz], activeVizId: viz.id, tab: "visualize" };
        }),
      patchViz: (id, patch) => set((s) => ({ vizs: s.vizs.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
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
          get().patchViz(id, { [slot]: colId || undefined });
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
      addTile: (vizId) => set((s) => ({ tiles: [...s.tiles, { id: uid("tile"), vizId: vizId ?? s.activeVizId }] })),
      removeTile: (id) => set((s) => ({ tiles: s.tiles.filter((t) => t.id !== id) })),
      loadProject: (p) => set({ ...seed(), ...p, theme: p.theme ?? "light", hydrated: true }),
      reset: () => set({ ...seed(), hydrated: true }),
    }),
    {
      name: "sablepane-v1",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Project>;
        return { ...current, ...p, theme: p.theme ?? "light", tab: p.tab === "pulse" ? "data" : (p.tab ?? current.tab) };
      },
      partialize: (s) => ({
        name: s.name,
        datasets: s.datasets,
        activeDatasetId: s.activeDatasetId,
        vizs: s.vizs,
        activeVizId: s.activeVizId,
        tiles: s.tiles,
        tab: s.tab,
        theme: s.theme,
      }),
    },
  ),
);

import { createServerFn } from "@tanstack/react-start";
import { AI_PROVIDERS, defaultModel, safeModelId, type AiProviderId } from "./ai-providers";
import type { Agg, ChartType } from "./types";

export type AskSpec = {
  title: string;
  chart: ChartType;
  rows: string[];
  columns: string[];
  color?: string;
  agg: Agg;
  insight: string;
};

type AskInput = {
  prompt: string;
  columns: { name: string; type: string; role: string }[];
  sample: Record<string, unknown>[];
  apiKey: string;
  provider: AiProviderId;
  model: string;
};

const SYS = `You are a visual analytics assistant. Given a table schema and a user request, return ONLY compact JSON with keys:
title (string), chart (one of bar, bar-stack, line, area, scatter, pie, donut, table, kpi, heatmap, treemap, histogram, combo),
rows (array of dimension column NAMES), columns (array of measure column NAMES), color (optional dimension NAME or null),
agg (sum|avg|min|max|count|dcount|median), insight (one short sentence).
Use only provided column names. Prefer simple charts.`;

function looksLikeKey(k: string): boolean {
  const t = k.trim();
  return t.length >= 12 && !/\s/.test(t);
}

function parseSpec(text: string): AskSpec | null {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd <= jsonStart) return null;
  try {
    return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as AskSpec;
  } catch {
    return null;
  }
}

function statusError(provider: string, status: number): string {
  if (status === 401 || status === 403) return `Your ${provider} API key was rejected.`;
  if (status === 404) return `Unknown ${provider} model. Check the model id.`;
  if (status === 429) return `Your ${provider} rate limit or credits ran out.`;
  return `${provider} request failed (${status}).`;
}

async function chatOpenAiCompat(url: string, apiKey: string, model: string, user: string) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 500,
      messages: [
        { role: "system", content: SYS },
        { role: "user", content: user },
      ],
    }),
  });
}

export const askChart = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }): Promise<{ ok: true; spec: AskSpec } | { ok: false; error: string }> => {
    const apiKey = data.apiKey.trim();
    const meta = AI_PROVIDERS.find((p) => p.id === data.provider);
    if (!meta) return { ok: false, error: "Unknown AI provider." };
    if (!looksLikeKey(apiKey)) return { ok: false, error: `Add your own ${meta.label} API key.` };
    const model = safeModelId(data.model) ?? defaultModel(meta.id);

    const user = JSON.stringify({
      request: data.prompt.slice(0, 500),
      columns: data.columns,
      sample: data.sample.slice(0, 24),
    });

    let res: Response;
    let text = "";
    try {
      if (data.provider === "xai") {
        res = await chatOpenAiCompat("https://api.x.ai/v1/chat/completions", apiKey, model, user);
      } else if (data.provider === "openai") {
        res = await chatOpenAiCompat("https://api.openai.com/v1/chat/completions", apiKey, model, user);
      } else if (data.provider === "anthropic") {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 500,
            temperature: 0.2,
            system: SYS,
            messages: [{ role: "user", content: user }],
          }),
        });
      } else {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYS }] },
              contents: [{ role: "user", parts: [{ text: user }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
            }),
          },
        );
      }
    } catch {
      return { ok: false, error: `Could not reach ${meta.label}.` };
    }

    if (!res.ok) return { ok: false, error: statusError(meta.label, res.status) };

    try {
      const body = (await res.json()) as Record<string, unknown>;
      if (data.provider === "anthropic") {
        const blocks = body.content as { text?: string }[] | undefined;
        text = blocks?.map((b) => b.text ?? "").join("\n") ?? "";
      } else if (data.provider === "google") {
        const cands = body.candidates as { content?: { parts?: { text?: string }[] } }[] | undefined;
        text = cands?.[0]?.content?.parts?.map((p) => p.text ?? "").join("\n") ?? "";
      } else {
        const choices = body.choices as { message?: { content?: string } }[] | undefined;
        text = choices?.[0]?.message?.content ?? "";
      }
    } catch {
      return { ok: false, error: `${meta.label} returned an unreadable response.` };
    }

    const parsed = parseSpec(text);
    if (!parsed) return { ok: false, error: `${meta.label} returned no chart spec.` };
    return { ok: true, spec: parsed };
  });

function uniqIds(ids: string[]): string[] {
  return [...new Set(ids.map((s) => s.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export const listAiModels = createServerFn({ method: "POST" })
  .validator((input: { provider: AiProviderId; apiKey: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; models: string[] } | { ok: false; error: string }> => {
    const apiKey = data.apiKey.trim();
    const meta = AI_PROVIDERS.find((p) => p.id === data.provider);
    if (!meta) return { ok: false, error: "Unknown AI provider." };
    if (!looksLikeKey(apiKey)) return { ok: false, error: `Add your own ${meta.label} API key.` };

    try {
      if (data.provider === "xai" || data.provider === "openai") {
        const url =
          data.provider === "xai" ? "https://api.x.ai/v1/models" : "https://api.openai.com/v1/models";
        const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
        if (!res.ok) return { ok: false, error: statusError(meta.label, res.status) };
        const body = (await res.json()) as { data?: { id?: string }[] };
        return { ok: true, models: uniqIds((body.data ?? []).map((m) => m.id ?? "")) };
      }
      if (data.provider === "anthropic") {
        const res = await fetch("https://api.anthropic.com/v1/models", {
          headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        });
        if (!res.ok) return { ok: false, error: statusError(meta.label, res.status) };
        const body = (await res.json()) as { data?: { id?: string }[] };
        return { ok: true, models: uniqIds((body.data ?? []).map((m) => m.id ?? "")) };
      }
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      );
      if (!res.ok) return { ok: false, error: statusError(meta.label, res.status) };
      const body = (await res.json()) as { models?: { name?: string }[] };
      const ids = (body.models ?? []).map((m) => (m.name ?? "").replace(/^models\//, ""));
      return { ok: true, models: uniqIds(ids) };
    } catch {
      return { ok: false, error: `Could not list ${meta.label} models.` };
    }
  });

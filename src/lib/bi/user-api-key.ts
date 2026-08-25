import { AI_PROVIDERS, defaultModel, type AiProviderId } from "./ai-providers";

const KEYS = "sablepane-ai-keys";
const PROVIDER = "sablepane-ai-provider";
const MODELS = "sablepane-ai-models";
const LEGACY_XAI = "sablepane-xai-api-key";

export type AiKeyMap = Record<AiProviderId, string>;
export type AiModelMap = Record<AiProviderId, string>;

function emptyKeys(): AiKeyMap {
  return { xai: "", openai: "", anthropic: "", google: "" };
}

function emptyModels(): AiModelMap {
  return {
    xai: defaultModel("xai"),
    openai: defaultModel("openai"),
    anthropic: defaultModel("anthropic"),
    google: defaultModel("google"),
  };
}

export function loadAiKeys(): AiKeyMap {
  const out = emptyKeys();
  if (typeof localStorage === "undefined") return out;
  try {
    const raw = localStorage.getItem(KEYS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AiKeyMap>;
      for (const p of AI_PROVIDERS) {
        const v = parsed[p.id];
        out[p.id] = typeof v === "string" ? v : "";
      }
    }
    const legacy = localStorage.getItem(LEGACY_XAI);
    if (legacy && !out.xai) out.xai = legacy;
  } catch {
    /* ignore */
  }
  return out;
}

export function saveAiKey(provider: AiProviderId, key: string) {
  const next = loadAiKeys();
  next[provider] = key.trim();
  try {
    localStorage.setItem(KEYS, JSON.stringify(next));
    if (provider === "xai") {
      if (next.xai) localStorage.setItem(LEGACY_XAI, next.xai);
      else localStorage.removeItem(LEGACY_XAI);
    }
  } catch {
    /* ignore */
  }
}

export function loadAiModels(): AiModelMap {
  const out = emptyModels();
  if (typeof localStorage === "undefined") return out;
  try {
    const raw = localStorage.getItem(MODELS);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AiModelMap>;
      for (const p of AI_PROVIDERS) {
        const v = parsed[p.id];
        if (typeof v === "string" && v.trim()) out[p.id] = v.trim();
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

export function saveAiModel(provider: AiProviderId, model: string) {
  const next = loadAiModels();
  next[provider] = model.trim() || defaultModel(provider);
  try {
    localStorage.setItem(MODELS, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function loadAiProvider(): AiProviderId {
  if (typeof localStorage === "undefined") return "xai";
  try {
    const v = localStorage.getItem(PROVIDER);
    if (AI_PROVIDERS.some((p) => p.id === v)) return v as AiProviderId;
  } catch {
    /* ignore */
  }
  return "xai";
}

export function saveAiProvider(id: AiProviderId) {
  try {
    localStorage.setItem(PROVIDER, id);
  } catch {
    /* ignore */
  }
}

export const AI_PROVIDERS = [
  {
    id: "xai",
    label: "xAI Grok",
    models: ["grok-4.5", "grok-4", "grok-3", "grok-3-mini", "grok-2", "grok-2-vision-1212"],
    docs: "https://console.x.ai",
    docsLabel: "console.x.ai",
    placeholder: "xai-…",
  },
  {
    id: "openai",
    label: "OpenAI",
    models: [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "o3",
      "o3-mini",
      "o4-mini",
      "chatgpt-4o-latest",
    ],
    docs: "https://platform.openai.com/api-keys",
    docsLabel: "platform.openai.com",
    placeholder: "sk-…",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    models: [
      "claude-opus-4-5",
      "claude-sonnet-4-5",
      "claude-haiku-4-5",
      "claude-opus-4-1",
      "claude-sonnet-4-0",
      "claude-3-5-sonnet-latest",
      "claude-3-5-haiku-latest",
    ],
    docs: "https://console.anthropic.com",
    docsLabel: "console.anthropic.com",
    placeholder: "sk-ant-…",
  },
  {
    id: "google",
    label: "Google Gemini",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite"],
    docs: "https://aistudio.google.com/apikey",
    docsLabel: "aistudio.google.com",
    placeholder: "AIza…",
  },
] as const;

export type AiProviderId = (typeof AI_PROVIDERS)[number]["id"];

export function aiProvider(id: string) {
  return AI_PROVIDERS.find((p) => p.id === id) ?? AI_PROVIDERS[0];
}

export function defaultModel(id: AiProviderId): string {
  return aiProvider(id).models[0];
}

export function safeModelId(raw: string): string | null {
  const t = raw.trim().slice(0, 120);
  if (/^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$/.test(t)) return t;
  return null;
}

import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-Bq4xQfft.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askGrok_createServerFn_handler = createServerRpc({
	id: "b20434d4d339d44e35c1e1963eb9e8a5f3361e9df18474c134c916b7f5010f5b",
	name: "askGrok",
	filename: "src/lib/bi/ask.ts"
}, (opts) => askGrok.__executeServer(opts));
var askGrok = createServerFn({ method: "POST" }).validator((input) => input).handler(askGrok_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Ask Grok is not available in this environment."
	};
	const sys = `You are a visual analytics assistant. Given a table schema and a user request, return ONLY compact JSON with keys:
title (string), chart (one of bar, bar-stack, line, area, scatter, pie, donut, table, kpi, heatmap, treemap, histogram, combo),
rows (array of dimension column NAMES), columns (array of measure column NAMES), color (optional dimension NAME or null),
agg (sum|avg|min|max|count|dcount|median), insight (one short sentence).
Use only provided column names. Prefer simple charts.`;
	const user = JSON.stringify({
		request: data.prompt.slice(0, 500),
		columns: data.columns,
		sample: data.sample.slice(0, 24)
	});
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .2,
			max_tokens: 500,
			messages: [{
				role: "system",
				content: sys
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Grok request failed (${res.status}).`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	const jsonStart = text.indexOf("{");
	const jsonEnd = text.lastIndexOf("}");
	if (jsonStart < 0 || jsonEnd <= jsonStart) return {
		ok: false,
		error: "Grok returned no chart spec."
	};
	try {
		return {
			ok: true,
			spec: JSON.parse(text.slice(jsonStart, jsonEnd + 1))
		};
	} catch {
		return {
			ok: false,
			error: "Could not parse Grok chart spec."
		};
	}
});
//#endregion
export { askGrok_createServerFn_handler };

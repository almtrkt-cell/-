import Anthropic from "@anthropic-ai/sdk";
import { parse } from "node-html-parser";
import type { Locale } from "./i18n";

export type Impact = "high" | "medium" | "low";

export interface CategoryResult {
  score: number;
  analysis: string;
}

export interface Recommendation {
  title: string;
  detail: string;
  impact: Impact;
}

export interface PageSignals {
  finalUrl: string;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  lang: string | null;
  h1: string[];
  h2: string[];
  headingCount: number;
  wordCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  linkCount: number;
  hasViewport: boolean;
  isHttps: boolean;
  htmlBytes: number;
  responseMs: number;
}

export interface AuditResult {
  url: string;
  fetchedAt: string;
  locale: Locale;
  overallScore: number;
  headline: string;
  summary: string;
  seo: CategoryResult;
  brandClarity: CategoryResult;
  cta: CategoryResult;
  mobile: CategoryResult;
  strengths: string[];
  recommendations: Recommendation[];
  signals: PageSignals;
}

export class AuditError extends Error {
  code:
    | "invalid_url"
    | "fetch_failed"
    | "timeout"
    | "not_html"
    | "no_api_key"
    | "ai_failed";
  status: number;
  constructor(code: AuditError["code"], message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const FETCH_TIMEOUT_MS = 9000;
const MAX_HTML_BYTES = 1_500_000;

function textOf(el: { text?: string } | null | undefined): string {
  return (el?.text ?? "").replace(/\s+/g, " ").trim();
}

/** Fetch a URL (with timeout) and extract marketing-relevant signals + main text. */
export async function fetchAndExtract(
  rawUrl: string
): Promise<{ signals: PageSignals; text: string }> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("bad protocol");
    }
  } catch {
    throw new AuditError("invalid_url", "Please enter a valid http(s) URL.", 422);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const startedAt = Date.now();

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WABEL-Audit/1.0; +https://wabel.sa)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new AuditError("timeout", "The site took too long to respond.", 504);
    }
    throw new AuditError(
      "fetch_failed",
      "We couldn't reach that website. Check the URL and try again.",
      502
    );
  }
  const responseMs = Date.now() - startedAt;
  clearTimeout(timer);

  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok || !contentType.includes("html")) {
    throw new AuditError(
      "not_html",
      "That URL didn't return a readable web page.",
      422
    );
  }

  const html = (await res.text()).slice(0, MAX_HTML_BYTES);
  const htmlBytes = Buffer.byteLength(html, "utf8");
  const root = parse(html);

  const getMeta = (selector: string) =>
    root.querySelector(selector)?.getAttribute("content")?.trim() || null;

  const h1 = root.querySelectorAll("h1").map(textOf).filter(Boolean).slice(0, 5);
  const h2 = root.querySelectorAll("h2").map(textOf).filter(Boolean).slice(0, 12);
  const h3 = root.querySelectorAll("h3").map(textOf).filter(Boolean);

  const images = root.querySelectorAll("img");
  const imagesMissingAlt = images.filter(
    (img) => !(img.getAttribute("alt") ?? "").trim()
  ).length;

  // Strip non-content nodes before reading the visible text.
  root
    .querySelectorAll("script, style, noscript, svg, template")
    .forEach((n) => n.remove());
  const bodyText = (root.querySelector("body") ?? root).text
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  const signals: PageSignals = {
    finalUrl: res.url || url.toString(),
    title: textOf(root.querySelector("title")) || null,
    description: getMeta('meta[name="description"]'),
    ogTitle: getMeta('meta[property="og:title"]'),
    ogDescription: getMeta('meta[property="og:description"]'),
    ogImage: getMeta('meta[property="og:image"]'),
    lang: root.querySelector("html")?.getAttribute("lang")?.trim() || null,
    h1,
    h2,
    headingCount: h1.length + h2.length + h3.length,
    wordCount,
    imageCount: images.length,
    imagesMissingAlt,
    linkCount: root.querySelectorAll("a").length,
    hasViewport: !!root.querySelector('meta[name="viewport"]'),
    isHttps: url.protocol === "https:",
    htmlBytes,
    responseMs,
  };

  return { signals, text: bodyText.slice(0, 4000) };
}

const SYSTEM_PROMPT = `You are a senior marketing strategist at WABEL, a Saudi AI-powered marketing agency. You audit a website's marketing effectiveness for a prospective client.

You will receive structured signals extracted from a single web page plus a sample of its visible text. Produce a sharp, premium, specific audit — the kind a paying client would expect.

Rules:
- Score each dimension from 0 to 100 (integers). Be honest and discriminating; do not give everything 70-80.
- Reference the ACTUAL content you were given (titles, headings, copy). Never invent pages or features you cannot see.
- Judge four dimensions:
  - seo: title/meta quality, heading structure, discoverability, semantic signals.
  - brandClarity: is it instantly clear who this is, what they offer, and for whom?
  - cta: are there clear, compelling calls to action driving a next step?
  - mobile: viewport, responsive signals, performance proxies (HTML weight, response time, image hygiene).
- "strengths": exactly 3 concise, genuine positives.
- "recommendations": exactly 5, each specific and actionable (not generic advice), ordered most-impactful first, each with an impact of "high", "medium", or "low".
- overallScore is a holistic integer 0-100, not necessarily the mean.
- "headline" is a punchy one-line verdict. "summary" is 2-3 sentences.
- Write ALL natural-language fields in the requested language. If the language is Arabic, write fluent, professional Saudi-market Arabic (not literal translation).
- Respond ONLY with the structured object.`;

const CATEGORY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["score", "analysis"],
  properties: {
    score: { type: "integer" },
    analysis: { type: "string" },
  },
} as const;

const AUDIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "headline",
    "summary",
    "seo",
    "brandClarity",
    "cta",
    "mobile",
    "strengths",
    "recommendations",
  ],
  properties: {
    overallScore: { type: "integer" },
    headline: { type: "string" },
    summary: { type: "string" },
    seo: CATEGORY_SCHEMA,
    brandClarity: CATEGORY_SCHEMA,
    cta: CATEGORY_SCHEMA,
    mobile: CATEGORY_SCHEMA,
    strengths: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "detail", "impact"],
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          impact: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
} as const;

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function buildUserPrompt(
  signals: PageSignals,
  text: string,
  locale: Locale
): string {
  const language = locale === "ar" ? "Arabic (العربية)" : "English";
  return [
    `Target language for all output: ${language}.`,
    "",
    "PAGE SIGNALS (JSON):",
    JSON.stringify(signals, null, 2),
    "",
    "VISIBLE TEXT SAMPLE:",
    text || "(no readable text found)",
  ].join("\n");
}

/** Run the AI audit for already-extracted page signals. */
export async function runAudit(
  signals: PageSignals,
  text: string,
  locale: Locale
): Promise<AuditResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AuditError(
      "no_api_key",
      "The audit service is not configured (missing ANTHROPIC_API_KEY).",
      503
    );
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
  const client = new Anthropic({ apiKey });

  let message: Anthropic.Message;
  try {
    message = (await client.messages.create({
      model,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        { role: "user", content: buildUserPrompt(signals, text, locale) },
      ],
      // Structured outputs (GA on opus-4-7 / sonnet-4-6 / haiku-4-5).
      output_config: { format: { type: "json_schema", schema: AUDIT_SCHEMA } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)) as Anthropic.Message;
  } catch (err) {
    console.error("[audit] Claude request failed:", err);
    throw new AuditError(
      "ai_failed",
      "The AI analysis failed. Please try again shortly.",
      502
    );
  }

  if (message.stop_reason === "refusal") {
    throw new AuditError("ai_failed", "The analysis could not be completed.", 502);
  }

  const textBlock = message.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) {
    throw new AuditError("ai_failed", "The AI returned no analysis.", 502);
  }

  let parsed: AuditResult;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    throw new AuditError("ai_failed", "The AI returned malformed output.", 502);
  }

  return {
    url: signals.finalUrl,
    fetchedAt: new Date().toISOString(),
    locale,
    overallScore: clampScore(parsed.overallScore),
    headline: String(parsed.headline ?? ""),
    summary: String(parsed.summary ?? ""),
    seo: { score: clampScore(parsed.seo?.score), analysis: String(parsed.seo?.analysis ?? "") },
    brandClarity: {
      score: clampScore(parsed.brandClarity?.score),
      analysis: String(parsed.brandClarity?.analysis ?? ""),
    },
    cta: { score: clampScore(parsed.cta?.score), analysis: String(parsed.cta?.analysis ?? "") },
    mobile: {
      score: clampScore(parsed.mobile?.score),
      analysis: String(parsed.mobile?.analysis ?? ""),
    },
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.slice(0, 4).map(String)
      : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.slice(0, 6).map((r) => ({
          title: String(r.title ?? ""),
          detail: String(r.detail ?? ""),
          impact: (["high", "medium", "low"].includes(r.impact)
            ? r.impact
            : "medium") as Impact,
        }))
      : [],
    signals,
  };
}

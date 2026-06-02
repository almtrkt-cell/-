import { NextRequest, NextResponse } from "next/server";
import { fetchAndExtract, runAudit, AuditError } from "@/lib/audit";
import { appendLead } from "@/lib/leads";
import { isValidEmail } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const maxDuration = 60;

const DAILY_LIMIT = 3;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Invalid request." },
      { status: 400 }
    );
  }

  const url = String(body.url ?? "").trim();
  const email = String(body.email ?? "").trim();
  const locale: Locale = isLocale(body.locale as string)
    ? (body.locale as Locale)
    : "ar";

  if (!url) {
    return NextResponse.json(
      { error: "invalid_url", message: "A website URL is required." },
      { status: 422 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "A valid email is required." },
      { status: 422 }
    );
  }

  const ip = clientIp(req);
  const rate = checkRateLimit(`audit:${ip}`, DAILY_LIMIT);
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You've reached the limit of ${DAILY_LIMIT} audits per day. Please try again tomorrow.`,
      },
      { status: 429 }
    );
  }

  try {
    const { signals, text } = await fetchAndExtract(url);
    const audit = await runAudit(signals, text, locale);

    // Capture the lead (best-effort; never blocks the response).
    await appendLead({
      type: "audit",
      email,
      url: audit.url,
      ip,
      createdAt: audit.fetchedAt,
    });

    return NextResponse.json({ ok: true, audit, remaining: rate.remaining });
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: err.status }
      );
    }
    console.error("[audit] unexpected error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

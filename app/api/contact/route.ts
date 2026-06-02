import { NextRequest, NextResponse } from "next/server";
import { appendLead } from "@/lib/leads";
import { isValidEmail, isValidSaudiMobile, normalizePhone } from "@/lib/validation";

export const runtime = "nodejs";

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
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = normalizePhone(String(body.phone ?? ""));
  const company = String(body.company ?? "").trim();
  const service = String(body.service ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (
    name.length < 2 ||
    !isValidEmail(email) ||
    !isValidSaudiMobile(phone) ||
    message.length < 3
  ) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  await appendLead({
    type: "contact",
    name,
    email,
    phone,
    company: company || undefined,
    service: service || undefined,
    message,
    ip: clientIp(req),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

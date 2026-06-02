import { promises as fs } from "fs";
import path from "path";
import os from "os";

export interface Lead {
  type: "contact" | "audit";
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  url?: string;
  ip?: string;
  createdAt: string;
}

/**
 * Resolve a writable path for the leads file. Serverless platforms (Vercel)
 * only allow writes under the OS temp dir; locally we keep a gitignored .data.
 * NOTE: this is intentionally simple file persistence — swap for a DB or an
 * email/CRM integration before relying on it in production.
 */
function leadsFilePath(): string {
  if (process.env.LEADS_FILE) return process.env.LEADS_FILE;
  const base = process.env.VERCEL
    ? os.tmpdir()
    : path.join(process.cwd(), ".data");
  return path.join(base, "leads.json");
}

export async function appendLead(lead: Lead): Promise<boolean> {
  try {
    const file = leadsFilePath();
    await fs.mkdir(path.dirname(file), { recursive: true });

    let existing: Lead[] = [];
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }

    existing.push(lead);
    await fs.writeFile(file, JSON.stringify(existing, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[leads] failed to persist lead:", err);
    return false;
  }
}

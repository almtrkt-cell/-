// Shared, framework-agnostic validators used by both the client form and the API.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepts +9665XXXXXXXX, 9665XXXXXXXX, 05XXXXXXXX, or 5XXXXXXXX. */
export const SAUDI_MOBILE_RE = /^(?:\+?966|0)?5\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isValidSaudiMobile(value: string): boolean {
  return SAUDI_MOBILE_RE.test(normalizePhone(value));
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Canonical site URL — override per-environment with NEXT_PUBLIC_SITE_URL.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wabel.sa"
).replace(/\/$/, "");

// Public social profiles (also used for Organization JSON-LD sameAs).
export const socialLinks = [
  "https://x.com/wabel",
  "https://instagram.com/wabel",
  "https://linkedin.com/company/wabel",
  "https://tiktok.com/@wabel",
];

// Resolve the canonical site URL for SEO (sitemap, robots, canonical tags, OG).
//
// Priority:
//   1. NEXT_PUBLIC_SITE_URL      — explicit override (set this to your real domain once you own it)
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain (e.g. wabel.vercel.app)
//   3. VERCEL_URL                — per-deployment URL (preview builds)
//   4. http://localhost:3000     — local dev
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod.replace(/\/+$/, "")}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

// Public social profiles (also used for Organization JSON-LD sameAs).
export const socialLinks = [
  "https://x.com/wabel",
  "https://instagram.com/wabel",
  "https://linkedin.com/company/wabel",
  "https://tiktok.com/@wabel",
];

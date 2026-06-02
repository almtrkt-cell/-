# WABEL — وابل

A bilingual (Arabic RTL + English LTR), AI-powered marketing agency website for the Saudi market.

**Tagline:** وابلٌ من النتائج. لا مجرد إعلانات. — _A Flood of Results. Not Just Ads._

Built with **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS v3**, **shadcn/ui**, **lucide-react**, and **framer-motion**. The lead-magnet **AI Marketing Audit** runs on the **Claude API**.

---

## Features

- 🌐 **Bilingual & RTL-first** — route-based locales (`/ar`, `/en`) with Arabic as default, middleware negotiation, and a persistent language toggle.
- 🎨 **WABEL design system** — brand tokens (Carbon, Splash, Cream, Sand, Steel), bilingual font stacks, and a custom logo (full / mark / wordmark, light + dark).
- 🧱 **Full landing page** — hero, stats, 7 services, AI + Human methodology, 5-step process, 3-tier pricing, audit CTA, accessible contact form, footer.
- 🤖 **AI Marketing Audit** (`/audit`) — fetches a visitor's site, extracts signals, and uses Claude (structured outputs) to score SEO, brand clarity, CTAs, and mobile, plus 5 prioritized fixes — in the visitor's language.
- ♿ **Accessibility & performance** — semantic HTML, `:focus-visible`, `prefers-reduced-motion`, skip link, `Intl` formatting, self-hosted fonts.
- 🔍 **SEO** — sitemap, robots, bilingual metadata + hreflang, Organization/WebSite JSON-LD, and dynamic OG images.

---

## Getting started

### Prerequisites

- **Node.js 18.17+** (Node 20 or 22 LTS recommended) and npm.

### Install & run

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000  (redirects to /ar)
```

| Script          | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |

### Environment variables

Copy `.env.example` → `.env.local` and set:

| Variable               | Required     | Purpose                                                                                   |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`    | for `/audit` | Claude API key — get one at console.anthropic.com.                                         |
| `ANTHROPIC_MODEL`      | optional     | Audit model. Default `claude-opus-4-7`; use `claude-haiku-4-5` for a cheaper lead magnet. |
| `NEXT_PUBLIC_SITE_URL` | optional     | Canonical URL for SEO/OG. Default `https://wabel.sa`.                                      |

> The audit works without a key for everything except the AI call — without `ANTHROPIC_API_KEY` the endpoint returns a clear "not configured" error.

---

## Project structure

```
app/
  [lang]/                 # locale segment (ar | en) — root layout lives here
    layout.tsx            # <html lang dir>, fonts, metadata, JSON-LD
    page.tsx              # landing page
    audit/                # AI audit form + results
    opengraph-image.tsx   # dynamic OG image per locale
  api/
    audit/route.ts        # AI audit endpoint (fetch -> extract -> Claude)
    contact/route.ts      # contact form endpoint
  sitemap.ts  robots.ts   # SEO routes
components/
  Logo.tsx  LanguageToggle.tsx  Reveal.tsx  SectionHeading.tsx
  sections/               # Header, Hero, Services, Pricing, Contact, Footer, ...
  audit/                  # AuditForm, AuditResults
  ui/                     # shadcn/ui primitives
content/{ar,en}/          # all copy — real bilingual content
lib/                      # i18n, dictionaries, audit, leads, validation, site
middleware.ts             # locale redirect / negotiation
```

All user-facing copy lives in `content/ar/common.json` and `content/en/common.json` — keep both in sync (they share one TypeScript shape).

---

## Notes & TODO

- **Leads** are appended to a JSON file (`lib/leads.ts`) — fine for local/dev, but ephemeral on serverless. Swap for a DB (Vercel KV/Postgres) or a CRM/email integration before relying on it.
- **Rate limiting** (`lib/rate-limit.ts`) is in-memory (3 audits/IP/day) — replace with Upstash/Redis for multi-instance correctness.
- **Emailing the audit PDF** is intentionally left as a future integration.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Vercel walkthrough (GitHub, `wabel.sa` domain, env vars, Analytics).

---

Designed and built in Saudi Arabia. 🇸🇦

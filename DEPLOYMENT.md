# Deploying WABEL to Vercel

This walks you through shipping WABEL to production on [Vercel](https://vercel.com) with the `wabel.sa` domain.

> Prereqs: a GitHub account, a Vercel account (free Hobby tier is fine to start), your `ANTHROPIC_API_KEY`, and access to your `wabel.sa` DNS (your domain registrar).

---

## 1. Push the repo to GitHub

From the project folder:

```bash
# create a repo on github.com first (e.g. github.com/<you>/wabel), then:
git remote add origin https://github.com/<you>/wabel.git
git branch -M main
git push -u origin main
```

> Already initialized with commits per phase — you just need the remote + push.
> `gh` users: `gh repo create wabel --private --source . --push`.

---

## 2. Import the project into Vercel

1. Go to **vercel.com → Add New… → Project**.
2. **Import** your `wabel` GitHub repo (authorize Vercel for the repo if prompted).
3. Vercel auto-detects **Next.js** — keep the defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (default)
   - Output: `.next` (default)
   - Install Command: `npm install` (default)
4. **Don't deploy yet** — add environment variables first (next step), or deploy and add them right after, then redeploy.

---

## 3. Configure environment variables

In **Project → Settings → Environment Variables**, add (for **Production**, **Preview**, and **Development** as needed):

| Name                   | Value                                  | Notes                                  |
| ---------------------- | -------------------------------------- | -------------------------------------- |
| `ANTHROPIC_API_KEY`    | `sk-ant-...`                           | Required for `/audit`. Keep it secret. |
| `NEXT_PUBLIC_SITE_URL` | `https://wabel.sa`                     | Your canonical URL.                    |
| `ANTHROPIC_MODEL`      | `claude-opus-4-7` (or `claude-haiku-4-5`) | Optional. Lower-cost option for the lead magnet. |

After adding/altering env vars, **redeploy** (Deployments → ⋯ → Redeploy) so they take effect.

---

## 4. Add the custom domain `wabel.sa`

1. **Project → Settings → Domains → Add** → enter `wabel.sa`. Add `www.wabel.sa` too (Vercel will offer to redirect it to the apex).
2. Vercel shows the DNS records to set. At your **domain registrar / DNS provider**, add:

   | Type    | Name  | Value                   |
   | ------- | ----- | ----------------------- |
   | `A`     | `@`   | `76.76.21.21`           |
   | `CNAME` | `www` | `cname.vercel-dns.com.` |

   > Use the exact values Vercel displays — they can differ. If your DNS supports `ALIAS`/`ANAME` at the apex, Vercel may suggest that instead of the `A` record.
3. Wait for DNS to propagate (minutes to a couple of hours). Vercel auto-provisions a **free SSL certificate**.
4. Set `wabel.sa` as the **Primary Domain** so `www` redirects to it.

---

## 5. Enable Vercel Analytics & Speed Insights

The code is already wired (`@vercel/analytics` + `@vercel/speed-insights` render in the root layout). To turn the dashboards on:

1. **Project → Analytics** → **Enable Web Analytics**.
2. **Project → Speed Insights** → **Enable**.
3. Redeploy if prompted. Data appears after real visits (these components are no-ops in local dev).

---

## 6. Verify production

After the deploy goes green, check:

- [ ] `https://wabel.sa` loads and redirects to `/ar` (Arabic, RTL).
- [ ] Language toggle switches to `/en` (English, LTR) and persists on reload.
- [ ] `https://wabel.sa/sitemap.xml` and `/robots.txt` render.
- [ ] `https://wabel.sa/ar/opengraph-image` returns the OG image (and link previews look right when sharing).
- [ ] `/audit` runs end-to-end (needs `ANTHROPIC_API_KEY`).
- [ ] The contact form submits without error.

---

## Ongoing

- Every push to `main` triggers a **Production** deploy; PRs get **Preview** deploys automatically.
- Update copy in `content/{ar,en}/common.json` and push — no redeploy config needed.
- Before relying on leads/rate-limiting at scale, wire a database/CRM (see README → Notes & TODO).

# كيرف سبا — دليل الهوية v2 (Curve Spa — Brand Identity Guide v2)

Self-contained brand book page extracted from the Claude artifact:
https://claude.ai/code/artifact/806d2a5b-23ef-45e4-b575-9087a5baf60c

## Contents

- `index.html` — the brand guide source (Arabic, RTL). Open directly in a browser
  or serve the folder with any static server (`python3 -m http.server`).
- `assets/` — all referenced resources, unpacked from the published bundle:
  - `img-*.png` / `img-*.jpg` — brand imagery and logo renders
  - `font-*.woff2` — Almarai and other embedded webfont subsets
  - `app-01.js` — the artifact rendering runtime
  - `react*.min.js` — React 18.3.1 UMD builds (referenced via the
    `window.__resources` map in `index.html`, so no CDN access is needed)

The page works fully offline; no external network requests are required.

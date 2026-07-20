const { chromium } = require('playwright-core');
const PAGEW = 1280, PAGEH = 720, PADV = 48, PADH = 70;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: PAGEW, height: PAGEH } });
  await page.goto('http://localhost:8735/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const info = await page.evaluate(({ PAGEW, PAGEH, PADV, PADH }) => {
    const availH = PAGEH - PADV * 2;
    for (const st of document.querySelectorAll('style')) {
      if (st.textContent.includes('pdf slides')) st.remove();
    }
    const extra = document.createElement('style');
    extra.textContent = `
      *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
      html{background:linear-gradient(rgba(16,27,35,.92),rgba(16,27,35,.95)),url("assets/img-02.jpg") center/cover no-repeat #101B23!important}
      .steam-wisp,.steam-glow{display:none!important}
      @page{margin:0}`;
    document.head.appendChild(extra);

    const sections = [...document.querySelectorAll('[data-screen-label]')];
    const contentWrap = sections[0].parentElement;
    const cover = sections[0];

    const H = new Map();   // measured height incl. margins, taken before any move
    const isHeadingEl = (el) =>
      /^H[1-3]$/.test(el.tagName) ||
      (el.firstElementChild && /^H[1-3]$/.test(el.firstElementChild.tagName)) ||
      !!el.querySelector(':scope > h1, :scope > h2, :scope > h3');

    const plan = [];
    for (const sec of sections.slice(1)) {
      const kids = [];
      for (const k of [...sec.children]) {
        const cs = getComputedStyle(k);
        if (cs.position === 'absolute' || cs.position === 'fixed') continue;
        const r = k.getBoundingClientRect();
        const kh = r.height + parseFloat(cs.marginTop || 0) + parseFloat(cs.marginBottom || 0);
        if (kh < 3 && !k.textContent.trim() && !k.querySelector('img,svg')) { k.remove(); continue; }
        H.set(k, kh); kids.push(k);
      }
      // greedy pack, but never leave a heading cluster stranded at a slide's end
      const groups = [];
      let group = [], h = 0;
      const clusterStart = () => {
        for (let i = group.length - 1; i >= 0; i--) {
          const el = group[i];
          if (isHeadingEl(el)) {
            let s = i;
            while (s > 0 && H.get(group[s - 1]) < 70 && group[s - 1].textContent.trim().length < 120) s--;
            for (let j = i + 1; j < group.length; j++) if (H.get(group[j]) > 220) return -1;
            return s > 0 ? s : -1;
          }
          if (H.get(el) > 220) return -1;
        }
        return -1;
      };
      for (const k of kids) {
        const kh = H.get(k);
        if (h > 0 && h + kh > availH) {
          let carry = [];
          const cs = clusterStart();
          if (cs > 0) carry = group.splice(cs);
          if (group.length) groups.push(group);
          group = carry; h = carry.reduce((a, c) => a + H.get(c), 0);
        }
        group.push(k); h += kh;
      }
      if (group.length) groups.push(group);
      // a heading stranded as its own slide joins the content slide after it
      const sum = (g) => g.reduce((a, c) => a + H.get(c), 0);
      for (let i = 0; i < groups.length - 1; i++) {
        const g = groups[i];
        if (g.some(isHeadingEl) && sum(g) < 230 && sum(g) + sum(groups[i + 1]) <= availH * 1.5) {
          groups[i + 1].unshift(...g);
          groups.splice(i, 1); i--;
        }
      }
      // fold tiny leftover groups (a stray caption) into the previous slide
      const merged = [];
      for (const g of groups) {
        const gh = g.reduce((a, c) => a + H.get(c), 0);
        if (merged.length) {
          const prev = merged[merged.length - 1];
          const ph = prev.reduce((a, c) => a + H.get(c), 0);
          if (gh < 160 && ph + gh <= availH * 1.18) { prev.push(...g); continue; }
        }
        merged.push(g);
      }
      plan.push({ groups: merged });
    }

    const deck = document.createElement('div');
    const coverSlide = document.createElement('div');
    coverSlide.style.cssText = `width:${PAGEW}px;height:${PAGEH}px;overflow:hidden;break-after:page;position:relative`;
    cover.style.minHeight = '0'; cover.style.height = '100%';
    cover.style.paddingTop = '40px'; cover.style.paddingBottom = '40px';
    coverSlide.appendChild(cover);
    deck.appendChild(coverSlide);

    for (const { groups } of plan) {
      for (const g of groups) {
        const slide = document.createElement('div');
        slide.style.cssText = `width:${PAGEW}px;height:${PAGEH}px;padding:${PADV}px ${PADH}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;overflow:hidden;break-after:page;position:relative`;
        const inner = document.createElement('div');
        inner.style.cssText = 'width:100%;flex:none';
        for (const k of g) inner.appendChild(k);
        slide.appendChild(inner);
        deck.appendChild(slide);
      }
    }
    // closing slide from the document footer
    const footer = contentWrap.querySelector('footer');
    if (footer) {
      const slide = document.createElement('div');
      slide.style.cssText = `width:${PAGEW}px;height:${PAGEH}px;padding:${PADV}px ${PADH}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;overflow:hidden;break-after:page;position:relative`;
      slide.appendChild(footer);
      deck.appendChild(slide);
    }
    deck.lastElementChild.style.breakAfter = 'auto';
    contentWrap.replaceChildren(deck);

    // balance 4-item auto-fit grids into 2x2
    let balanced = 0;
    for (const grid of deck.querySelectorAll('[style*="auto-fit"]')) {
      const n = grid.children.length;
      if (n === 4) { grid.style.gridTemplateColumns = 'repeat(2,1fr)'; balanced++; }
      else if (n === 5) {
        grid.style.gridTemplateColumns = 'repeat(2,1fr)';
        grid.lastElementChild.style.gridColumn = '1 / -1';
        balanced++;
      }
    }

    let scaled = 0;
    for (const slide of deck.children) {
      if (slide === deck.firstElementChild) continue;
      const inner = slide.firstElementChild;
      const ih = inner.getBoundingClientRect().height;
      if (ih > availH) {
        const sc = Math.max(0.55, availH / ih);
        inner.style.transform = `scale(${sc})`;
        inner.style.transformOrigin = 'center center';
        scaled++;
      }
    }
    return { slides: deck.children.length, scaled, balanced };
  }, { PAGEW, PAGEH, PADV, PADH });

  console.log('slides:', info.slides, '| scaled:', info.scaled, '| grids balanced:', info.balanced);
  await page.waitForTimeout(800);
  await page.pdf({ path: 'Curve-Spa-Brand-Book-v2.pdf', width: '13.33in', height: '7.5in',
    printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await browser.close();
  console.log('pdf done');
})().catch(e => { console.error(e); process.exit(1); });

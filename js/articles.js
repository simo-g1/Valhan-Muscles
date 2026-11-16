(() => {
  'use strict';
  const A = window.ValhanArticles;
  const t = window.ValhanT;
  const page = document.body.dataset.page;
  const root = document.body.dataset.root || '.';
  if (!A || !t || (page !== 'academy' && page !== 'article')) return;

  const L = p => t(p[0], p[1]);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rtl = () => document.documentElement.dir === 'rtl';
  const cat = id => A.cats.find(c => c.id === id) || A.cats[0];
  const href = slug => `${root}/pages/article.html?a=${encodeURIComponent(slug)}`;
  const mins = n => `${n} ${t('دقائق قراءة', 'min read')}`;

  /* ---------- Inline SVG diagrams (theme aware via CSS variables) ---------- */
  const svg = (h, label, body) =>
    `<svg class="dg" viewBox="0 0 460 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" direction="ltr">${body}</svg>`;

  // Row of steps that follows the reading direction (right-to-left in Arabic).
  const flow = (labels, y, cls = '') => {
    const n = labels.length, w = 460 / n, order = rtl() ? [...labels].reverse() : labels;
    return order.map((s, i) => {
      const x = i * w + 4;
      const arrow = rtl()
        ? (i > 0 ? `<path class="ln" d="M${x - 2} ${y + 22} l-6 0" marker-end="url(#ar)"/>` : '')
        : (i < n - 1 ? `<path class="ln" d="M${x + w - 8} ${y + 22} l6 0" marker-end="url(#ar)"/>` : '');
      return `<rect class="b ${cls}" x="${x}" y="${y}" width="${w - 14}" height="44" rx="10"/>` +
        `<text x="${x + (w - 14) / 2}" y="${y + 27}" text-anchor="middle">${esc(s)}</text>` + arrow;
    }).join('');
  };
  const defs = '<defs><marker id="ar" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8z" class="a"/></marker></defs>';

  const D = {
    balance() {
      const cols = [[t('فائض', 'Surplus'), 110, 80], [t('تعادل', 'Maintenance'), 90, 90], [t('عجز', 'Deficit'), 70, 110]];
      const bars = cols.map((c, i) => {
        const x = 30 + i * 145;
        return `<rect class="a" x="${x}" y="${180 - c[1]}" width="38" height="${c[1]}" rx="4"/>` +
          `<rect class="b" x="${x + 46}" y="${180 - c[2]}" width="38" height="${c[2]}" rx="4"/>` +
          `<text x="${x + 42}" y="205" text-anchor="middle">${esc(c[0])}</text>`;
      }).join('');
      const key = `<rect class="a" x="30" y="10" width="14" height="14" rx="3"/><text x="50" y="22">${t('الداخل', 'In')}</text>` +
        `<rect class="b" x="130" y="10" width="14" height="14" rx="3"/><text x="150" y="22">${t('المصروف', 'Out')}</text>`;
      return svg(220, t('ثلاث حالات لميزان الطاقة', 'Three energy balance states'), key + bars);
    },
    tdee() {
      const seg = [['BMR', 65, 1], ['TEF', 10, .7], ['NEAT', 15, .45], ['EAT', 10, .25]];
      let x = 20;
      const bars = seg.map(s => { const w = 420 * s[1] / 100, r = `<rect class="a" style="fill-opacity:${s[2]}" x="${x}" y="20" width="${w}" height="46"/>`; x += w; return r; }).join('');
      const legend = seg.map((s, i) => `<rect class="a" style="fill-opacity:${s[2]}" x="${20 + (i % 2) * 220}" y="${92 + Math.floor(i / 2) * 30}" width="14" height="14" rx="3"/>` +
        `<text x="${42 + (i % 2) * 220}" y="${104 + Math.floor(i / 2) * 30}">${s[0]} ~${s[1]}%</text>`).join('');
      return svg(160, t('تقسيم الإنفاق اليومي للطاقة', 'Breakdown of daily energy expenditure'), bars + legend);
    },
    macros() {
      const rows = [[t('بروتين', 'Protein'), 4], [t('كربوهيدرات', 'Carbs'), 4], [t('دهون', 'Fat'), 9]];
      return svg(150, t('الطاقة لكل جرام', 'Energy per gram'), rows.map((r, i) =>
        `<text x="8" y="${34 + i * 44}">${esc(r[0])}</text>` +
        `<rect class="a" x="110" y="${16 + i * 44}" width="${r[1] * 38}" height="28" rx="6"/>` +
        `<text x="${118 + r[1] * 38}" y="${36 + i * 44}">${r[1]} kcal/g</text>`).join(''));
    },
    overload() {
      const h = [40, 52, 52, 68, 80, 96];
      return svg(170, t('تقدم تدريجي', 'Gradual progression'), h.map((v, i) =>
        `<rect class="a" style="fill-opacity:${.35 + i * .13}" x="${20 + i * 72}" y="${140 - v}" width="54" height="${v}" rx="5"/>` +
        `<text class="m" x="${47 + i * 72}" y="162" text-anchor="middle">${t('أ', 'W')}${i + 1}</text>`).join(''));
    },
    week() {
      const days = [['Upper A', 0], ['Lower A', 0], [t('راحة', 'Rest'), 1], ['Upper B', 0], ['Lower B', 0], [t('راحة', 'Rest'), 1], [t('راحة', 'Rest'), 1]];
      const w = 460 / 7, pos = i => rtl() ? 6 - i : i;
      return svg(100, t('أسبوع تدريب', 'Training week'), days.map((d, i) =>
        `<rect class="${d[1] ? 'b' : 'a'}" x="${pos(i) * w + 2}" y="20" width="${w - 6}" height="56" rx="8"/>` +
        `<text class="${d[1] ? 'm' : ''}" style="${d[1] ? '' : 'fill:#fff'}" x="${pos(i) * w + w / 2 - 1}" y="53" text-anchor="middle" font-size="12">${esc(d[0])}</text>`).join(''));
    },
    recovery() {
      return svg(80, t('حلقة التعافي', 'Recovery loop'), defs +
        flow([t('تدريب', 'Train'), t('إجهاد', 'Fatigue'), t('تعافٍ', 'Recover'), t('تكيّف', 'Adapt')], 16));
    },
    volume() {
      return svg(210, t('منحنى الحجم', 'Volume curve'),
        '<path class="ln" fill="none" d="M40 170 C110 60 190 40 270 36 S400 30 440 28" stroke-width="3"/>' +
        '<path class="m ln" stroke-dasharray="4 4" d="M110 170V30M250 170V30M380 170V30"/>' +
        `<text class="m" x="40" y="192">${t('قليل', 'Too low')}</text><text class="m" x="168" y="192">${t('مثمر', 'Productive')}</text>` +
        `<text class="m" x="300" y="192">${t('عائد أقل', 'Diminishing')}</text>` +
        `<text x="8" y="14" font-size="12">${t('النمو', 'Growth')}</text>`);
    }
  };

  /* ---------- Cards ---------- */
  const art = (c, cls = '') => `<div class="art art-${c.id} ${cls}" aria-hidden="true"><i class="fa-solid ${c.icon}"></i></div>`;
  const card = a => {
    const c = cat(a.cat);
    return `<article class="card a-card reveal">
      ${art(c)}
      <div class="a-card-body">
        <span class="tag">${esc(L(c.n))}</span>
        <h3><a href="${href(a.slug)}">${esc(L(a.title))}</a></h3>
        <p>${esc(L(a.intro))}</p>
        <div class="a-meta"><span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${mins(a.min)}</span>
        <a class="a-more" href="${href(a.slug)}" aria-label="${esc(t('اقرأ المقال: ', 'Read article: ') + L(a.title))}">${t('اقرأ المقال', 'Read')} <i class="fa-solid ${rtl() ? 'fa-arrow-left' : 'fa-arrow-right'}" aria-hidden="true"></i></a></div>
      </div></article>`;
  };

  /* ---------- Academy: article center ---------- */
  function renderCenter() {
    const host = document.getElementById('article-center');
    if (!host) return;
    let active = 'all', q = '';
    host.innerHTML = `<section class="section" style="border-top:1px solid var(--line)"><div class="container">
      <div class="section-head"><span class="eyebrow">ARTICLE CENTER</span>
        <h2 class="section-title">${t('مركز المقالات', 'Article Center')}</h2>
        <p class="muted">${t('مقالات تعليمية متوازنة في التدريب والتغذية والاستشفاء وعلوم التمرين.', 'Balanced educational articles on training, nutrition, recovery and exercise science.')}</p></div>
      <div class="article-tools">
        <div class="chips" role="group" aria-label="${t('تصنيفات المقالات', 'Article categories')}">
          <button type="button" class="chip" data-cat="all" aria-pressed="true">${t('الكل', 'All')}</button>
          ${A.cats.map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="false">${esc(L(c.n))}</button>`).join('')}
        </div>
        <label class="field article-search">${t('بحث في المقالات', 'Search articles')}
          <input id="art-q" type="search" placeholder="${t('ابحث...', 'Search...')}"></label>
      </div>
      <div class="grid article-grid" id="art-grid" aria-live="polite"></div>
      <p class="empty" id="art-empty" hidden>${t('لا توجد مقالات مطابقة.', 'No matching articles.')}</p>
    </div></section>`;

    const grid = host.querySelector('#art-grid'), empty = host.querySelector('#art-empty');
    const draw = () => {
      const list = A.list.filter(a => (active === 'all' || a.cat === active) &&
        (L(a.title) + ' ' + L(a.intro)).toLowerCase().includes(q));
      grid.innerHTML = list.map(card).join('');
      empty.hidden = !!list.length;
      grid.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    };
    host.querySelector('.chips').addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      active = b.dataset.cat;
      host.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
      draw();
    });
    host.querySelector('#art-q').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  }

  /* ---------- Article page ---------- */
  function renderArticle() {
    const main = document.getElementById('main-content');
    const slug = new URLSearchParams(location.search).get('a');
    const a = A.list.find(x => x.slug === slug);
    const back = `<a class="nav-back-link" href="${root}/pages/academy.html"><i class="fa-solid ${rtl() ? 'fa-arrow-right' : 'fa-arrow-left'}" aria-hidden="true"></i><span>${t('العودة إلى الأكاديمية', 'Back to Academy')}</span></a>`;
    if (!a) {
      main.innerHTML = `<div class="container section"><div class="nav-back-bar">${back}</div><p class="empty">${t('المقال غير موجود.', 'Article not found.')}</p></div>`;
      return;
    }
    const c = cat(a.cat);
    document.title = `${L(a.title)} | VALHAN MUSCLES`;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = L(a.intro);

    const body = a.sections.map((s, i) => `
      <section id="s${i}">
        <h2>${esc(L(s.h))}</h2>
        ${(s.p || []).map(p => `<p>${esc(L(p))}</p>`).join('')}
        ${s.code ? `<pre class="code" dir="ltr"><code>${esc(s.code)}</code></pre>` : ''}
        ${s.ul ? `<ul>${s.ul.map(x => `<li>${esc(L(x))}</li>`).join('')}</ul>` : ''}
        ${s.fig ? `<figure class="fig">${D[s.fig]()}<figcaption>${esc(L(s.cap))}</figcaption></figure>` : ''}
        ${(s.post || []).map(p => `<p>${esc(L(p))}</p>`).join('')}
      </section>`).join('');

    const related = a.related.map(r => A.list.find(x => x.slug === r)).filter(Boolean);

    main.innerHTML = `
      <div class="container" style="padding-top:20px"><div class="nav-back-bar">${back}
        <a class="nav-back-link" href="${root}/index.html"><span>${t('الرئيسية', 'Home')}</span><i class="fa-solid fa-house" aria-hidden="true"></i></a></div></div>
      <header class="container article-head">
        ${art(c, 'art-hero')}
        <span class="eyebrow">${esc(L(c.n))}</span>
        <h1>${esc(L(a.title))}</h1>
        <p class="article-meta muted"><i class="fa-regular fa-clock" aria-hidden="true"></i> ${mins(a.min)}</p>
        <p class="article-intro">${esc(L(a.intro))}</p>
      </header>
      <div class="container article-layout">
        <nav aria-label="${t('محتويات المقال', 'Table of contents')}">
          <details class="toc" open><summary>${t('محتويات المقال', 'On this page')}</summary>
            <ol>${a.sections.map((s, i) => `<li><a href="#s${i}">${esc(L(s.h))}</a></li>`).join('')}</ol></details>
        </nav>
        <article class="prose">
          ${body}
          ${a.disc ? `<aside class="note" role="note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><p>${t('هذا المحتوى تعليمي عام وليس نصيحة طبية أو هدفًا شخصيًا للسعرات. استشر طبيبًا أو أخصائي تغذية عند وجود حالة صحية أو حمل أو تاريخ مع اضطرابات الأكل.', 'This content is general education, not medical advice or a personal calorie target. Consult a doctor or dietitian if you have a medical condition, are pregnant, or have a history of disordered eating.')}</p></aside>` : ''}
          ${a.cta ? `<p><a class="btn btn-primary" href="${root}/pages/${a.cta[0]}">${esc(t(a.cta[1], a.cta[2]))}</a></p>` : ''}
        </article>
      </div>
      <section class="section" style="border-top:1px solid var(--line)"><div class="container">
        <h2 class="section-title" style="font-size:2rem">${t('مقالات ذات صلة', 'Related articles')}</h2>
        <div class="grid article-grid">${related.map(card).join('')}</div>
      </div></section>`;

    main.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    const toc = main.querySelector('.toc');
    if (toc && matchMedia('(max-width:900px)').matches) toc.open = false;
  }

  document.addEventListener('DOMContentLoaded', () => (page === 'academy' ? renderCenter() : renderArticle()));
})();

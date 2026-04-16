#!/usr/bin/env node
// ─────────────────────────────────────────
// FORMALDEHYDE · generate.js
// Usage: node generate.js
// Reads data/specimens.json → writes index.html + case/*.html
// ─────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

const ROOT      = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'specimens.json');
const CASE_DIR  = path.join(ROOT, 'case');

const specimens = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// ── Helpers ──────────────────────────────

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Generate index.html ──────────────────

function gridItem(s) {
  const img = s.img1
    ? `<img src="img/gallery/${esc(s.img1)}" alt="No.${esc(s.id)}" loading="lazy">`
    : '';
  return `
    <a href="case/${s.id}.html" class="grid-item reveal">
      ${img}
      <div class="grid-overlay">
        <span class="grid-num">${esc(s.id)}</span>
        <p class="grid-title">${esc(s.title)}</p>
      </div>
    </a>`;
}

function buildIndex() {
  const count = specimens.length;
  const items = specimens.map(gridItem).join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FORMALDEHYDE — Specimen Archive</title>
  <meta name="description" content="手塚桃子の標本アーカイブ。鉛筆、水彩による作品群。">
  <meta property="og:title" content="FORMALDEHYDE — Specimen Archive">
  <meta property="og:description" content="手塚桃子の標本アーカイブ。鉛筆、水彩による作品群。">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://mog147.github.io/formaldehyde/img/gallery/${esc(specimens[0].img1)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="https://mog147.github.io/mysite/img/profile/profile_avatar.png">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>

  <header class="site-header">
    <a href="index.html" class="site-logo">F&thinsp;O&thinsp;R&thinsp;M&thinsp;A&thinsp;L&thinsp;D&thinsp;E&thinsp;H&thinsp;Y&thinsp;D&thinsp;E</a>
    <nav class="site-nav">
      <a href="index.html">Archive</a>
      <a href="about.html">About</a>
    </nav>
  </header>

  <main>
    <div class="page">
      <section class="index-hero reveal">
        <p class="index-hero-label">Specimen Archive · Momoko Tezuka</p>
        <h1 class="index-hero-title">Preserved in the fluid<br>of unfinished time.</h1>
        <p class="index-hero-sub">${count} specimens · pencil, watercolor · 2025</p>
      </section>
    </div>

    <section class="specimen-grid">
${items}
    </section>
  </main>

  <footer class="site-footer">
    <span class="footer-logo">Formaldehyde</span>
    <span class="footer-note">
      © Momoko Tezuka &nbsp;·&nbsp;
      <a href="https://mog147.github.io/mysite/" target="_blank" rel="noopener">396 FOLIO →</a>
    </span>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
`;
}

// ── Generate case/XXX.html ────────────────

function bodySection(heading, paras) {
  const ps = paras.map(p => `        <p>${p}</p>`).join('\n');
  return `
        <h2>${esc(heading)}</h2>
${ps}`;
}

function buildCase(s, prev, next) {
  const bodySections = Object.entries(s.body)
    .map(([h, ps]) => bodySection(h, ps))
    .join('\n');

  const prevLink = prev
    ? `<a href="${prev.id}.html" class="case-nav-link prev">
        <span class="nav-dir">← Prev</span>
        <span class="nav-title">${esc(prev.title)}</span>
      </a>`
    : `<span></span>`;

  const nextLink = next
    ? `<a href="${next.id}.html" class="case-nav-link next">
        <span class="nav-dir">Next →</span>
        <span class="nav-title">${esc(next.title)}</span>
      </a>`
    : `<span></span>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>No.${esc(s.id)} — ${esc(s.title)} | FORMALDEHYDE</title>
  <meta name="description" content="${esc(s.title)} — ${esc(s.medium)}による作品。">
  <meta property="og:title" content="No.${esc(s.id)} — ${esc(s.title)} | FORMALDEHYDE">
  <meta property="og:type" content="article">
  <meta property="og:image" content="https://mog147.github.io/formaldehyde/img/gallery/${esc(s.img1)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="https://mog147.github.io/mysite/img/profile/profile_avatar.png">
  <link rel="stylesheet" href="../css/main.css">
</head>
<body>

  <header class="site-header">
    <a href="../index.html" class="site-logo">F&thinsp;O&thinsp;R&thinsp;M&thinsp;A&thinsp;L&thinsp;D&thinsp;E&thinsp;H&thinsp;Y&thinsp;D&thinsp;E</a>
    <nav class="site-nav">
      <a href="../index.html">Archive</a>
      <a href="../about.html">About</a>
    </nav>
  </header>

  <main>
    <div class="page case-page">

      <a href="../index.html" class="case-back reveal">Back to Archive</a>

      <!-- Specimen Label -->
      <div class="specimen-label reveal">
        <div class="label-left">
          <p class="label-specimen-id">Specimen No.${esc(s.id)} · Formaldehyde Archive</p>
          <h1 class="label-title">${esc(s.title)}</h1>
        </div>
        <div class="label-right">
          <div class="label-meta-row"><span>Medium</span>${esc(s.medium)}</div>
          <div class="label-meta-row"><span>Year</span>${esc(s.year)}</div>
          <div class="label-meta-row"><span>Collector</span>Momoko Tezuka</div>
        </div>
      </div>

      <!-- Slider -->
      <div class="case-slider reveal">
        <div class="slider-track">
          <img src="../img/gallery/${esc(s.img1)}" alt="No.${esc(s.id)} — ${esc(s.title)}">
          <img src="../img/gallery/${esc(s.img2)}" alt="No.${esc(s.id)} — ${esc(s.title)} 制作過程">
        </div>
        <div class="slider-ui">
          <button class="slider-btn prev" aria-label="前へ">←</button>
          <span class="slider-count">1 / 2</span>
          <button class="slider-btn next" aria-label="次へ">→</button>
        </div>
      </div>

      <!-- Body -->
      <article class="case-body">
${bodySections}

      </article>

      <!-- Navigation -->
      <nav class="case-nav">
      ${prevLink}
      ${nextLink}
      </nav>

    </div>
  </main>

  <footer class="site-footer">
    <span class="footer-logo">Formaldehyde</span>
    <span class="footer-note">
      © Momoko Tezuka &nbsp;·&nbsp;
      <a href="https://mog147.github.io/mysite/" target="_blank" rel="noopener">396 FOLIO →</a>
    </span>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>
`;
}

// ── Run ──────────────────────────────────

// index.html
fs.writeFileSync(path.join(ROOT, 'index.html'), buildIndex());
console.log('✓ index.html');

// case/*.html
specimens.forEach((s, i) => {
  const prev = i > 0 ? specimens[i - 1] : null;
  const next = i < specimens.length - 1 ? specimens[i + 1] : null;
  const html = buildCase(s, prev, next);
  fs.writeFileSync(path.join(CASE_DIR, `${s.id}.html`), html);
  console.log(`✓ case/${s.id}.html`);
});

console.log(`\nDone — ${specimens.length} specimens generated.`);

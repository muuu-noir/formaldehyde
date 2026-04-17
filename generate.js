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

const BASE_URL = 'https://mog147.github.io/formaldehyde/';

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
  return `    <specimen-card 
      specimen-id="${esc(s.id)}" 
      title="${esc(s.title)}" 
      img="${esc(s.img1)}"
      class="reveal"
    ></specimen-card>`;
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
  <link rel="icon" href="https://mog147.github.io/img/profile/profile_avatar.png">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>

  <site-header></site-header>

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

  <site-footer></site-footer>


  <script type="module" src="js/main.js"></script>
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
  <link rel="icon" href="https://mog147.github.io/img/profile/profile_avatar.png">
  <link rel="stylesheet" href="../css/main.css">
</head>
<body>

  <site-header root-path=".."></site-header>

  <main>
    <div class="page case-page">

      <a href="../index.html" class="case-back reveal">Back to Archive</a>

      <specimen-label 
        specimen-id="${esc(s.id)}" 
        title="${esc(s.title)}" 
        medium="${esc(s.medium)}" 
        year="${esc(s.year)}"
      ></specimen-label>

      <case-slider 
        img1="${esc(s.img1)}" 
        img2="${esc(s.img2)}" 
        title="No.${esc(s.id)} — ${esc(s.title)}"
      ></case-slider>

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

  <site-footer></site-footer>


  <script type="module" src="../js/main.js"></script>
</body>
</html>
`;
}

// ── Generate sitemap.xml ───────────────

function buildSitemap() {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = [
    '',
    'about.html',
    ...specimens.map(s => `case/${s.id}.html`)
  ];

  const xmlUrls = urls.map(u => `
  <url>
    <loc>${BASE_URL}${u}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;
}

// ── Generate robots.txt ────────────────

function buildRobots() {
  return `User-agent: *
Allow: /
Sitemap: ${BASE_URL}sitemap.xml
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

// SEO files
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap());
console.log('✓ sitemap.xml');

fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobots());
console.log('✓ robots.txt');

console.log(`\nDone — ${specimens.length} specimens + SEO files generated.`);

#!/usr/bin/env node
// ─────────────────────────────────────────
// FORMALDEHYDE · generate.js
// Usage: node generate.js
// Reads data/specimens.json → writes archive.html + SEO files
// ─────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

const ROOT      = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'specimens.json');

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

// ── Generate archive.html ──────────────────

function gridItem(s) {
  return `    <specimen-card 
      specimen-id="${esc(s.id)}" 
      title="${esc(s.title)}" 
      img="${esc(s.img1)}"
      class="reveal"
    ></specimen-card>`;
}

function buildArchive() {
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
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-7X20Z1E5FF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7X20Z1E5FF');
  </script>
  <link rel="canonical" href="https://mog147.github.io/formaldehyde/">
  <link rel="icon" href="https://mog147.github.io/img/profile/profile_avatar.png">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>

  <site-header></site-header>

  <main>
    <div class="page">
      <section class="index-hero reveal">
        <p class="index-hero-label">Specimen Archive · Momoko Tezuka</p>
        <h1 class="index-hero-title">Time, preserved unfinished.</h1>
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

// ── Generate sitemap.xml ───────────────

function buildSitemap() {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = [
    '',
    'archive.html',
    'about.html',
    ...specimens.map(s => `specimen.html?id=${s.id}`)
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

// archive.html
fs.writeFileSync(path.join(ROOT, 'archive.html'), buildArchive());
console.log('✓ archive.html');

// SEO files
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap());
console.log('✓ sitemap.xml');

fs.writeFileSync(path.join(ROOT, 'robots.txt'), buildRobots());
console.log('✓ robots.txt');

console.log(`\nDone — ${specimens.length} specimens + SEO files generated.`);

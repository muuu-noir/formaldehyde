/* ─────────────────────────────────────────
   FORMALDEHYDE · main.js
   ───────────────────────────────────────── */

// Fade in from darkness on every page load
(function () {
  const veil = document.createElement('div');
  veil.style.cssText = 'position:fixed;inset:0;background:#070707;z-index:9001;pointer-events:none;transition:opacity 1s ease;';
  document.body.appendChild(veil);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    veil.style.opacity = '0';
    setTimeout(() => veil.remove(), 1100);
  }));
})();

import './components/site-header.js';
import './components/site-footer.js';
import './components/specimen-card.js';
import './components/specimen-label.js';
import './components/case-slider.js';

// Load more — mobile only
(function () {
  if (window.innerWidth > 640) return;
  const grid = document.querySelector('.specimen-grid');
  if (!grid) return;

  const total = grid.querySelectorAll('specimen-card').length;
  if (total <= 4) return;

  const btn = document.createElement('button');
  btn.className = 'load-more';
  btn.textContent = 'もっと見る  +' + (total - 4);
  grid.insertAdjacentElement('afterend', btn);

  btn.addEventListener('click', () => {
    grid.classList.add('expanded');
    grid.querySelectorAll('specimen-card').forEach(card => {
      card.classList.add('visible');
      const inner = card.querySelector('.reveal');
      if (inner) inner.classList.add('visible');
    });
    btn.remove();
  });
})();

// Reveal on scroll
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const inGrid = !!entry.target.closest('.specimen-grid');
          const delay = inGrid
            ? Math.random() * 1000
            : entry.target.closest('.catalog-entry') ? i * 40 : 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

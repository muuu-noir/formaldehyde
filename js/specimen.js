/* ─────────────────────────────────────────
   FORMALDEHYDE · specimen.js
   Dynamic rendering for detail pages
   ───────────────────────────────────────── */

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    showError();
    return;
  }

  try {
    const response = await fetch('./data/specimens.json');
    const specimens = await response.json();
    const specimen = specimens.find(s => s.id === id);

    if (!specimen) {
      showError();
      return;
    }

    renderSpecimen(specimen, specimens);
  } catch (err) {
    console.error('Failed to load specimen data:', err);
    showError();
  }
}

function renderSpecimen(s, all) {
  const content = document.getElementById('specimen-content');
  const labelContainer = document.getElementById('label-container');
  const sliderContainer = document.getElementById('slider-container');
  const body = document.getElementById('specimen-body');
  const nav = document.getElementById('specimen-nav');

  // Title
  document.title = `No.${s.id} — ${s.title} | FORMALDEHYDE`;

  // Label
  labelContainer.innerHTML = `
    <specimen-label 
      specimen-id="${s.id}" 
      title="${s.title}" 
      medium="${s.medium}" 
      year="${s.year}"
    ></specimen-label>
  `;

  // Slider
  sliderContainer.innerHTML = `
    <case-slider 
      img1="${s.img1}" 
      img2="${s.img2}" 
      title="No.${s.id} — ${s.title}"
      root-path="."
    ></case-slider>
  `;

  // Body Content
  let bodyHTML = '';
  for (const [heading, paragraphs] of Object.entries(s.body)) {
    bodyHTML += `<h2>${heading}</h2>`;
    paragraphs.forEach(p => {
      bodyHTML += `<p>${p}</p>`;
    });
  }
  body.innerHTML = bodyHTML;

  // Navigation
  const index = all.findIndex(item => item.id === s.id);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  const prevLink = prev 
    ? `<a href="specimen.html?id=${prev.id}" class="case-nav-link prev">
        <span class="nav-dir">← Prev</span>
        <span class="nav-title">${prev.title}</span>
      </a>`
    : '<span></span>';

  const nextLink = next 
    ? `<a href="specimen.html?id=${next.id}" class="case-nav-link next">
        <span class="nav-dir">Next →</span>
        <span class="nav-title">${next.title}</span>
      </a>`
    : '<span></span>';

  nav.innerHTML = `${prevLink}${nextLink}`;

  // Reveal
  content.style.opacity = '1';
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

function showError() {
  document.getElementById('specimen-content').style.display = 'none';
  document.getElementById('error-content').style.display = 'block';
}

init();

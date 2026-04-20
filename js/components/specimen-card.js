class SpecimenCard extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('specimen-id');
    const title = this.getAttribute('title');
    const img = this.getAttribute('img');
    const rootPath = this.getAttribute('root-path') || '.';

    this.innerHTML = `
      <a href="${rootPath}/specimen.html?id=${id}" class="grid-item reveal">
        <img src="${rootPath}/img/gallery/${img}" alt="No.${id}" loading="lazy">
        <span class="grid-badge">${id}</span>
        <div class="grid-overlay">
          <span class="grid-num">${id}</span>
          <p class="grid-title">${title}</p>
        </div>
      </a>
    `;
  }
}

customElements.define('specimen-card', SpecimenCard);

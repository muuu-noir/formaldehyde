class SpecimenLabel extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('specimen-id');
    const title = this.getAttribute('title');
    const medium = this.getAttribute('medium');
    const year = this.getAttribute('year');
    const collector = this.getAttribute('collector') || 'μ';

    this.innerHTML = `
      <div class="specimen-label reveal">
        <div class="label-left">
          <p class="label-specimen-id">Specimen No.${id} · Formaldehyde Archive</p>
          <h1 class="label-title">${title}</h1>
        </div>
        <div class="label-right">
          <div class="label-meta-row"><span>Medium</span>${medium}</div>
          <div class="label-meta-row"><span>Year</span>${year}</div>
          <div class="label-meta-row"><span>Collector</span><span style="text-transform:none">${collector}</span></div>
        </div>
      </div>
    `;
  }
}

customElements.define('specimen-label', SpecimenLabel);

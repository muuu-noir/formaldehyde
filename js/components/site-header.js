class SiteHeader extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '.';
    this.innerHTML = `
      <header class="site-header">
        <a href="${rootPath}/room.html" class="site-logo">F&thinsp;O&thinsp;R&thinsp;M&thinsp;A&thinsp;L&thinsp;D&thinsp;E&thinsp;H&thinsp;Y&thinsp;D&thinsp;E</a>
        <nav class="site-nav">
          <a href="${rootPath}/archive.html">Archive</a>
          <a href="${rootPath}/about.html">About</a>
        </nav>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);

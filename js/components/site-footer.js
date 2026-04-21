class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <span class="footer-logo">Formaldehyde</span>
        <span class="footer-note">
          © Momoko Tezuka &nbsp;·&nbsp;
          <a href="https://muuu-noir.github.io/mysite/" target="_blank" rel="noopener">396 FOLIO →</a>
        </span>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);

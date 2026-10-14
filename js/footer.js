// Shared site footer. Included on every page with:
//   <script src="js/footer.js"></script>   (placed where the footer should appear)
// Optional extra line for one page:  <script src="js/footer.js" data-note="Extra disclaimer text."></script>
// Edit footer links / text HERE ONLY — all pages update.
(function(){
  // ---- one place to switch URL style -------------------------------------------
  // false -> services.html      true -> /services   (only after your host serves clean URLs)
  var CLEAN_URLS = true;
  // -------------------------------------------------------------------------------
  function url(name){
    if (name === 'index') return CLEAN_URLS ? '/' : 'index.html';
    return CLEAN_URLS ? '/' + name : name + '.html';
  }
  function fill(html){ return html.replace(/__([\w-]+)__/g, function(m, n){ return url(n); }); }

  var note = document.currentScript.getAttribute('data-note');
  var html = fill(`
<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="__index__" data-page="index" class="logo logo-full" aria-label="Altrum Capital — Adding Futures to Your Investments"><img src="images/logo-full.png" alt="Altrum Capital"></a>
        <p>Independent financial advisory helping families across Hooghly plan, invest, and protect their wealth.</p>
        <div class="social-row">
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9h4v2a4 4 0 0 1 8 0v10h-4v-9a2 2 0 0 0-4 0v9h-4Z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="__services__" data-page="services">Services</a>
        <a href="__why-us__" data-page="why-us">Why Us</a>
        <a href="__process__" data-page="process">How We Work</a>
        <a href="__testimonials__" data-page="testimonials">Clients</a>
        <a href="__amcs__" data-page="amcs">AMCs</a>
        <a href="__contact__" data-page="contact">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <a href="__services__" data-page="services">Mutual Funds &amp; SIPs</a>
        <a href="__services__" data-page="services">Insurance Planning</a>
        <a href="__services__" data-page="services">Retirement Planning</a>
        <a href="__services__" data-page="services">Tax-Saving Investments</a>
      </div>
      <div class="footer-col">
        <h4>Tools</h4>
        <a href="__calculators__" data-page="calculators">SIP Calculator</a>
        <a href="__calculators__" data-page="calculators">EMI Calculator</a>
        <a href="__calculators__" data-page="calculators">Retirement Calculator</a>
        <a href="__contact__" data-page="contact">Book a Consultation</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. Altrum Capital acts as a distributor and does not guarantee any returns.{{NOTE}}</p>
      <p>© <span id="year"></span> Altrum Capital. All rights reserved.</p>
    </div>
  </div>
</footer>
`).replace("{{NOTE}}", note ? ' ' + note.replace(/</g, '&lt;') : '');
  document.currentScript.insertAdjacentHTML('beforebegin', html);
})();

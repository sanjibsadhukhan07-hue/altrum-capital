// Shared site header (top bar + mobile menu). Included on every page with:
//   <script src="js/header.js"></script>   (placed where the header should appear)
// Edit the menu / login links HERE ONLY — all pages update.
(function(){
  // ---- one place to switch URL style -------------------------------------------
  // false -> services.html      true -> /services   (only after your host serves clean URLs)
  var CLEAN_URLS = false;
  // -------------------------------------------------------------------------------
  function url(name){
    if (name === 'index') return CLEAN_URLS ? '/' : 'index.html';
    return CLEAN_URLS ? '/' + name : name + '.html';
  }
  function fill(html){ return html.replace(/__([\w-]+)__/g, function(m, n){ return url(n); }); }

  var html = fill(`
<header id="siteHeader">
  <nav class="wrap">
    <a href="__index__" data-page="index" class="logo logo-full" aria-label="Altrum Capital — Adding Futures to Your Investments"><img src="images/logo-full.png" alt="Altrum Capital"></a>
    <div class="nav-links">
      <a href="__services__" data-page="services">Services</a>
      <a href="__why-us__" data-page="why-us">Why Us</a>
      <a href="__calculators__" data-page="calculators">Calculators</a>
      <div class="nav-item has-mega">
        <a href="__amcs__" data-page="amcs" aria-haspopup="true" aria-expanded="false">AMCs <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg></a>
        <div class="mega" data-amc-menu></div>
      </div>
      <a href="__process__" data-page="process">How We Work</a>
      <a href="__testimonials__" data-page="testimonials">Clients</a>
      <a href="__contact__" data-page="contact">Contact</a>
    </div>
    <div class="nav-cta">
      <div class="login-menu">
        <button type="button" class="login-btn" aria-haspopup="true" aria-expanded="false">Login <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1l4 4 4-4"/></svg></button>
        <div class="login-pop" role="menu">
          <div class="login-group">
            <h6>Office Login</h6>
            <a role="menuitem" href="https://altrumcapital.investwell.app/app/#/login" target="_blank" rel="noopener">Admin</a>
            <a role="menuitem" href="https://www.nseinvest.com/nsemfdesk/login.htm" target="_blank" rel="noopener">NSE MF</a>
            <a role="menuitem" href="https://voltmoney.in/partner/signup" target="_blank" rel="noopener">LAMF</a>
          </div>
          <div class="login-group">
            <h6>Client Login</h6>
            <a role="menuitem" href="https://altrumcapital.investwell.app/app/#/login" target="_blank" rel="noopener">MF Portfolio</a>
            <a role="menuitem" href="https://app.voltmoney.in/" target="_blank" rel="noopener">LAMF</a>
          </div>
        </div>
      </div>
      <a href="__contact__" data-page="contact" class="btn btn-primary btn-sm">Book a Consultation</a>
      <button class="burger" id="burgerBtn" aria-label="Open menu" aria-expanded="false">
        <span></span>
      </button>
    </div>
  </nav>
</header>

<div class="menu-close-scrim" id="scrim"></div>
<div class="mobile-menu" id="mobileMenu">
  <a href="__services__" data-page="services">Services</a>
  <a href="__why-us__" data-page="why-us">Why Us</a>
  <a href="__calculators__" data-page="calculators">Calculators</a>
  <a href="__amcs__" data-page="amcs">AMCs</a>
  <a href="__process__" data-page="process">How We Work</a>
  <a href="__testimonials__" data-page="testimonials">Clients</a>
  <a href="__contact__" data-page="contact">Contact</a>
  <div class="m-login">
    <h6>Office Login</h6>
    <a href="https://altrumcapital.investwell.app/app/#/login" target="_blank" rel="noopener">Admin</a>
    <a href="https://www.nseinvest.com/nsemfdesk/login.htm" target="_blank" rel="noopener">NSE MF</a>
    <a href="https://voltmoney.in/partner/signup" target="_blank" rel="noopener">LAMF</a>
    <h6>Client Login</h6>
    <a href="https://altrumcapital.investwell.app/app/#/login" target="_blank" rel="noopener">MF Portfolio</a>
    <a href="https://app.voltmoney.in/" target="_blank" rel="noopener">LAMF</a>
  </div>
  <a href="__contact__" data-page="contact" class="btn btn-primary" style="margin-top:10px;">Book a Consultation</a>
</div>

`);
  document.currentScript.insertAdjacentHTML('beforebegin', html);

  // highlight the current page in the top menu (amc.html counts as "AMCs")
  var page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  if (page === 'amc') page = 'amcs';
  document.querySelectorAll('#siteHeader .nav-links a[data-page]').forEach(function(a){
    if (a.dataset.page === page) a.classList.add('active');
  });
})();

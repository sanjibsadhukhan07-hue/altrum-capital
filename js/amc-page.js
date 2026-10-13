// amc.html — one page for every AMC. URL: amc.html?amc=<slug>   (data: amc-data.js + amc-content.js)
(function(){
  const slug = new URLSearchParams(location.search).get('amc') || location.hash.replace('#', '');
  const a = (window.AMC_DATA || []).find(x => x.slug === slug);
  const c = (window.AMC_CONTENT || {})[slug];
  const $ = id => document.getElementById(id);

  if (!a || !c){
    document.title = 'AMC not found | Altrum Capital';
    $('amcName').textContent = 'AMC not found';
    $('amcCrumb').textContent = 'Not found';
    $('amcBody').innerHTML = '<p class="amc-note">We could not find that fund house. <a href="amcs.html" style="color:var(--orange-500)">Browse all AMCs →</a></p>';
    $('amcCta').hidden = true;
    return;
  }

  document.title = a.name + ' — Offices & Investor Support | Altrum Capital';
  const md = document.querySelector('meta[name="description"]');
  if (md) md.content = a.name + ' offices and investor service contacts near Hooghly, via ' + c.rta + ' (RTA). Invest through Altrum Capital.';

  $('amcCrumb').textContent = a.short;
  $('amcName').textContent = a.name;

  const logo = document.createElement('img');
  logo.className = 'amc-logo'; logo.src = 'images/amc/' + a.slug + '.png'; logo.alt = a.name; logo.dataset.short = a.short;
  $('amcLogoBox').appendChild(logo);

  $('amcBadges').innerHTML = (c.arn
      ? '<span class="amc-badge ok">Empanelled · ' + c.arn + '</span>'
      : '<span class="amc-badge wait">Empanelment in process</span>')
    + '<span class="amc-badge rta">RTA · ' + c.rta + '</span>';

  $('amcH2').innerHTML = c.h2;
  $('amcIntro').innerHTML = c.intro;
  $('amcCards').innerHTML = c.cards;       // trusted, first-party content from amc-content.js
  $('amcCtaTitle').textContent = 'Want to invest in ' + a.short + '?';

  window.amcAttachFallback(document);
})();

// AMC mega-menu, logo handling and home-page logo strip. Data: js/amc-data.js
// Logo order: images/amc/<slug>.png  ->  open-web favicon of the AMC site + name  ->  clean wordmark tile.
// To use a better logo for any AMC, just drop images/amc/<slug>.png — it is picked up automatically.
(function(){
  const data = window.AMC_DATA || [];
  const bySlug = {};
  data.forEach(a => bySlug[a.slug] = a);

  const amcURL = slug => 'amc.html?amc=' + encodeURIComponent(slug);
  const favURL = domain => 'https://www.google.com/s2/favicons?sz=128&domain=' + encodeURIComponent(domain);
  const slugOf = img => { const m = (img.getAttribute('src') || '').match(/images\/amc\/([\w-]+)\.png/); return m ? m[1] : null; };
  window.amcURL = amcURL;

  function wordmark(img, favSrc){
    const a = bySlug[slugOf(img)] || {};
    const s = document.createElement('span');
    s.className = 'amc-wm';
    if (favSrc){
      const f = document.createElement('img');
      f.className = 'amc-fav'; f.alt = ''; f.loading = 'lazy'; f.src = favSrc;
      f.addEventListener('error', () => f.remove(), { once: true });
      s.append(f);
    }
    const b = document.createElement('b'); b.textContent = img.dataset.short || a.short || img.alt;
    const i = document.createElement('i'); i.textContent = 'Mutual Fund';
    s.append(b, i);
    img.replaceWith(s);
  }

  window.amcAttachFallback = function(root){
    (root || document).querySelectorAll('img.amc-logo').forEach(img => {
      const swap = () => { const a = bySlug[slugOf(img)]; wordmark(img, a && a.domain ? favURL(a.domain) : null); };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener('error', swap, { once: true });
    });
  };

  function logoImg(a){
    const img = document.createElement('img');
    img.className = 'amc-logo';
    img.src = 'images/amc/' + a.slug + '.png';
    img.alt = a.name;
    img.dataset.short = a.short;
    return img;
  }

  // ---- mega menu ----
  document.querySelectorAll('[data-amc-menu]').forEach(menu => {
    const head = document.createElement('div');
    head.className = 'mega-head';
    head.innerHTML = '<div><strong>AMCs we are closely working with</strong><span>Tap a fund house for offices &amp; investor support</span></div><a href="amcs.html" class="mono">View all →</a>';
    const grid = document.createElement('div');
    grid.className = 'mega-grid';
    data.forEach(a => {
      const t = document.createElement('a');
      t.className = 'amc-tile';
      t.href = amcURL(a.slug);
      t.title = a.name;
      t.appendChild(logoImg(a));
      grid.appendChild(t);
    });
    menu.append(head, grid);
    window.amcAttachFallback(menu);
  });

  // ---- home page: continuous right-to-left logo strip ----
  document.querySelectorAll('[data-amc-marquee]').forEach(box => {
    const track = document.createElement('div');
    track.className = 'amc-marquee-track';
    for (let copy = 0; copy < 2; copy++){
      const group = document.createElement('div');
      group.className = 'amc-marquee-group';
      if (copy === 1) group.setAttribute('aria-hidden', 'true');
      data.forEach(a => {
        const l = document.createElement('a');
        l.className = 'amc-slide';
        l.href = amcURL(a.slug);
        l.title = a.name;
        l.setAttribute('aria-label', a.name);
        if (copy === 1) l.tabIndex = -1;
        l.appendChild(logoImg(a));
        group.appendChild(l);
      });
      track.appendChild(group);
    }
    box.appendChild(track);
    box.style.setProperty('--marquee-time', Math.max(40, data.length * 3) + 's');
    window.amcAttachFallback(box);
  });

  // ---- mega open / close ----
  document.querySelectorAll('.has-mega').forEach(item => {
    const trigger = item.querySelector(':scope > a');
    let timer;
    const open = () => { clearTimeout(timer); item.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); };
    const close = () => { item.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', () => { timer = setTimeout(close, 160); });
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); trigger.blur(); } });
  });
})();

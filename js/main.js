// ---- header scroll state ----
const header = document.getElementById('siteHeader');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ---- mobile menu ----
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const scrim = document.getElementById('scrim');
function toggleMenu(open){
  burger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  scrim.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
if(burger){
  burger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
  scrim.addEventListener('click', () => toggleMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
}

// ---- scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---- stat counters ----
const statEls = document.querySelectorAll('.stat h3');
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statIO.unobserve(el);
  });
}, { threshold: 0.4 });
statEls.forEach(el => statIO.observe(el));

// ---- moving image slideshow (auto-advances every 4 seconds) ----
(function initSliders(){
  document.querySelectorAll('.img-slider').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.img-slide'));
    const dotsWrap = slider.querySelector('.slider-dots');
    const progressBar = slider.querySelector('.slider-track-time');
    if(slides.length === 0) return;

    let current = 0;
    const INTERVAL = 4000; // 4 seconds
    let dots = [];

    if(dotsWrap){
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        if(i === 0) b.classList.add('active');
        b.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function show(index){
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(index){
      current = index;
      show(current);
      restartProgress();
    }

    function next(){
      current = (current + 1) % slides.length;
      show(current);
    }

    function restartProgress(){
      if(!progressBar) return;
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // force reflow so the transition restarts cleanly
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${INTERVAL}ms linear`;
      progressBar.style.width = '100%';
    }

    show(0);
    restartProgress();
    setInterval(() => {
      next();
      restartProgress();
    }, INTERVAL);
  });
})();

// ---- footer year ----
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ---- contact form (demo only, no backend) ----
document.querySelectorAll('.form-card').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    if(btn) btn.textContent = 'Message Sent ✓';
  });
});

// ---- login dropdown (Office Login / Client Login) ----
document.querySelectorAll('.login-menu').forEach(menu => {
  const btn = menu.querySelector('.login-btn');
  let timer;
  const set = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', e => { e.stopPropagation(); const canHover = window.matchMedia('(hover:hover)').matches; set(canHover ? true : !menu.classList.contains('open')); });
  menu.addEventListener('mouseenter', () => { if (window.matchMedia('(hover:hover)').matches){ clearTimeout(timer); set(true); } });
  menu.addEventListener('mouseleave', () => { timer = setTimeout(() => set(false), 160); });
  menu.addEventListener('focusout', e => { if (!menu.contains(e.relatedTarget)) set(false); });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
});

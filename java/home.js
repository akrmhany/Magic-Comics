// home.js - cleaned and optimized
(function(){
  'use strict';

  // helpers
  const qs = selector => document.querySelector(selector);
  const qsa = selector => Array.from(document.querySelectorAll(selector));

  // Header hide on scroll (throttled via rAF)
  (function headerScroll(){
    const header = qs('.main-header');
    if(!header) return;
    let lastScroll = window.pageYOffset || 0;
    let ticking = false;

    function onScroll(){
      if(!ticking){
        window.requestAnimationFrame(()=>{
          const current = window.pageYOffset || 0;
          if(current > lastScroll + 10){
            header.style.transform = 'translateY(-100%)';
          } else if(current < lastScroll - 10){
            header.style.transform = 'translateY(0)';
          }
          lastScroll = current;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
  })();

  // Toggle mobile menu
  (function mobileMenu(){
    const toggle = qs('#menu-toggle');
    const nav = qs('#nav-links');
    if(!toggle || !nav) return;
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
  })();

  // Improve section visibility handling (debounced, avoids layout thrash)
  (function sectionVisibility(){
    const sections = qsa('main section');
    if(!sections.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {threshold:0.1});
    sections.forEach(s=>io.observe(s));
  })();

  // Safe search handler (attach only if elements exist)
  (function searchHandler(){
    const input = qs('#search-input');
    const button = qs('#search-button');
    if(!input || !button) return;
    button.addEventListener('click', ()=>{
      const q = input.value.trim();
      // replace alert with unobtrusive behavior if needed
      window.alert('نتائج البحث عن: ' + q);
    });
  })();

  // Clean up any stray dropdown toggles (defensive)
  (function dropdowns(){
    qsa('.dropdown-toggle').forEach(btn=>{
      const next = btn.nextElementSibling;
      btn.addEventListener('click', ()=>{
        if(next) next.classList.toggle('show');
      });
    });
  })();

  // Ensure carousel performance: if Flowbite is present it will handle carousel behavior.
  // We only add a light keyboard support and ensure indicators update aria-current when Flowbite changes slides.
  (function enhanceCarousel(){
    const carousel = qs('#default-carousel');
    if(!carousel) return;

    // keyboard navigation
    carousel.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft'){
        const prev = carousel.querySelector('[data-carousel-prev]');
        if(prev) prev.click();
      } else if(e.key === 'ArrowRight'){
        const next = carousel.querySelector('[data-carousel-next]');
        if(next) next.click();
      }
    });

    // keep indicators' aria-current in sync (Flowbite fires callbacks; if not, fallback)
    const indicators = qsa('#default-carousel .indicator');
    if(!indicators.length) return;

    function setActive(index){
      indicators.forEach((btn,i)=>{
        const isActive = i === index;
        btn.setAttribute('aria-current', String(isActive));
      });
    }

    // try to listen for flowbite events
    try{
      document.addEventListener('flowbite-carousel-change', (ev)=>{
        if(ev?.detail?.index != null) setActive(ev.detail.index);
      });
    } catch(e){/* ignore */}

    // fallback: observe DOM changes to carousel items' aria-hidden
    const track = carousel.querySelector('.carousel-track');
    if(track){
      const mo = new MutationObserver(()=>{
        const items = qsa('#default-carousel [data-carousel-item]');
        const activeIndex = items.findIndex(it => it.getAttribute('aria-hidden') === 'false');
        if(activeIndex >= 0) setActive(activeIndex);
      });
      mo.observe(track, {attributes:true, subtree:true, attributeFilter:['aria-hidden']});

      // initial sync
      const items = qsa('#default-carousel [data-carousel-item]');
      const activeIndex = items.findIndex(it => it.getAttribute('aria-hidden') === 'false');
      if(activeIndex >= 0) setActive(activeIndex);
    }
  })();

})();

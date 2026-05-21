'use strict';

/* ==========================================================================
   Ma&Stral — main.js
   Forestry services landing — editorial daylight theme
   Responsibilities: mobile menu, smooth scroll, counters, before/after slider,
                     scroll reveal. No particles, no exaggerated tilt.
   ========================================================================== */

// ----- Utils -------------------------------------------------------------
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

function formatCounterValue(el, current) {
  const format = el.getAttribute('data-format');
  const suffix = el.getAttribute('data-suffix') || '';
  if (format === 'k') {
    // 38000 -> "38k", 1500 -> "1,5k"
    if (current >= 1000) {
      const k = current / 1000;
      const str = k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace('.', ',');
      return str + 'k' + suffix;
    }
    return current + suffix;
  }
  return current.toLocaleString('pt-BR') + suffix;
}

// ----- Mobile menu -------------------------------------------------------
function initMobileMenu() {
  const toggle    = document.getElementById('menu-toggle');
  const close     = document.getElementById('menu-close');
  const menu      = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function open() {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.classList.add('no-scroll');
  }
  function shut() {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.classList.remove('no-scroll');
  }

  toggle.addEventListener('click', open);
  close && close.addEventListener('click', shut);
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', shut);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) shut();
  });
}

// ----- Smooth scroll (anchor links) --------------------------------------
function initSmoothScroll() {
  const OFFSET = 72; // header height
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

// ----- Counters ----------------------------------------------------------
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    const duration = 1800;
    const t0       = performance.now();

    function step(now) {
      const progress = clamp((now - t0) / duration, 0, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.round(eased * target);
      el.textContent = formatCounterValue(el, current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatCounterValue(el, target);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(function (entries, o) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { obs.observe(el); });
}

// ----- Scroll reveal -----------------------------------------------------
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  // Auto-mark major content blocks for reveal
  const targets = document.querySelectorAll('section h2, section article, .counter');
  targets.forEach(function (el) {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  const obs = new IntersectionObserver(function (entries, o) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
}

// ----- Before / After slider --------------------------------------------
function initBeforeAfter() {
  const root = document.getElementById('ba-compare');
  if (!root) return;
  const clip   = document.getElementById('ba-clip');
  const handle = document.getElementById('ba-handle');
  const before = clip && clip.querySelector('img');
  if (!clip || !handle || !before) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = root.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    x = clamp(x, 0, 100);
    clip.style.width = x + '%';
    handle.style.left = x + '%';
    before.style.width = rect.width + 'px';
  }

  function syncSize() {
    before.style.width = root.getBoundingClientRect().width + 'px';
  }
  syncSize();
  window.addEventListener('resize', syncSize);

  root.addEventListener('mousedown', function (e) {
    dragging = true;
    setPos(e.clientX);
  });
  window.addEventListener('mousemove', function (e) {
    if (dragging) setPos(e.clientX);
  });
  window.addEventListener('mouseup', function () { dragging = false; });

  root.addEventListener('touchstart', function (e) {
    dragging = true;
    setPos(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (dragging) setPos(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', function () { dragging = false; });
}

// ----- Model viewer load hook -------------------------------------------
function initModelViewer() {
  const mv = document.querySelector('model-viewer');
  if (!mv) return;
  mv.addEventListener('load', function () { mv.classList.add('loaded'); });
}

// ----- Boot -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initSmoothScroll();
  initCounters();
  initReveal();
  initBeforeAfter();
  initModelViewer();
});

'use strict';

// ====== UTILS ======

/**
 * Clamps a value between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a random float between min (inclusive) and max (exclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Formats a stat number for display.
 * Numbers >= 1000 become e.g. "15k+", others become e.g. "500+".
 * @param {number} value
 * @returns {string}
 */
function formatStatNumber(value) {
  if (value >= 1000) {
    return Math.floor(value / 1000) + 'k+';
  }
  return value + '+';
}


// ====== PARTICLES ======

/**
 * Generates 25 floating particles inside #particles.
 * Size, position, animation duration, and delay are all randomised.
 * The visual movement is driven by the CSS `drift` keyframe animation.
 */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const PARTICLE_COUNT = 25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random size between 3px and 8px
    const size = randomBetween(3, 8);
    particle.style.width  = size + 'px';
    particle.style.height = size + 'px';

    // Random position across the full container
    particle.style.left = randomBetween(0, 100) + '%';
    particle.style.top  = randomBetween(0, 100) + '%';

    // Random animation timing so particles drift independently
    const duration = randomBetween(6, 14).toFixed(2);
    const delay    = randomBetween(0, 8).toFixed(2);
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay    = '-' + delay + 's'; // negative delay = already mid-cycle on load

    container.appendChild(particle);
  }
}


// ====== NAVBAR ======

/**
 * Adds/removes the `scrolled` class on #navbar based on scroll position.
 * Class is added when the user scrolls more than 50px from the top.
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once immediately in case the page loads mid-scroll
  onScroll();
}


// ====== MOBILE MENU ======

/**
 * Handles the mobile hamburger menu:
 *   - Toggle button opens the drawer
 *   - Close button / Escape key / internal links close the drawer
 *   - body gets `no-scroll` while open to prevent background scrolling
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn  = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !closeBtn || !mobileMenu) return;

  /** Open the mobile menu */
  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  /** Close the mobile menu */
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Close when any internal link inside the menu is clicked
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}


// ====== SCROLL REVEAL ======

/**
 * Uses IntersectionObserver to reveal elements as they enter the viewport.
 *
 * Observed elements receive the `visible` class when they cross the threshold,
 * then the observer disconnects from them so the animation only fires once.
 *
 * Service-card grids get staggered transition-delays so children animate in
 * sequence rather than all at once.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: make everything visible immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // run only once per element
      }
    });
  }, observerOptions);

  // --- Elements explicitly marked for reveal ---
  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  // --- Section headings ---
  document.querySelectorAll('section h2, section h3').forEach(function (el) {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // --- Service cards ---
  const serviceCardGrids = document.querySelectorAll('.services-grid, .service-cards');
  serviceCardGrids.forEach(function (grid) {
    const cards = grid.children;
    Array.from(cards).forEach(function (card, index) {
      // Stagger: each card is delayed by 0.1s more than the previous
      card.style.transitionDelay = (index * 0.1) + 's';
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
        observer.observe(card);
      }
    });
  });

  // Individual service cards outside a tracked grid
  document.querySelectorAll('.service-card').forEach(function (el) {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // --- Feature items ---
  document.querySelectorAll('.feature-item, .feature').forEach(function (el) {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // --- Pillar cards ---
  document.querySelectorAll('.pillar-card, .pillar').forEach(function (el) {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });
}


// ====== COUNTERS ======

/**
 * Animates stat counters from 0 to their `data-target` value when they
 * scroll into view.
 *
 * Uses an ease-out cubic easing function and requestAnimationFrame for a
 * smooth, performant animation. Each counter only animates once.
 */
function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  const DURATION = 2000; // ms

  /**
   * Easing function: ease-out cubic
   * t is progress 0→1, returns eased 0→1
   * @param {number} t
   * @returns {number}
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Starts the count-up animation for a single element.
   * @param {HTMLElement} el  – element whose text content will be updated
   * @param {number}      target – the final numeric value
   */
  function animateCounter(el, target) {
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = clamp(elapsed / DURATION, 0, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.round(eased * target);

      el.textContent = formatStatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure the final value is always exactly the target
        el.textContent = formatStatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const card   = entry.target;
      const numEl  = card.querySelector('.stat-number');
      if (!numEl) return;

      const target = parseInt(numEl.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      animateCounter(numEl, target);
      obs.unobserve(card); // animate only once
    });
  }, { threshold: 0.3 });

  // Observe both card variants used in the Tech section
  document.querySelectorAll('.stat-card-glass, .stat-card-solid').forEach(function (card) {
    counterObserver.observe(card);
  });

  // Direct targets by ID as a fallback / supplement
  ['stat-hectares', 'stat-projects'].forEach(function (id) {
    const section = document.getElementById(id);
    if (!section) return;
    const numEl = section.querySelector('.stat-number');
    if (!numEl || numEl.hasAttribute('data-counter-init')) return;
    numEl.setAttribute('data-counter-init', '1');

    const wrapper = numEl.closest('.stat-card-glass, .stat-card-solid') || section;
    counterObserver.observe(wrapper);
  });
}


// ====== DRONE TILT ======

/**
 * Applies a subtle 3-D tilt to the .tech-visual element based on its
 * position relative to the vertical centre of the viewport as the user
 * scrolls.
 *
 * Intentionally capped at ±3° to keep the effect tasteful.
 * Only active on viewports wider than 768 px.
 * CSS should already have `transition: transform` on the element.
 */
function initDroneTilt() {
  const visual = document.querySelector('.tech-visual');
  if (!visual) return;

  const MAX_ROTATION = 3; // degrees

  function onScroll() {
    // Disable on small screens / touch devices
    if (window.innerWidth <= 768) {
      visual.style.transform = '';
      return;
    }

    const rect             = visual.getBoundingClientRect();
    const elementCenterY   = rect.top + rect.height / 2;
    const viewportCenterY  = window.innerHeight / 2;
    const elementCenterX   = rect.left + rect.width / 2;
    const viewportCenterX  = window.innerWidth / 2;

    // Only apply tilt while the element is visible in the viewport
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      visual.style.transform = '';
      return;
    }

    // Normalise offset to –1 … +1 relative to viewport size
    const normalY = clamp((elementCenterY - viewportCenterY) / (window.innerHeight / 2), -1, 1);
    const normalX = clamp((elementCenterX - viewportCenterX) / (window.innerWidth  / 2), -1, 1);

    const rotateX = (-normalY * MAX_ROTATION).toFixed(2); // tilt up/down
    const rotateY = ( normalX * MAX_ROTATION).toFixed(2); // tilt left/right

    visual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Apply once on load
  onScroll();
}


// ====== SMOOTH SCROLL ======

/**
 * Intercepts clicks on all `<a href="#…">` anchor links and scrolls
 * smoothly to the target element, compensating for the fixed navbar height.
 */
function initSmoothScroll() {
  const NAVBAR_OFFSET = 80; // px — matches the fixed navbar height

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const hash = link.getAttribute('href');

      // Ignore bare "#" links (back-to-top shorthand with no real target)
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}


// ====== MODEL VIEWER ======

/**
 * Listens for the `<model-viewer>` Web Component's `load` event and
 * adds the `loaded` class so CSS can fade the model in gracefully.
 */
function initModelViewer() {
  const modelViewer = document.querySelector('model-viewer');
  if (!modelViewer) return;

  modelViewer.addEventListener('load', function () {
    modelViewer.classList.add('loaded');
    console.log('Pinus 3D carregado');
  });
}


// ====== MARQUEE ======

/**
 * Pauses the scrolling marquee animation when the user hovers over it,
 * serving as a JS-powered backup to the CSS `animation-play-state` approach.
 */
function initMarquee() {
  const container = document.querySelector('.marquee-container');
  if (!container) return;

  const track = container.querySelector('.marquee-track');
  if (!track) return;

  container.addEventListener('mouseenter', function () {
    track.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', function () {
    track.style.animationPlayState = 'running';
  });
}


// ====== HERO BADGE ======

/**
 * Verifies the badge pulse dot element exists so CSS can drive its animation.
 * No JS animation is applied here — this is purely a guard/check.
 */
function initHeroBadge() {
  const dot = document.querySelector('.badge-dot');
  // CSS handles the pulse animation; nothing more needed from JS.
  // This function exists as a hook for future enhancements.
  void dot; // suppress unused-variable lint warnings
}


// ====== INIT ======

document.addEventListener('DOMContentLoaded', function () {
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initDroneTilt();
  initSmoothScroll();
  initModelViewer();
  initMarquee();
  initHeroBadge();
});

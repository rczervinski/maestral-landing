/* ============================================================
   Ma&Stral — main.js
   - Lenis smooth scroll
   - GSAP ScrollTrigger orchestration
   - Three.js forest hero (InstancedMesh + hero tree)
   - Counters, before/after slider, services index, mobile menu
   ============================================================ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

/* ============================================================
   1. Lenis smooth scroll
   ============================================================ */
let lenis = null;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.15,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Expose for debugging
  window.lenis = lenis;
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

/* ============================================================
   2. Anchor links — route through Lenis if active
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -64 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   3. Mobile menu
   ============================================================ */
const menuToggle = document.getElementById('menu-toggle');
const menuClose  = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const openMenu  = () => { mobileMenu.classList.remove('hidden'); mobileMenu.classList.add('flex'); lenis?.stop(); };
const closeMenu = () => { mobileMenu.classList.add('hidden'); mobileMenu.classList.remove('flex'); lenis?.start(); };
menuToggle?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

/* ============================================================
   4. Counters
   ============================================================ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    const format = el.getAttribute('data-format');
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(ease * target);
      if (format === 'k' && target >= 1000) {
        const k = (current / 1000).toFixed(current >= 10000 ? 0 : 1).replace(/\.0$/, '');
        el.innerHTML = `${k}<span class="text-ink-soft">k</span>`;
      } else {
        el.textContent = current.toString();
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

/* ============================================================
   5. Before / after slider
   ============================================================ */
const baCompare = document.getElementById('ba-compare');
if (baCompare) {
  const clip = document.getElementById('ba-clip');
  const handle = document.getElementById('ba-handle');
  const beforeImg = clip.querySelector('img');
  let dragging = false;
  const setPos = (clientX) => {
    const rect = baCompare.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    x = Math.max(0, Math.min(100, x));
    clip.style.width = `${x}%`;
    handle.style.left = `${x}%`;
    beforeImg.style.width = `${rect.width}px`;
  };
  const onResize = () => { beforeImg.style.width = `${baCompare.getBoundingClientRect().width}px`; };
  onResize();
  window.addEventListener('resize', onResize);
  baCompare.addEventListener('pointerdown', (e) => { dragging = true; baCompare.setPointerCapture(e.pointerId); setPos(e.clientX); });
  baCompare.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
  baCompare.addEventListener('pointerup',   (e) => { dragging = false; baCompare.releasePointerCapture(e.pointerId); });
}

/* ============================================================
   6. Services index — hover/tap to swap photo
   ============================================================ */
const servicePhoto = document.getElementById('service-photo');
const serviceCaption = document.getElementById('service-caption');
const serviceRows = document.querySelectorAll('.service-row');
const serviceScrollSection = document.getElementById('atuacao');
const serviceMobileQuery = window.matchMedia('(max-width: 767px)');
let activeServiceIndex = -1;

function activateService(row, index = Array.from(serviceRows).indexOf(row)) {
  if (!row || index === activeServiceIndex) return;
  activeServiceIndex = index;
  serviceRows.forEach((r) => r.removeAttribute('data-active'));
  row.setAttribute('data-active', 'true');
  const src = row.getAttribute('data-photo');
  const cap = row.getAttribute('data-caption');
  if (servicePhoto && src && servicePhoto.getAttribute('src') !== src) {
    servicePhoto.style.opacity = '0';
    setTimeout(() => {
      servicePhoto.src = src;
      servicePhoto.style.opacity = '1';
    }, 180);
  }
  if (serviceCaption && cap) serviceCaption.textContent = cap;
}

function updateServiceStepper() {
  if (!serviceScrollSection || serviceRows.length === 0) return;
  const top = serviceScrollSection.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(1, serviceScrollSection.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(0.999, (window.scrollY - top) / range));
  const index = Math.min(serviceRows.length - 1, Math.floor(progress * serviceRows.length));
  activateService(serviceRows[index], index);
}

serviceRows.forEach((row, i) => {
  if (i === 0) activateService(row, i);
  const activate = () => activateService(row, i);
  row.addEventListener('mouseenter', activate);
  row.addEventListener('focusin', activate);
  row.addEventListener('click', activate);
});

window.addEventListener('scroll', updateServiceStepper, { passive: true });
window.addEventListener('resize', updateServiceStepper);
if (lenis) lenis.on('scroll', updateServiceStepper);
updateServiceStepper();

/* ============================================================
   7. THREE.js — fixed 3D pinus that lives across hero + sobre.
   Stage 3 of hero: tree appears on the right.
   Through Sobre section: tree falls (rotates, dips, travels) to left.
   Pointer drag rotates tree on Y; releases snap back to scroll value.
   ============================================================ */
const heroSection = document.getElementById('hero');
const sobreSection = document.getElementById('sobre');
const existingCanvas = document.getElementById('forest-canvas');

if (heroSection && existingCanvas && sobreSection && !prefersReducedMotion) {
  initForestHero();
}

function initForestHero() {
  // Fresh canvas avoids any pre-existing 2D/WebGL context contamination
  const canvas = document.createElement('canvas');
  canvas.id = 'forest-canvas';
  canvas.className = existingCanvas.className;
  canvas.style.cssText = existingCanvas.style.cssText;
  existingCanvas.replaceWith(canvas);
  const sobreStage = sobreSection.querySelector('.sticky') || sobreSection;
  window.__ms3d = { canvas };

  const scene = new THREE.Scene();
  // Transparent canvas: hero photo and Sobre background show through

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2.6, 14);
  camera.lookAt(0, 2.6, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  window.__ms3d.renderer = renderer;
  window.__ms3d.scene = scene;
  window.__ms3d.camera = camera;

  // ---- Lights ----
  scene.add(new THREE.HemisphereLight(0xe8f1d8, 0x1c2e1f, 0.9));
  const key = new THREE.DirectionalLight(0xfff2d6, 2.6); key.position.set(6, 12, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x9bc7d9, 0.6); fill.position.set(-8, 5, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x6ed085, 1.0); rim.position.set(-4, 6, -8); scene.add(rim);

  // ---- Viewport-aware position helper ----
  // Returns world X for a normalized screen fraction (0=left, 0.5=center, 1=right)
  // assuming a given depth (z position). Depth defaults to 0.
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const screenToWorld = (clientX, clientY, z = 0) => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    ndc.set((clientX / w) * 2 - 1, -(clientY / h) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const distance = (z - raycaster.ray.origin.z) / raycaster.ray.direction.z;
    return raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(distance));
  };

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const invLerp = (a, b, v) => (a === b ? 0 : clamp01((v - a) / (b - a)));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const mix = (a, b, t) => a + (b - a) * t;
  const mixVec = (a, b, t) => new THREE.Vector3(mix(a.x, b.x, t), mix(a.y, b.y, t), mix(a.z, b.z, t));

  const getContentMetrics = () => {
    const w = window.innerWidth;
    const pad = w >= 1024 ? 40 : (w >= 640 ? 24 : 20);
    const outer = Math.min(1400, w);
    const inner = Math.max(1, outer - pad * 2);
    const left = (w - outer) / 2 + pad;
    const gap = w >= 640 ? 24 : 16;
    const col = (inner - gap * 11) / 12;
    return { left, inner, gap, col };
  };

  // Responsive state — recomputed on resize
  const layout = {
    entry: new THREE.Vector3(),
    hero: new THREE.Vector3(),
    landed: new THREE.Vector3(),
    treeScale: 1,
  };
  const updateLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLg = w >= 1024;
    const metrics = getContentMetrics();
    const leftReserve = metrics.col * 5 + metrics.gap * 4;
    const landX = isLg ? metrics.left + leftReserve * 0.48 : w * 0.5;
    const landY = isLg ? h * 0.82 : h * 0.42;
    const heroX = isLg ? metrics.left + metrics.inner * 0.76 : w * 0.86;
    const heroY = isLg ? h * 0.77 : h * 0.58;
    layout.entry.copy(screenToWorld(w * (isLg ? 1.08 : 1.18), heroY, 0));
    layout.hero.copy(screenToWorld(heroX, heroY, 0));
    layout.landed.copy(screenToWorld(landX, landY, 0));
    layout.treeScale = w < 480 ? 0.52 : (w < 768 ? 0.68 : 1.0);
  };
  updateLayout();
  window.__ms3d.layout = layout;

  // ---- Tree group ----
  const treeGroup = new THREE.Group();
  scene.add(treeGroup);
  window.__ms3d.treeGroup = treeGroup;

  // Drag interaction state — userRotY adds onto scrollRotY
  const state = {
    scrollRotY: 0,        // driven by scroll
    userRotY: 0,          // driven by drag, snaps back to 0
    isDragging: false,
    dragStartX: 0,
    dragStartUserRotY: 0,
    snapTween: null,
  };

  const loader = new GLTFLoader();
  loader.load(
    '/assets/models/pinus.glb',
    (gltf) => {
      const proto = gltf.scene;
      const fullBox = new THREE.Box3().setFromObject(proto);
      const fullSize = new THREE.Vector3(); fullBox.getSize(fullSize);
      const fullCenter = new THREE.Vector3(); fullBox.getCenter(fullCenter);
      const TARGET_HEIGHT = 5.0;
      const baseScale = TARGET_HEIGHT / Math.max(fullSize.y, 0.001);

      proto.position.set(-fullCenter.x, -fullBox.min.y, -fullCenter.z);
      proto.scale.setScalar(baseScale);

      proto.traverse((c) => {
        if (c.isMesh && c.material) {
          c.material = c.material.clone();
          c.material.transparent = true;
          c.material.opacity = 0;
        }
      });

      treeGroup.add(proto);
      treeGroup.position.copy(layout.entry);
      treeGroup.scale.setScalar(layout.treeScale);
      window.__ms3d.tree = proto;

      buildScrollTimeline();
    },
    undefined,
    (err) => {
      console.error('[Ma&Stral] Failed to load pinus.glb', err);
      canvas.style.display = 'none';
    }
  );

  function tick() {
    // Smooth follow on position & X/Z rotation
    if (window.__ms3d.applyTargets) window.__ms3d.applyTargets();
    // Y rotation = scroll-driven + user drag
    treeGroup.rotation.y = state.scrollRotY + state.userRotY;
    renderer.render(scene, camera);
  }
  // Drive the render loop from GSAP's ticker (guaranteed rAF cadence)
  gsap.ticker.add(tick);

  // ---- Resize ----
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateLayout();
      if (window.__ms3d.tree) treeGroup.scale.setScalar(layout.treeScale);
      // Force ScrollTrigger to recompute with new layout values
      ScrollTrigger.refresh();
    });
  });

  function buildScrollTimeline() {
    const stages = document.querySelectorAll('.hero-stage');
    const stage1 = stages[0];
    const stage2 = stages[1];
    const stage3 = stages[2];
    const scrim = document.getElementById('hero-scrim');
    const scrollHint = document.getElementById('scroll-hint');
    const tree = window.__ms3d.tree;
    const meshes = [];
    tree.traverse((c) => { if (c.isMesh && c.material) meshes.push(c.material); });

    /* ============================================================
       HERO (320vh) — stage map:
       0 — 30%   Stage 1 (title)
       30 — 55%  Stage 2 (stats)
       55 — 100% Stage 3 (3D pinus on right + phrase left)

       SOBRE (180vh) — pinus falls/rotates from hero-right to sobre-left
       After Sobre: canvas fades out, normal flow.
       ============================================================ */

    gsap.set([stage2, stage3], { autoAlpha: 0 });

    // Stage 1 → 2
    gsap.to(stage1, {
      autoAlpha: 0, y: -20,
      scrollTrigger: { trigger: heroSection, start: '20% top', end: '34% top', scrub: 1 }
    });
    gsap.fromTo(stage2,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0,
        scrollTrigger: { trigger: heroSection, start: '22% top', end: '38% top', scrub: 1 } }
    );

    // Stage 2 → 3
    gsap.to(stage2, {
      autoAlpha: 0, y: -20,
      scrollTrigger: { trigger: heroSection, start: '48% top', end: '60% top', scrub: 0.4 }
    });
    gsap.fromTo(stage3,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0,
        scrollTrigger: { trigger: heroSection, start: '52% top', end: '66% top', scrub: 0.4 } }
    );

    // Scrim darkens slightly in stage 3 for 3D contrast
    gsap.fromTo(scrim,
      { opacity: 1 },
      { opacity: 0.85,
        scrollTrigger: { trigger: heroSection, start: '50% top', end: '64% top', scrub: 0.4 } }
    );

    // Canvas opacity: fades IN during hero stage 3 entry, then STAYS at 1 forever.
    // (No fade-out — user wants pinus to remain visible after Sobre.)
    function updateHeroStages() {
      const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
      const p = (window.scrollY - heroTop) / heroSection.offsetHeight;
      const fade1 = easeInOut(invLerp(0.12, 0.22, p));
      const show2 = easeInOut(invLerp(0.13, 0.26, p));
      const hide2 = easeInOut(invLerp(0.32, 0.42, p));
      const show3 = easeInOut(invLerp(0.36, 0.50, p));
      gsap.set(stage1, { autoAlpha: 1 - fade1, y: mix(0, -20, fade1) });
      gsap.set(stage2, { autoAlpha: show2 * (1 - hide2), y: mix(40, 0, show2) + mix(0, -20, hide2) });
      gsap.set(stage3, { autoAlpha: show3, y: mix(40, 0, show3) });
    }

    const scrollModel = {
      opacity: 0,
      mode: '',
      position: layout.entry.clone(),
      rotX: 0,
      rotZ: 0,
    };

    function setCanvasMode(mode) {
      if (scrollModel.mode === mode) return;
      scrollModel.mode = mode;
      if (mode === 'static') {
        if (canvas.parentElement !== sobreStage) sobreStage.prepend(canvas);
        Object.assign(canvas.style, {
          position: 'absolute',
          inset: '0 auto auto 0',
          width: '100%',
          height: '100vh',
          zIndex: '5',
          pointerEvents: 'none',
        });
      } else {
        if (canvas.parentElement !== document.body) document.body.insertBefore(canvas, heroSection);
        Object.assign(canvas.style, {
          position: 'fixed',
          inset: '0',
          width: '100vw',
          height: '100vh',
          zIndex: '15',
          pointerEvents: 'none',
        });
      }
    }

    /* ============================================================
       Tree movement — TWO discrete phases with a clear PAUSE between:

       Phase A (hero entry, 50–65% of hero):
         tree x: enterRightX → heroRightX

       PAUSE (65–100% of hero ≈ 110vh of scroll):
         tree sits static at heroRightX while stage 3 text is read

       Phase B (sobre fall, 0–40% of sobre):
         tree x: heroRightX → sobreLeftX
         tree y: parabolic dip + settle
         tree rotation Y: 1 full revolution
         tree rotation X & Z: forward tip + sideways lean

       PINNED (40–100% of sobre and beyond):
         tree stays at sobreLeftX, canvas remains visible.
       ============================================================ */

    /* ============================================================
       Direct scroll-driven targets (no GSAP scrub races).
       Two phases with an explicit hold between them; pinned-static after.
       ============================================================ */
    const getScrollBounds = () => {
      const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
      const sobreTop = sobreSection.getBoundingClientRect().top + window.scrollY;
      const heroH = heroSection.offsetHeight;
      const sobreH = sobreSection.offsetHeight;
      const vh = window.innerHeight;
      const enterEnd = heroTop + heroH * 0.50;
      const stickyEnd = sobreTop + Math.max(0, sobreH - vh);
      const fallEnd = Math.min(sobreTop + vh * 0.42, stickyEnd - vh * 0.12);
      return {
        enterStart: heroTop + heroH * 0.38,
        enterEnd,
        fallStart: enterEnd + 1,
        fallEnd: Math.max(enterEnd + vh * 0.42, fallEnd),
        stickyEnd,
      };
    };

    /* ============================================================
       Milestone-driven animation.
       Each milestone is a discrete scroll threshold + a target state.
       When the user's scroll crosses a threshold (in either direction),
       we fire ONE GSAP tween with power2.inOut ease over ~1 second.
       This gives every transition a single continuous smooth animation,
       instead of multiple back-to-back micro-eases that feel stuttered.

       The last milestone is `anchor` mode: as scroll continues past it,
       the tree's Y is directly mapped 1:1 to scroll (scroll-away effect).
       ============================================================ */
    function updateTreeFromScroll() {
      const y = window.scrollY;
      const bounds = getScrollBounds();
      const enterT = easeInOut(invLerp(bounds.enterStart, bounds.enterEnd, y));
      const fallT = easeInOut(invLerp(bounds.fallStart, bounds.fallEnd, y));
      const fallArc = Math.sin(fallT * Math.PI);
      setCanvasMode(y >= bounds.fallEnd ? 'static' : 'fixed');
      const heroPoint = mixVec(layout.entry, layout.hero, enterT);
      scrollModel.position.copy(mixVec(heroPoint, layout.landed, fallT));
      scrollModel.position.y -= fallArc * (window.innerWidth < 768 ? 0.45 : 0.75);
      scrollModel.position.z = mix(0, 0.5, fallT);
      scrollModel.rotX = fallArc * 0.28;
      scrollModel.rotZ = fallArc * 0.14;
      state.scrollRotY = Math.PI * 2 * fallT;
      scrollModel.opacity = enterT;
      canvas.style.opacity = scrollModel.opacity.toFixed(3);
      canvas.style.pointerEvents = 'none';
      meshes.forEach((m) => { m.opacity = scrollModel.opacity; });
    }

    function applyTargets() {
      updateHeroStages();
      updateTreeFromScroll();
      treeGroup.position.copy(scrollModel.position);
      treeGroup.rotation.x = scrollModel.rotX;
      treeGroup.rotation.z = scrollModel.rotZ;
    }

    window.__ms3d.applyTargets = applyTargets;
    window.__ms3d.scrollModel = scrollModel;
    window.__ms3d.getScrollBounds = getScrollBounds;
    window.__ms3d.updateHeroStages = updateHeroStages;
    window.__ms3d.updateTreeFromScroll = updateTreeFromScroll;
    window.addEventListener('scroll', updateTreeFromScroll, { passive: true });
    window.addEventListener('scroll', updateHeroStages, { passive: true });
    if (window.lenis) lenis.on('scroll', updateTreeFromScroll);
    if (window.lenis) lenis.on('scroll', updateHeroStages);
    updateTreeFromScroll();
    updateHeroStages();

    // Scroll hint
    if (scrollHint) {
      gsap.to(scrollHint, {
        autoAlpha: 0,
        scrollTrigger: { trigger: heroSection, start: 'top top', end: '8% top', scrub: 1 }
      });
    }

    ScrollTrigger.refresh();
  }
}

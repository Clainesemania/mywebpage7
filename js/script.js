/**
 * CLAINE PORTFOLIO — script.js
 * Ultra-smooth section navigation · Bloom cursor · Grain · Parallax orbs
 */
(function () {
  'use strict';

  /* ── DOM REFS ───────────────────────────────────── */
  const stage      = document.getElementById('stage');
  const panels     = Array.from(document.querySelectorAll('.panel'));
  const dots       = Array.from(document.querySelectorAll('.sidenav__dot'));
  const navLabel   = document.getElementById('navLabel');
  const cursorGlow = document.getElementById('cursorGlow');
  const orbGold    = document.querySelector('.orb--gold');
  const orbMint    = document.querySelector('.orb--mint');
  const grainCanvas= document.getElementById('grainCanvas');

  /* ── STATE ──────────────────────────────────────── */
  const LOCK_MS   = 1050;        // must match CSS --pt-dur
  let   current   = 0;
  let   locked    = false;
  let   rafId     = null;
  let   mouseX    = window.innerWidth  / 2;
  let   mouseY    = window.innerHeight / 2;
  let   orbX      = mouseX;
  let   orbY      = mouseY;

  /* ── SECTION LABELS ─────────────────────────────── */
  const LABELS = ['Hero', 'About Me', 'GDevelop', 'YouTube', 'GitHub', 'Still Improving'];

  /* ── ACTIVATE ───────────────────────────────────── */
  function activate(idx, skipScroll) {
    if (idx < 0 || idx >= panels.length || idx === current) return;

    panels[current].classList.remove('is-active');
    dots[current].classList.remove('active');

    current = idx;

    panels[current].classList.add('is-active');
    dots[current].classList.add('active');

    if (!skipScroll) {
      panels[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ── INIT ───────────────────────────────────────── */
  function init() {
    panels[0].classList.add('is-active');
    dots[0].classList.add('active');
  }

  /* ── LOCK HELPER ────────────────────────────────── */
  function withLock(fn) {
    if (locked) return;
    locked = true;
    fn();
    setTimeout(() => { locked = false; }, LOCK_MS);
  }

  /* ── WHEEL ──────────────────────────────────────── */
  stage.addEventListener('wheel', (e) => {
    withLock(() => activate(current + (e.deltaY > 0 ? 1 : -1)));
  }, { passive: true });

  /* ── TOUCH ──────────────────────────────────────── */
  let touchY0 = 0;
  stage.addEventListener('touchstart', (e) => {
    touchY0 = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const delta = touchY0 - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 45) return;
    withLock(() => activate(current + (delta > 0 ? 1 : -1)));
  }, { passive: true });

  /* ── KEYBOARD ───────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    const dir = { ArrowDown:1, ArrowUp:-1, ArrowRight:1, ArrowLeft:-1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    withLock(() => activate(current + dir));
  });

  /* ── DOT CLICKS ─────────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => withLock(() => activate(i)));
    dot.addEventListener('mouseenter', () => {
      navLabel.textContent = LABELS[i];
      navLabel.style.opacity = '1';
    });
    dot.addEventListener('mouseleave', () => {
      navLabel.style.opacity = '0';
    });
  });

  /* ── SCROLL BUTTON ──────────────────────────────── */
  const btnScroll = document.getElementById('btnScroll');
  if (btnScroll) {
    btnScroll.addEventListener('click', () =>
      withLock(() => activate(current + 1))
    );
  }

  /* ── INTERSECTION OBSERVER (sync on native scroll) ─ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
      const idx = panels.indexOf(entry.target);
      if (idx === -1 || idx === current) return;
      panels[current].classList.remove('is-active');
      dots[current].classList.remove('active');
      current = idx;
      panels[current].classList.add('is-active');
      dots[current].classList.add('active');
    });
  }, { root: stage, threshold: 0.6 });

  panels.forEach((p) => io.observe(p));

  /* ── CURSOR GLOW (rAF for zero jank) ─────────────── */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let curX = mouseX;
  let curY = mouseY;

  function animateCursor() {
    // lerp cursor glow  — very fast
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursorGlow.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;

    // lerp orb parallax — slow & dreamy
    orbX += (mouseX - orbX) * 0.018;
    orbY += (mouseY - orbY) * 0.018;
    const xOff = (orbX / window.innerWidth  - 0.5) * 40;
    const yOff = (orbY / window.innerHeight - 0.5) * 30;
    orbGold.style.transform = `translate3d(${xOff}px, ${yOff}px, 0)`;
    orbMint.style.transform  = `translate3d(${-xOff * .8}px, ${-yOff * .8}px, 0)`;

    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ── GRAIN CANVAS ─────────────────────────────────── */
  (function buildGrain() {
    const ctx  = grainCanvas.getContext('2d');
    const SIZE = 200;
    grainCanvas.width  = SIZE;
    grainCanvas.height = SIZE;

    const img = ctx.createImageData(SIZE, SIZE);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    // Tile the canvas via CSS
    grainCanvas.style.width  = '100%';
    grainCanvas.style.height = '100%';
    grainCanvas.style.imageRendering = 'pixelated';

    // Slow drift animation
    let gx = 0, gy = 0;
    function driftGrain() {
      gx = (gx + .3) % SIZE;
      gy = (gy + .15) % SIZE;
      grainCanvas.style.backgroundPosition = `${gx}px ${gy}px`;
      requestAnimationFrame(driftGrain);
    }
    // Skip drift — static grain is fine and cheaper
  })();

  /* ── START ────────────────────────────────────────── */
  init();

})();
    

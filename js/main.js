/* ── Cursor Glow ─────────────────────────────── */
(function () {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.left = '-300px';
    glow.style.top  = '-300px';
  });
})();

/* ── Particle Network Canvas ─────────────────── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles, raf;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width  = w * DPR;
    canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    const count = Math.min(Math.floor((w * h) / 11000), 72);
    particles = Array.from({ length: count }, () => ({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
      r: rand(0.8, 1.8), a: rand(0.18, 0.48)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 145) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(74,126,255,${(1 - d / 145) * 0.18})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,126,255,${p.a})`;
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
  }

  function loop() { draw(); update(); raf = requestAnimationFrame(loop); }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize(); initParticles(); loop();
  });

  resize(); initParticles(); loop();
})();

/* ── Typewriter ──────────────────────────────── */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'Desenvolvedor Front-end',
    'Analista de Dados',
    'Estudante de Sistemas de Informação',
    'Estudante de Ciência da Computação'
  ];

  let idx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[idx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 68);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 36);
    }
  }

  setTimeout(tick, 1000);
})();

/* ── Stats Counter ───────────────────────────── */
(function () {
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    (function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.stat-num').forEach(el => statsObs.observe(el));
})();

/* ── Skill Bar Fill ──────────────────────────── */
(function () {
  const fillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.width;
        fillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-bar-wrap').forEach(el => fillObs.observe(el));
})();

/* ── Card 3D Tilt ────────────────────────────── */
(function () {
  function initTilt(sel) {
    document.querySelectorAll(sel).forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.08s ease, border-color 0.3s, box-shadow 0.3s';
      });
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width  / 2;
        const y = e.clientY - rect.top  - rect.height / 2;
        const rx = (-y / rect.height) * 6;
        const ry = ( x / rect.width)  * 6;
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
        card.style.transform = '';
      });
    });
  }

  initTilt('.proj-card');
  initTilt('.cert-card');
  initTilt('.ss-card');
  initTilt('.tl-card');
})();

/* ── Scroll Reveal ───────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  const group = el.closest('[data-stagger]');
  if (group) {
    const siblings = group.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${idx * 80}ms`;
  }
  observer.observe(el);
});

/* ── Nav scroll ──────────────────────────────── */
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Active nav link ─────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(a => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const href = a.getAttribute('href');
  if (href === page || (page === 'index.html' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── Mobile menu ─────────────────────────────── */
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/* =========================================================
   BOOT LOADER
========================================================= */
(function loader() {
  const el = document.getElementById('loader');
  const linesEl = document.getElementById('loaderLines');
  const progressEl = document.getElementById('loaderProgress');
  const lines = [
    'INITIALIZING PORTFOLIO.EXE',
    'LOADING RENDER PIPELINE...',
    'AUTHENTICATING SESSION: cody_davis',
    'ESTABLISHING NEON UPLINK...',
    'STATUS: ALL SYSTEMS ONLINE',
  ];

  lines.forEach((text, i) => {
    const line = document.createElement('div');
    line.style.animationDelay = `${i * 0.28}s`;
    line.innerHTML = `<span>&gt;</span> ${text}`;
    linesEl.appendChild(line);
  });

  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 18 + 6);
    progressEl.style.width = pct + '%';
    if (pct >= 100) clearInterval(tick);
  }, 160);

  function dismiss() {
    el.classList.add('hidden');
    document.body.style.overflow = '';
    clearInterval(tick);
  }

  el.addEventListener('click', dismiss);
  setTimeout(dismiss, 1900);
  document.body.style.overflow = 'hidden';
})();

/* =========================================================
   CUSTOM CURSOR
========================================================= */
(function cursor() {
  if (window.matchMedia('(hover: none)').matches || window.innerWidth < 860) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let dx = 0, dy = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    dx = e.clientX; dy = e.clientY;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
  });

  function raf() {
    rx += (dx - rx) * 0.18;
    ry += (dy - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('[data-cursor-hover]').forEach((elm) => {
    elm.addEventListener('mouseenter', () => ring.classList.add('hover'));
    elm.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* =========================================================
   NAV: mobile toggle + scrollspy
========================================================= */
(function nav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('.section[id]')];

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinkEls.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
})();

/* =========================================================
   TYPEWRITER
========================================================= */
(function typewriter() {
  const el = document.getElementById('typewriter');
  const roles = ['Cloud Engineer', 'Full-Stack Builder', 'Automation Enthusiast', 'Problem Solver'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
})();

/* =========================================================
   SCROLL REVEAL
========================================================= */
(function reveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => io.observe(t));
})();

/* =========================================================
   TILT CARDS
========================================================= */
(function tiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = x / rect.width - 0.5;
      const cy = y / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-cy * 10}deg) rotateY(${cx * 10}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
})();

/* =========================================================
   SKILL SPHERE (pure CSS 3D tag cloud)
========================================================= */
(function skillSphere() {
  const sphere = document.getElementById('skillSphere');
  const tags = [
    'C', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
    'Node.js', 'Python', 'SQL', 'REST APIs',
    'AWS', 'IAM', 'CI/CD', 'Git', 'Linux', 'Networking',
  ];

  const N = tags.length;
  const radius = window.innerWidth < 700 ? 130 : 165;

  tags.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'sphere-tag';
    el.textContent = label;

    // Fibonacci sphere distribution
    const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    sphere.appendChild(el);
  });

  let rotX = -10, rotY = 0;
  let autoRotate = true;
  let lastX = 0, lastY = 0, dragging = false;

  function apply() {
    sphere.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function frame() {
    if (autoRotate) rotY += 0.15;
    apply();
    requestAnimationFrame(frame);
  }
  frame();

  const stage = sphere.closest('.sphere-perspective');

  const start = (x, y) => { dragging = true; autoRotate = false; lastX = x; lastY = y; };
  const move = (x, y) => {
    if (!dragging) return;
    rotY += (x - lastX) * 0.4;
    rotX -= (y - lastY) * 0.4;
    rotX = Math.max(-90, Math.min(90, rotX));
    lastX = x; lastY = y;
  };
  const end = () => { dragging = false; setTimeout(() => (autoRotate = true), 2200); };

  stage.addEventListener('mousedown', (e) => start(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  stage.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });
  stage.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });
  stage.addEventListener('touchend', end);
})();

/* =========================================================
   MISC
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

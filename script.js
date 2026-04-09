/* ═══════════════════════════════════════════════════════
   VIHANGA NIMSARA — portfolio script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Helpers ── */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ══════════════════════════════════════════════
   1. PARTICLE CANVAS
══════════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['rgba(0,240,255,', 'rgba(124,58,237,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + .4;
    this.vx = (Math.random() - .5) * .35;
    this.vy = (Math.random() - .5) * .35;
    this.alpha = Math.random() * .6 + .2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = 280 + Math.random() * 300;
  };
  Particle.prototype.draw = function() {
    this.life++;
    const fade = this.life < 40 ? this.life / 40
               : this.life > this.maxLife - 40 ? (this.maxLife - this.life) / 40
               : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + (this.alpha * fade) + ')';
    ctx.fill();
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
    if (this.life > this.maxLife) this.reset();
  };

  for (let i = 0; i < 110; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife); // stagger
    particles.push(p);
  }

  // Draw connections
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${(.06 * (1 - d / 90)).toFixed(3)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => p.draw());
    requestAnimationFrame(loop);
  })();
})();


/* ══════════════════════════════════════════════
   2. TYPEWRITER
══════════════════════════════════════════════ */
(function initTypewriter() {
  const el = $('#typedText');
  if (!el) return;
  const texts = [
    'Physics Undergrad',
    'Electronics Engineer',
    'Embedded Developer',
    'Python Scientist',
    'IoT Builder',
    'Curious Mind'
  ];
  let ti = 0, ci = 0, deleting = false, wait = 0;
  const SPEED_TYPE = 65, SPEED_DEL = 35, PAUSE = 2000;

  function tick() {
    const cur = texts[ti];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; wait = PAUSE; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; wait = 300; }
    }
    setTimeout(tick, wait || (deleting ? SPEED_DEL : SPEED_TYPE));
    wait = 0;
  }
  tick();
})();


/* ══════════════════════════════════════════════
   3. NAVBAR SCROLL & ACTIVE LINK
══════════════════════════════════════════════ */
(function initNavbar() {
  const nav    = $('#navbar');
  const links  = $$('.nav-link');
  const sections = $$('section[id]');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ══════════════════════════════════════════════
   4. HAMBURGER / MOBILE MENU
══════════════════════════════════════════════ */
(function initMobileMenu() {
  const btn  = $('#hamburger');
  const menu = $('#mobileMenu');
  const mob  = $$('.mob-link');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  mob.forEach(l => l.addEventListener('click', close));
})();


/* ══════════════════════════════════════════════
   5. DARK / LIGHT THEME TOGGLE
══════════════════════════════════════════════ */
(function initTheme() {
  const btn  = $('#themeToggle');
  const icon = $('#themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('vn-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('vn-theme', next);
  });
})();


/* ══════════════════════════════════════════════
   6. SMOOTH SCROLL (all anchor links)
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ══════════════════════════════════════════════
   7. INTERSECTION OBSERVER — REVEAL & BARS
══════════════════════════════════════════════ */
(function initReveal() {
  // Stagger .reveal-card children within each about-cards / blog-grid
  $$('.about-cards, .blog-grid, .projects-grid, .skills-layout, .contact-info-cards').forEach(parent => {
    [...parent.querySelectorAll('.reveal-card, .project-card, .skill-block, .blog-card, .contact-info-card')]
      .forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.09}s`;
        el.classList.add('reveal-card');
      });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-card').forEach(el => observer.observe(el));

  // Skill bars
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const profEl = $('.proficiency');
  if (profEl) barObserver.observe(profEl);
})();


/* ══════════════════════════════════════════════
   8. PROJECT FILTERS
══════════════════════════════════════════════ */
(function initFilters() {
  const btns  = $$('.filter-btn');
  const cards = $$('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        card.style.opacity    = show ? '' : '0';
        card.style.transform  = show ? '' : 'scale(.95)';
        card.style.display    = show ? '' : 'none';
      });
    });
  });
})();


/* ══════════════════════════════════════════════
   9. CONTACT FORM (EmailJS Integration)
══════════════════════════════════════════════ */
(function initForm() {
  const form = $('#contactForm');
  const fb   = $('#formFeedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('.submit-btn');
    
    // Visual feedback: Loading state
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      // sendForm requires: Service ID, Template ID, and the Form element
      const result = await emailjs.sendForm(
        'service_kws3lxb', 
        'template_kfsn73t', 
        form
      );

      if (result.status === 200) {
        fb.className  = 'form-feedback success';
        fb.textContent = '✓ Message sent! I\'ll get back to you soon.';
        form.reset();
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      fb.className  = 'form-feedback error';
      fb.textContent = '✗ Failed to send. Please try again later.';
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
      
      // Clear feedback after 5 seconds
      setTimeout(() => { 
        fb.textContent = ''; 
        fb.className = 'form-feedback'; 
      }, 5000);
    }
  });
})();


/* ══════════════════════════════════════════════
   10. CUSTOM CURSOR
══════════════════════════════════════════════ */
(function initCursor() {
  const cursor = $('#cursor');
  const trail  = $('#cursorTrail');
  if (!cursor || !trail) return;
  if (matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animate() {
    tx += (mx - tx) * .12;
    ty += (my - ty) * .12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll('a, button, .project-card, .skill-block').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      trail.style.transform  = 'translate(-50%,-50%) scale(.5)';
      trail.style.opacity    = '.8';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
      trail.style.opacity    = '.4';
    });
  });
})();

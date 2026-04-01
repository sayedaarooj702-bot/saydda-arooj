/* ============================================================
   SCRIPT.JS — Personal Portfolio
   Features: Loader, Custom Cursor, Typed Text, Smooth Scroll,
             Sticky Nav, Active Nav Link, AOS, Project Filter,
             Contact Form Validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================
     1. LOADER
  ======================================================== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });

  /* ========================================================
     2. CUSTOM CURSOR
  ======================================================== */
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  let mouseX = 0, mouseY = 0, outX = 0, outY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outline trail
  function animateCursor() {
    outX += (mouseX - outX) * 0.15;
    outY += (mouseY - outY) * 0.15;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand on hover over clickable elements
  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.style.width  = '60px';
      outline.style.height = '60px';
      outline.style.borderColor = 'var(--tomato-glow)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.width  = '36px';
      outline.style.height = '36px';
      outline.style.borderColor = 'var(--blue-glow)';
    });
  });

  /* ========================================================
     3. TYPED TEXT EFFECT
  ======================================================== */
  const roles  = ['Web Developer', 'UI Designer', 'Problem Solver', 'web designer'];
  const typedEl = document.getElementById('typedText');
  let rIdx = 0, cIdx = 0, isDeleting = false;

  function type() {
    const current = roles[rIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, cIdx--);
      if (cIdx < 0) { isDeleting = false; rIdx = (rIdx + 1) % roles.length; setTimeout(type, 400); return; }
      setTimeout(type, 60);
    } else {
      typedEl.textContent = current.substring(0, cIdx++);
      if (cIdx > current.length) { isDeleting = true; setTimeout(type, 1800); return; }
      setTimeout(type, 120);
    }
  }
  setTimeout(type, 800);

  /* ========================================================
     4. STICKY HEADER ON SCROLL
  ======================================================== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ========================================================
     5. HAMBURGER MENU
  ======================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========================================================
     6. ACTIVE NAV LINK ON SCROLL
  ======================================================== */
  const sections   = document.querySelectorAll('.section');
  const allLinks   = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));

  /* ========================================================
     7. AOS — ANIMATE ON SCROLL
  ======================================================== */
  const aosEls = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        // stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
        siblings.forEach((el, i) => {
          el.style.transitionDelay = `${i * 0.1}s`;
        });
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  aosEls.forEach(el => aosObserver.observe(el));

  /* ========================================================
     8. PROJECT FILTER
  ======================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // re-trigger entrance animation
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ========================================================
     9. CONTACT FORM VALIDATION
  ======================================================== */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function showError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('error');
    error.textContent = msg;
  }
  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.remove('error');
    error.textContent = '';
  }

  // Live clear on input
  ['name', 'email', 'message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => clearError(id, id + 'Error'));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    clearError('name', 'nameError');
    clearError('email', 'emailError');
    clearError('message', 'messageError');

    if (!name) { showError('name', 'nameError', 'Please enter your name.'); valid = false; }
    if (!email) {
      showError('email', 'emailError', 'Please enter your email.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'emailError', 'Enter a valid email address.'); valid = false;
    }
    if (!message) { showError('message', 'messageError', 'Please write a message.'); valid = false; }

    if (valid) {
      const btn     = form.querySelector('.btn');
      const btnText = form.querySelector('.btn-text');
      btn.disabled  = true;
      btnText.textContent = 'Sending…';

      // Simulate send (replace with real API call e.g. EmailJS / Formspree)
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 4000);
      }, 1400);
    }
  });

  /* ========================================================
     10. FOOTER YEAR
  ======================================================== */
  document.getElementById('year').textContent = new Date().getFullYear();
  /* ========================================================
   SKILL BARS — animate when scrolled into view
======================================================== */
const skillBars = document.querySelectorAll('.skill-bar-fill');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

});
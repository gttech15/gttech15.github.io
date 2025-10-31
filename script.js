/* script.js
   Handles:
   - Navigation toggle
   - Theme toggle (dark/light) persisted to localStorage
   - Typing / hero animation
   - Scroll reveal for sections
   - Skill bar animation
   - Simple contact form validation with honeypot
*/

/* Helper: query selector */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // Populate copyright years
  const year = new Date().getFullYear();
  ['year','year-about','year-contact'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = year;
  });

  // NAV toggles (applies to multiple pages)
  $$('[id^=nav-toggle]').forEach(btn => {
    const targetId = btn.getAttribute('aria-controls');
    const menu = document.getElementById(targetId);
    btn.addEventListener('click', () => {
      const visible = menu.getAttribute('data-visible') === 'true';
      menu.setAttribute('data-visible', String(!visible));
      btn.setAttribute('aria-expanded', String(!visible));
    });
  });

  // THEME toggle: uses data-theme on body and localStorage
  const THEME_KEY = 'gt-tech-theme';
  const applyTheme = (t) => {
    document.body.setAttribute('data-theme', t);
    const buttons = $$('[id^=theme-toggle]');
    buttons.forEach(b => {
      b.setAttribute('aria-pressed', String(t === 'dark'));
      b.textContent = t === 'dark' ? 'Dark' : 'Light';
    });
  };
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);

  $$('[id^=theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      // animate transition
      document.body.classList.add('theme-transition');
      window.setTimeout(() => document.body.classList.remove('theme-transition'), 600);
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });

  // Simple typing effect for hero -- non-blocking & accessible
  const typedEl = document.querySelector('.typed');
  if(typedEl){
    const text = typedEl.getAttribute('data-text') || typedEl.textContent;
    typedEl.textContent = '';
    let i = 0;
    const speed = 26; // ms per char (fast but visible)
    const type = () => {
      if(i <= text.length){
        typedEl.textContent = text.slice(0, i);
        i++;
        setTimeout(type, speed);
      }
    };
    setTimeout(type, 300); // small delay before typing
  }

  // Scroll reveal using IntersectionObserver
  const revealEl = el => {
    el.classList.add('reveal');
    if(el.dataset && el.dataset.revealOnce === "true"){
      observer.unobserve(el);
    }
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        revealEl(entry.target);
      }
    });
  }, {threshold:0.12});

  // Attach reveal to sections and cards
  $$('section, .card, .project-card, .timeline-item, .skill').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 640ms ease, transform 640ms cubic-bezier(.2,.9,.3,1)';
    observer.observe(el);
  });

  // When reveal class is added, animate to visible
  const handleReveals = () => {
    $$('section, .card, .project-card, .timeline-item, .skill').forEach(el => {
      if(el.classList.contains('reveal')){
        el.style.opacity = 1;
        el.style.transform = 'none';
      }
    });
  };
  // Keep checking - simple loop to apply revealed styles when they appear
  const revealInterval = setInterval(handleReveals, 120);
  // Stop after some seconds (cleanup)
  setTimeout(()=>clearInterval(revealInterval), 4000);

  // Skill bars animation when visible
  const animateSkills = () => {
    $$('.skill-bar').forEach(bar => {
      const percent = Number(bar.dataset.percent) || 0;
      const fill = bar.querySelector('.skill-fill');
      const valEl = bar.previousElementSibling?.querySelector('.skill-value');
      if(fill && !fill.dataset.animated){
        fill.style.width = percent + '%';
        fill.dataset.animated = 'true';
        if(valEl){
          // animate counter
          const target = Number(valEl.dataset.value) || percent;
          let cur = 0;
          const step = Math.max(1, Math.round(target / 30));
          const t = setInterval(() => {
            cur += step;
            if(cur >= target){
              cur = target;
              clearInterval(t);
            }
            valEl.textContent = cur + '%';
          }, 24);
        }
      }
    });
  };
  // Use intersection observer to trigger skills animation
  const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        animateSkills();
        skillsObserver.unobserve(e.target);
      }
    });
  }, {threshold:0.25});
  const skillsSection = document.getElementById('skills-heading');
  if(skillsSection) skillsObserver.observe(skillsSection);

  // CONTACT form validation and simple "send" simulation
  const form = document.getElementById('contact-form');
  if(form){
    const status = document.getElementById('form-status');
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Honeypot check
      const hp = form.querySelector('#website');
      if(hp && hp.value){
        // likely bot - silently ignore and show generic failure
        status.textContent = 'Failed to send message.';
        return;
      }
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      if(!name.value.trim() || !email.value.trim() || !message.value.trim()){
        status.textContent = 'Please complete required fields.';
        status.style.color = 'var(--accent-2)';
        return;
      }
      // basic email format check
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRx.test(email.value)){
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      // Simulate send with animated success
      status.textContent = 'Sending...';
      setTimeout(() => {
        form.reset();
        status.textContent = 'Message sent. Thank you — I will reply shortly.';
      }, 900);
    });
  }

  // Keyboard accessibility: close nav on Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      $$('[data-visible="true"]').forEach(menu => {
        menu.setAttribute('data-visible', 'false');
      });
      $$('[aria-expanded="true"]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    }
  });

  // Lightweight: detect reduced motion and disable animations if required
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    document.documentElement.style.scrollBehavior = 'auto';
    // stop background animation
    document.querySelectorAll('.hero-bg').forEach(el => el.style.animation = 'none');
  }
});

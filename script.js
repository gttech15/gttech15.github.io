// script.js - GT-TECH interactions (menu, theme, modal, skill bars, contact form)

document.addEventListener('DOMContentLoaded', () => {
  // dynamic year
  ['year','year2','year3','year4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().getFullYear();
  });

  // nav toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('show'));
    Array.from(nav.querySelectorAll('a')).forEach(a => a.addEventListener('click', () => nav.classList.remove('show')));
  }

  // theme toggle (dark/light/auto)
  const darkToggle = document.getElementById('dark-toggle');
  const body = document.body;
  const saved = localStorage.getItem('gt-theme');
  if (saved === 'light') body.classList.add('light');
  if (saved === 'dark') body.classList.remove('light');

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isLight = body.classList.toggle('light');
      localStorage.setItem('gt-theme', isLight ? 'light' : 'dark');
    });
  }

  // staggered animations
  document.querySelectorAll('.animate-fade, .animate-slide-up, .animate-zoom, .animate-pop').forEach((el, i) => {
    el.style.animationDelay = (i * 80) + 'ms';
  });

  // modal logic for projects
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');
  const modalClose = document.getElementById('modal-close');

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      modalLink.href = card.dataset.link;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // skill bars
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const val = parseInt(bar.dataset.value || '0', 10);
    const inner = bar.querySelector('span');
    if (inner) {
      inner.style.width = '0%';
      setTimeout(() => inner.style.width = val + '%', 300);
    }
  });

  // contact form (client-side demo)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const hp = document.getElementById('hp_field');
      if (hp && hp.value) {
        setFormMsg('Spam detected.', 'red');
        return;
      }
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !subject || !message) {
        setFormMsg('Please fill in all required fields.', 'red');
        return;
      }
      setFormMsg('✅ Message submitted (demo). To enable real emails, wire to Formspree or EmailJS.', 'green');
      form.reset();
    });
  }

  function setFormMsg(text, color='green'){
    const el = document.getElementById('form-msg');
    if (el){ el.textContent = text; el.style.color = color; }
  }
});

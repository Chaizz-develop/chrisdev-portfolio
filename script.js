/* =========================================================
   CHRISDEV PORTFOLIO — SCRIPT
   ---------------------------------------------------------
   🔐 CHANGE THE PASSWORD on line 1 before publishing!
   ========================================================= */

const OWNER_PASSWORD = '666888';   // ← CHANGE THIS

const STORAGE_KEYS = {
  theme: 'chrisdev_theme',
  texts: 'chrisdev_texts',
  items: 'chrisdev_items',
  photo: 'chrisdev_photo',
  cv:    'chrisdev_cv',
  unlocked: 'chrisdev_unlocked',
};

const PLACEHOLDER_COLORS = {
  web:        ['#3b82f6', '#1e40af'],
  design:     ['#ef4444', '#b91c1c'],
  organisasi: ['#60a5fa', '#3b82f6'],
  prestasi:   ['#f87171', '#ef4444'],
};

/* =========================================================
   DEFAULT PORTFOLIO DATA
   ========================================================= */
const DEFAULT_PORTFOLIOS = [
  {
    id: 'p1',
    title: 'School Profile Website',
    category: 'web',
    desc: 'Served as Front-End Developer in a 4-person team. Responsible for building responsive interfaces, integrating navigation, and optimizing mobile performance.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'p2',
    title: 'Event Poster Design',
    category: 'design',
    desc: 'Lead Designer for the school\'s annual event. Fully responsible for the visual concept, typography, and layout using Figma.',
    tags: ['Figma', 'Typography', 'Color Theory'],
  },
  {
    id: 'p3',
    title: 'Event Committee Chair',
    category: 'organisasi',
    desc: 'Led a 20+ member committee. Responsible for setting the timeline, coordinating 4 divisions, and evaluating the entire event flow.',
    tags: ['Leadership', 'Teamwork', 'Event Management'],
  },
  {
    id: 'p4',
    title: '2nd Place — Provincial Web Design Contest',
    category: 'prestasi',
    desc: 'Won 2nd place in a provincial-level web design competition. Acted as solo developer — designed and built a landing page focused on UX and interactive animation.',
    tags: ['Web Design', 'Competition'],
  },
  {
    id: 'p5',
    title: 'To-Do List Web App',
    category: 'web',
    desc: 'Personal project — a to-do list app built with vanilla JavaScript. Sole developer: implemented DOM manipulation, localStorage, and a clean UI.',
    tags: ['JavaScript', 'LocalStorage', 'UI'],
  },
  {
    id: 'p6',
    title: 'Photography Club Member',
    category: 'organisasi',
    desc: 'Active member of the photography club for 2 years. Served as documentation photographer at 5+ school events and assisted with editing and gallery publishing.',
    tags: ['Photography', 'Editing', 'Documentation'],
  },
];

const DEFAULT_PHOTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b82f6"/><stop offset="0.5" stop-color="#050508"/>
      <stop offset="1" stop-color="#ef4444"/>
    </linearGradient></defs>
    <rect width="400" height="400" fill="#10101c"/>
    <circle cx="200" cy="155" r="65" fill="url(#g)"/>
    <ellipse cx="200" cy="360" rx="115" ry="95" fill="url(#g)"/>
  </svg>`
);

/* =========================================================
   UTILITIES
   ========================================================= */
const $  = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const isOwner = () => document.body.classList.contains('is-owner');
const isEditMode = () => document.body.classList.contains('edit-mode');

const escapeXml = (str) => String(str).replace(/[<>&"']/g, (s) =>
  ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[s]));

function makePlaceholder(title, category) {
  const [c1, c2] = PLACEHOLDER_COLORS[category] || ['#3b82f6', '#ef4444'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="600" height="400" fill="#10101c"/>
    <rect width="600" height="400" fill="url(#g)" opacity="0.85"/>
    <text x="300" y="200" font-family="Arial" font-size="26" font-weight="800"
      fill="white" text-anchor="middle" dominant-baseline="middle">${escapeXml(title)}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getStoredItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.items);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveItems(items) {
  try { localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items)); }
  catch (e) { console.warn('Storage full:', e); }
}

function compressImage(file, maxSize = 900, quality = 0.78) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const r = Math.min(maxSize / width, maxSize / height);
          width *= r; height *= r;
        }
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        c.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* =========================================================
   1. THEME
   ========================================================= */
function initTheme() {
  if (localStorage.getItem(STORAGE_KEYS.theme) === 'light') {
    document.body.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}
function updateThemeIcon() {
  $('#themeToggle').textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
}
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  document.documentElement.classList.toggle('dark', !isLight);
  localStorage.setItem(STORAGE_KEYS.theme, isLight ? 'light' : 'dark');
  updateThemeIcon();
}

/* =========================================================
   2. NAVBAR
   ========================================================= */
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  $$('.nav-link, .mobile-link').forEach((a) => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

function updateActiveNav() {
  const pos = window.scrollY + 120;
  $$('section[id]').forEach((sec) => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const links = $$(`.nav-link[href="#${sec.id}"], .mobile-link[href="#${sec.id}"]`);
    links.forEach((l) => l.classList.toggle('active', pos >= top && pos < bottom));
  });
}

/* =========================================================
   3. PASSWORD PROTECTION + EDIT MODE
   ========================================================= */
function initEditMode() {
  const pwdModal = $('#passwordModal');
  const pwdForm = $('#passwordForm');
  const pwdInput = $('#pwdInput');
  const pwdError = $('#pwdError');

  // Restore unlock state within the same session
  if (sessionStorage.getItem(STORAGE_KEYS.unlocked) === '1') {
    document.body.classList.add('is-owner');
  }

  // Attach contenteditable-blur handlers once (harmless when not editing)
  $$('[data-key]').forEach((el) => {
    el.addEventListener('blur', () => saveText(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && /^H[1-6]$/.test(el.tagName)) {
        e.preventDefault();
        el.blur();
      }
    });
  });

  // Main edit button: unlock with password OR toggle edit mode
  $('#editToggle').addEventListener('click', () => {
    if (!isOwner()) { openPwdModal(); return; }
    const on = document.body.classList.toggle('edit-mode');
    $$('[data-key]').forEach((el) => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
      if (!on) el.blur();
    });
    showToast(on ? '✏️ Edit Mode ON — click any text to modify.' : 'Edit Mode off.');
  });

  // Open / close password modal
  function openPwdModal() {
    pwdForm.reset();
    pwdError.textContent = '';
    pwdModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => pwdInput.focus(), 120);
  }
  function closePwdModal() {
    pwdModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  $('#pwdClose').addEventListener('click', closePwdModal);
  $('#pwdCancel').addEventListener('click', closePwdModal);
  pwdModal.addEventListener('click', (e) => { if (e.target === pwdModal) closePwdModal(); });

  // Password submit
  pwdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = pwdInput.value.trim();
    if (input === OWNER_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEYS.unlocked, '1');
      document.body.classList.add('is-owner');
      document.body.classList.add('edit-mode');
      $$('[data-key]').forEach((el) => el.setAttribute('contenteditable', 'true'));
      closePwdModal();
      showToast('🔓 Unlocked! Edit Mode is ON.');
    } else {
      pwdError.textContent = 'Incorrect password. Try again.';
      pwdInput.value = '';
      pwdInput.focus();
    }
  });

  // Lock (logout)
  $('#lockBtn').addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEYS.unlocked);
    document.body.classList.remove('is-owner', 'edit-mode');
    $$('[data-key]').forEach((el) => {
      el.setAttribute('contenteditable', 'false');
      el.blur();
    });
    showToast('🔒 Locked. Password required again to edit.');
  });

  // Reset local edits
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Remove all local edits? Page will reload.')) return;
    [STORAGE_KEYS.texts, STORAGE_KEYS.items, STORAGE_KEYS.photo, STORAGE_KEYS.cv]
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  });
}

function saveText(el) {
  if (!isOwner()) return;
  const key = el.dataset.key;
  if (!key) return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.texts) || '{}');
    all[key] = el.innerHTML;
    localStorage.setItem(STORAGE_KEYS.texts, JSON.stringify(all));
  } catch (_) {}
  if (key.startsWith('contact')) updateContactLinks();
}

function loadTexts() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.texts) || '{}'); } catch (_) {}
  $$('[data-key]').forEach((el) => {
    const key = el.dataset.key;
    if (saved[key] !== undefined) el.innerHTML = saved[key];
  });
  updateContactLinks();
}

function updateContactLinks() {
  const setHref = (key, fn) => {
    const el = $(`[data-key="${key}"]`);
    if (!el) return;
    const a = el.closest('a');
    if (a) a.href = fn(el.textContent.trim());
  };
  setHref('contactEmail', (v) => 'mailto:' + v);
  setHref('contactLinkedin', (v) => /^https?:\/\//.test(v) ? v : 'https://' + v);
  setHref('contactIg', (v) => 'https://instagram.com/' + v.replace(/^@/, ''));
  setHref('contactWa', (v) => 'https://wa.me/' + v.replace(/[^0-9]/g, ''));
}

/* =========================================================
   4. PHOTO
   ========================================================= */
function initPhoto() {
  const img = $('#profilePhoto');
  img.src = localStorage.getItem(STORAGE_KEYS.photo) || DEFAULT_PHOTO;

  const btn = $('#photoEditBtn');
  const input = $('#photoInput');

  btn.addEventListener('click', () => {
    if (!isOwner() || !isEditMode()) {
      showToast('Unlock Edit Mode first (✏️).');
      return;
    }
    input.click();
  });

  input.addEventListener('change', async (e) => {
    if (!isOwner()) return;
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 600, 0.85);
      img.src = dataUrl;
      localStorage.setItem(STORAGE_KEYS.photo, dataUrl);
      showToast('Profile photo updated!');
    } catch (_) { alert('Failed to load image.'); }
    input.value = '';
  });
}

/* =========================================================
   5. CV
   ========================================================= */
function initCV() {
  const link = $('#cvDownload');
  const input = $('#cvLinkInput');
  const saved = localStorage.getItem(STORAGE_KEYS.cv);

  if (saved) {
    link.href = saved;
    /^https?:\/\//.test(saved) ? link.removeAttribute('download') : link.setAttribute('download', '');
    input.value = saved;
  } else {
    input.value = link.getAttribute('href');
  }

  input.addEventListener('change', () => {
    if (!isOwner()) return;
    const v = input.value.trim() || 'cv.pdf';
    link.href = v;
    /^https?:\/\//.test(v) ? link.removeAttribute('download') : link.setAttribute('download', '');
    localStorage.setItem(STORAGE_KEYS.cv, v);
    showToast('CV link updated.');
  });
}

/* =========================================================
   6. PORTFOLIO
   ========================================================= */
let portfolioItems = [];
let currentFilter = 'all';
let editingImageData = null;
let editingImageUrl = '';

function initPortfolio() {
  const stored = getStoredItems();
  portfolioItems = stored && Array.isArray(stored) && stored.length
    ? stored
    : JSON.parse(JSON.stringify(DEFAULT_PORTFOLIOS));

  renderPortfolio();
  initFilter();
  initPortfolioModal();
}

function renderPortfolio() {
  const grid = $('#portfolioGrid');
  grid.innerHTML = '';

  const list = portfolioItems.filter((it) => currentFilter === 'all' || it.category === currentFilter);

  if (!list.length) {
    grid.innerHTML = `<div class="portfolio-empty">
      <p class="font-semibold text-base mb-1">No portfolio items in this category yet.</p>
      <p class="text-sm opacity-70">${isOwner() ? 'Enable Edit Mode (✏️) to add one.' : ''}</p>
    </div>`;
    return;
  }

  list.forEach((item, i) => {
    const image = item.image || makePlaceholder(item.title, item.category);
    const card = document.createElement('article');
    card.className = 'pf-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML = `
      <div class="pf-img-wrap">
        <img src="${image}" alt="${escapeXml(item.title)}" loading="lazy" />
        <span class="pf-cat-badge">${escapeXml(item.category)}</span>
        <button class="pf-edit" data-id="${item.id}" title="Edit">✎</button>
        <button class="pf-delete" data-id="${item.id}" title="Delete">✕</button>
      </div>
      <div class="pf-body">
        <h3 class="pf-title">${escapeXml(item.title)}</h3>
        <p class="pf-desc">${escapeXml(item.desc)}</p>
        <div class="pf-tags">
          ${(item.tags || []).map((t) => `<span class="tag">${escapeXml(t)}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  $$('.pf-delete', grid).forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!isOwner() || !isEditMode()) return;
      if (!confirm('Delete this portfolio item?')) return;
      portfolioItems = portfolioItems.filter((it) => it.id !== btn.dataset.id);
      saveItems(portfolioItems);
      renderPortfolio();
      showToast('Portfolio item deleted.');
    });
  });

  $$('.pf-edit', grid).forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!isOwner() || !isEditMode()) return;
      openEditPortfolio(btn.dataset.id);
    });
  });
}

function initFilter() {
  $$('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderPortfolio();
    });
  });
}

function initPortfolioModal() {
  const modal = $('#portfolioModal');
  const form = $('#portfolioForm');
  const imgInput = $('#pfImage');

  $('#addPortfolioBtn').addEventListener('click', () => {
    if (!isOwner() || !isEditMode()) {
      showToast('Enable Edit Mode (✏️) first.');
      return;
    }
    openAddPortfolio();
  });

  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  imgInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { editingImageData = await compressImage(file, 800, 0.75); }
    catch (_) { alert('Failed to load image.'); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isOwner()) return;
    const id = $('#pfId').value;
    const item = {
      id: id || 'p_' + Date.now(),
      title: $('#pfTitle').value.trim(),
      category: $('#pfCategory').value,
      desc: $('#pfDesc').value.trim(),
      tags: $('#pfTags').value.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editingImageData) item.image = editingImageData;
    else if (editingImageUrl) item.image = editingImageUrl;

    if (id) {
      const idx = portfolioItems.findIndex((it) => it.id === id);
      if (idx > -1) portfolioItems[idx] = { ...portfolioItems[idx], ...item };
    } else {
      portfolioItems.unshift(item);
    }
    saveItems(portfolioItems);
    renderPortfolio();
    closeModal();
    showToast(id ? 'Portfolio updated!' : 'Portfolio added!');
  });

  function openAddPortfolio() {
    form.reset();
    $('#pfId').value = '';
    editingImageData = null;
    editingImageUrl = '';
    $('#modalTitle').textContent = 'Add Portfolio';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openEditPortfolio(id) {
    const item = portfolioItems.find((it) => it.id === id);
    if (!item) return;
    $('#pfId').value = item.id;
    $('#pfTitle').value = item.title;
    $('#pfCategory').value = item.category;
    $('#pfDesc').value = item.desc;
    $('#pfTags').value = (item.tags || []).join(', ');
    $('#pfImageUrl').value = '';
    $('#pfImage').value = '';
    editingImageData = null;
    editingImageUrl = item.image && item.image.startsWith('data:') ? '' : (item.image || '');
    $('#modalTitle').textContent = 'Edit Portfolio';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.openEditPortfolio = openEditPortfolio;
}

/* =========================================================
   7. CONTACT FORM
   ========================================================= */
function initContactForm() {
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const to = ($('[data-key="contactEmail"]')?.textContent || 'email@you.com').trim();
    const subject = data.get('subject');
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const note = $('#formNote');
    note.textContent = 'Opening your email app...';
    note.style.color = '#10b981';
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 4000);
  });
}

/* =========================================================
   8. REVEAL + COUNTER
   ========================================================= */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => io.observe(el));

  const cIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      cIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  $$('.stat-num').forEach((c) => cIo.observe(c));
}

/* =========================================================
   9. TOAST
   ========================================================= */
let toastTimer;
function showToast(msg) {
  let t = $('#pfToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'pfToast';
    t.style.cssText = `
      position: fixed; bottom: 20px; left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: linear-gradient(135deg, #3b82f6, #ef4444);
      color: white; padding: 13px 22px; border-radius: 12px;
      font-size: 0.88rem; font-weight: 700;
      box-shadow: 0 12px 40px rgba(59,130,246,0.5);
      z-index: 999; opacity: 0; transition: all 0.35s ease;
      max-width: 88vw; text-align: center;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(80px)';
  }, 3400);
}

/* =========================================================
   10. INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initEditMode();
  loadTexts();
  initPhoto();
  initCV();
  initPortfolio();
  initContactForm();
  initReveal();

  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#year').textContent = new Date().getFullYear();
  updateActiveNav();
});
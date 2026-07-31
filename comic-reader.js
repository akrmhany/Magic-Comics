const comicId = new URLSearchParams(window.location.search).get('id') || 'metalic';

const comicTitleMap = {
  metalic: 'ميتاليك #1',
};

const totalPagesMap = {
  metalic: 32,
};

const reader = document.getElementById('comic-reader');
const readerStatus = document.getElementById('reader-status');
const comicTitle = document.getElementById('comic-title');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');

if (!reader || !readerStatus || !comicTitle || !modal || !modalImage || !modalClose || !scrollTopBtn) {
  throw new Error('Comic reader failed to initialize: missing required elements.');
}

const title = comicTitleMap[comicId] || comicId;
comicTitle.textContent = title;
document.title = `Magic-Comics | ${title}`;

const startPage = Number(localStorage.getItem(`magic-comics-${comicId}-last-page`) || 0);
const totalPages = totalPagesMap[comicId] ?? 32;

function pageAlt(pageNumber) {
  return pageNumber === 0 ? `${title} - الغلاف` : `${title} - صفحة ${pageNumber}`;
}

function getImageSources(pageNumber) {
  const base = `comics/${comicId}/${pageNumber}`;
  return [
    `${base}.webp`,
    `${base}.jpg`,
    `${base}.jpeg`,
    `${base}.png`,
  ];
}

function setStatus(text) {
  readerStatus.textContent = text;
}

function openModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modalImage.src = '';
  modalImage.alt = 'عرض مكبر للصفحة';
}

function markLoaded(wrapper, pageNumber) {
  if (wrapper.dataset.loaded === 'true') return;
  wrapper.dataset.loaded = 'true';
  wrapper.classList.add('is-loaded');
  localStorage.setItem(`magic-comics-${comicId}-last-page`, String(pageNumber));
  setStatus(`تم تحميل الصفحة ${pageNumber}`);
}

function handleImageError(img, wrapper, pageNumber) {
  const sources = (img.dataset.sources || '').split('|').filter(Boolean);
  sources.shift();
  img.dataset.sources = sources.join('|');

  if (sources.length > 0) {
    img.src = sources[0];
    return;
  }

  wrapper.remove();
  setStatus(`اكتمل تحميل العدد حتى الصفحة ${Math.max(0, pageNumber - 1)}`);
}

function makePage(pageNumber) {
  const wrapper = document.createElement('div');
  wrapper.className = 'comic-page';
  wrapper.dataset.page = String(pageNumber);
  wrapper.dataset.loaded = 'false';

  const skeleton = document.createElement('div');
  skeleton.className = 'page-skeleton';

  const img = document.createElement('img');
  img.loading = pageNumber === 0 ? 'eager' : 'lazy';
  img.decoding = 'async';
  img.alt = pageAlt(pageNumber);
  img.dataset.page = String(pageNumber);

  const sources = getImageSources(pageNumber);
  img.dataset.sources = sources.join('|');
  img.src = sources[0];

  img.addEventListener('load', () => {
    markLoaded(wrapper, pageNumber);
  });

  img.addEventListener('error', () => {
    handleImageError(img, wrapper, pageNumber);
  });

  img.addEventListener('click', () => openModal(img.currentSrc || img.src, img.alt));

  wrapper.appendChild(skeleton);
  wrapper.appendChild(img);
  return wrapper;
}

function renderComic() {
  reader.innerHTML = '';
  setStatus('جارِ تحميل الصفحات...');

  for (let page = 0; page <= totalPages; page += 1) {
    reader.appendChild(makePage(page));
  }
}

function enableMenuToggle() {
  if (!menuToggle || !navLinks) return;
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function bindModalEvents() {
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

enableMenuToggle();
bindModalEvents();
renderComic();

if (startPage > 0) {
  window.setTimeout(() => {
    const pageEl = document.querySelector(`[data-page="${startPage}"]`);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
}

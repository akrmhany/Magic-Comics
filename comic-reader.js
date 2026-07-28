const comicId = new URLSearchParams(window.location.search).get("id") || "metalic";
const comicTitleMap = {
  metalic: "ميتاليك #1"
};
const totalPagesMap = {
  metalic: 32
};

const reader = document.getElementById("comic-reader");
const readerStatus = document.getElementById("reader-status");
const comicTitle = document.getElementById("comic-title");
const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const modalClose = document.getElementById("modal-close");
const scrollTopBtn = document.getElementById("scroll-top-btn");

comicTitle.textContent = comicTitleMap[comicId] || comicId;
document.title = `Magic-Comics | ${comicTitle.textContent}`;

const startPage = Number(localStorage.getItem(`magic-comics-${comicId}-last-page`) || 0);
const totalPages = totalPagesMap[comicId] ?? 32;
let lastVisiblePage = startPage;

function openModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

function makePage(pageNumber) {
  const wrapper = document.createElement("div");
  wrapper.className = "comic-page";

  const skeleton = document.createElement("div");
  skeleton.className = "page-skeleton";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = pageNumber === 0 ? `${comicTitle.textContent} - الغلاف` : `${comicTitle.textContent} - صفحة ${pageNumber}`;
  img.dataset.page = String(pageNumber);
  img.src = `comics/${comicId}/${pageNumber}.webp`;

  img.addEventListener("load", () => {
    wrapper.classList.add("is-loaded");
    readerStatus.textContent = `تم تحميل الصفحة ${pageNumber}`;
    lastVisiblePage = pageNumber;
    localStorage.setItem(`magic-comics-${comicId}-last-page`, String(pageNumber));
  });

  img.addEventListener("error", () => {
    wrapper.remove();
    readerStatus.textContent = `اكتمل تحميل العدد حتى الصفحة ${Math.max(0, pageNumber - 1)}`;
  });

  img.addEventListener("click", () => openModal(img.src, img.alt));

  wrapper.appendChild(skeleton);
  wrapper.appendChild(img);
  return wrapper;
}

function renderComic() {
  reader.innerHTML = "";
  readerStatus.textContent = "جارِ تحميل الصفحات...";

  for (let page = 0; page <= totalPages; page++) {
    reader.appendChild(makePage(page));
  }
}

scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

renderComic();
if (startPage > 0) {
  setTimeout(() => {
    const pageEl = document.querySelector(`[data-page="${startPage}"]`);
    if (pageEl) pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
}

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("show");
}

  // Toggle mobile menu
  (function mobileMenu(){
    const toggle = qs('#menu-toggle');
    const nav = qs('#nav-links');
    if(!toggle || !nav) return;
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
    });
  })();

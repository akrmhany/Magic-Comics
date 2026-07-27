const comicId = new URLSearchParams(window.location.search).get("id") || "metalic";
const comicTitleMap = {
  metalic: "ميتاليك #1"
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
  wrapper.dataset.page = String(pageNumber);

  const skeleton = document.createElement("div");
  skeleton.className = "page-skeleton";

  const img = document.createElement("img");
  img.loading = "eager";
  img.decoding = "async";
  img.alt = pageNumber === 0 ? `${comicTitle.textContent} - الغلاف` : `${comicTitle.textContent} - صفحة ${pageNumber}`;
  img.src = `comics/${comicId}/${pageNumber}.jpg`;

  img.addEventListener("load", () => {
    wrapper.classList.add("is-loaded");
    readerStatus.textContent = `تم تحميل الصفحة ${pageNumber}`;
    lastVisiblePage = pageNumber;
    localStorage.setItem(`magic-comics-${comicId}-last-page`, String(pageNumber));
  });

  img.addEventListener("error", () => {
    const numericPage = pageNumber;
    if (numericPage === 0) {
      readerStatus.textContent = "تعذر تحميل الغلاف";
      wrapper.remove();
      return;
    }

    wrapper.remove();
    readerStatus.textContent = `اكتمل تحميل العدد حتى الصفحة ${Math.max(0, numericPage - 1)}`;
  });

  img.addEventListener("click", () => openModal(img.src, img.alt));

  wrapper.appendChild(skeleton);
  wrapper.appendChild(img);
  return wrapper;
}

function renderComic() {
  reader.innerHTML = "";
  readerStatus.textContent = "جارِ تحميل الصفحات...";

  const maxProbe = 500;
  const fragment = document.createDocumentFragment();

  for (let page = 0; page <= maxProbe; page++) {
    fragment.appendChild(makePage(page));
  }

  reader.appendChild(fragment);
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
if (lastVisiblePage > 0) {
  setTimeout(() => {
    const pageEl = document.querySelector(`[data-page="${lastVisiblePage}"]`);
    if (pageEl) pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 500);
}

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("show");
}
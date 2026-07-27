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
let pagesToLoad = new Set([0]);
let loadedCount = 0;

function openModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.style.overflow = "";
}

function makePage(pageNumber) {
  const wrapper = document.createElement("div");
  wrapper.className = "comic-page";
  wrapper.dataset.page = String(pageNumber);

  const skeleton = document.createElement("div");
  skeleton.className = "page-skeleton";

  const img = document.createElement("img");
  img.loading = pageNumber === 0 ? "eager" : "lazy";
  img.decoding = "async";
  img.alt = pageNumber === 0 ? `${comicTitle.textContent} - الغلاف` : `${comicTitle.textContent} - صفحة ${pageNumber}`;
  img.src = `comics/${comicId}/${pageNumber}.jpg`;

  img.addEventListener("load", () => {
    wrapper.classList.add("is-loaded");
    loadedCount += 1;
    readerStatus.textContent = `تم تحميل ${loadedCount} صفحة`;
    localStorage.setItem(`magic-comics-${comicId}-last-page`, String(pageNumber));
  });

  img.addEventListener("error", () => {
    wrapper.remove();
    if (pageNumber === 0) {
      readerStatus.textContent = "تعذر تحميل الغلاف";
    }
  });

  img.addEventListener("click", () => openModal(img.src, img.alt));

  wrapper.appendChild(skeleton);
  wrapper.appendChild(img);
  return wrapper;
}

function appendPage(pageNumber) {
  if (document.querySelector(`[data-page="${pageNumber}"]`)) return;
  const pageEl = makePage(pageNumber);
  reader.appendChild(pageEl);
  return pageEl;
}

function schedulePageLoad(pageNumber) {
  if (pageNumber < 0 || pagesToLoad.has(pageNumber)) return;
  pagesToLoad.add(pageNumber);
  appendPage(pageNumber);
}

function renderComic() {
  reader.innerHTML = "";
  readerStatus.textContent = "جارِ تجهيز الصفحات...";
  pagesToLoad = new Set([0]);
  loadedCount = 0;

  // حمّل أول صفحة فورًا، ثم أضف الصفحات التالية على دفعات خفيفة.
  appendPage(0);

  const burstSize = 4;
  const nextBurst = () => {
    const start = loadedCount === 0 ? 1 : loadedCount;
    for (let i = start; i < start + burstSize; i++) {
      schedulePageLoad(i);
    }

    // أوقف التحميل تلقائيًا عند أول صفحة غير موجودة بعد أن يتضح التسلسل.
    const probe = document.querySelector(`[data-page="${start + burstSize - 1}"] img`);
    if (probe && probe.complete && probe.naturalWidth === 0) {
      readerStatus.textContent = `اكتمل تحميل العدد حتى الصفحة ${start + burstSize - 2}`;
      return;
    }

    if (start + burstSize < 50) {
      setTimeout(nextBurst, 15);
    }
  };

  setTimeout(nextBurst, 10);
}

scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// تحميل إضافي خفيف أثناء التمرير حتى تبقى التجربة سلسة في وضع fullscreen.
window.addEventListener("scroll", () => {
  const last = Math.max(...Array.from(document.querySelectorAll(".comic-page")).map((el) => Number(el.dataset.page || 0)));
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 1200;
  if (nearBottom) {
    schedulePageLoad(last + 1);
    schedulePageLoad(last + 2);
  }
});

renderComic();
if (startPage > 0) {
  setTimeout(() => {
    const pageEl = document.querySelector(`[data-page="${startPage}"]`);
    if (pageEl) pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 400);
}

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("show");
}

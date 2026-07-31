const comicsPerPage = 6;
let currentPage = 1;

function searchComics() {
  const input = document.getElementById('search-bar');
  const query = (input?.value || '').trim().toLowerCase();
  const comics = document.querySelectorAll('.comic-item');

  comics.forEach((comic) => {
    const title = (comic.getAttribute('data-title') || '').toLowerCase();
    const id = (comic.getAttribute('data-id') || '').toLowerCase();
    const match = !query || title.includes(query) || id.includes(query);
    comic.style.display = match ? '' : 'none';
  });

  currentPage = 1;
  updatePagination();
}

function getVisibleComics() {
  return Array.from(document.querySelectorAll('.comic-item')).filter((comic) => comic.style.display !== 'none');
}

function updatePagination() {
  const comics = getVisibleComics();
  const totalPages = Math.max(1, Math.ceil(comics.length / comicsPerPage));

  comics.forEach((comic, index) => {
    comic.style.display = index >= (currentPage - 1) * comicsPerPage && index < currentPage * comicsPerPage ? '' : 'none';
  });

  const prev = document.getElementById('prev-button');
  const next = document.getElementById('next-button');
  if (prev) prev.disabled = currentPage <= 1;
  if (next) next.disabled = currentPage >= totalPages;
}

function nextPage() {
  const totalPages = Math.max(1, Math.ceil(getVisibleComics().length / comicsPerPage));
  if (currentPage < totalPages) {
    currentPage += 1;
    updatePagination();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    updatePagination();
  }
}

function displayLatestWorks() {
  const latestWorksContainer = document.getElementById('latest-works');
  if (!latestWorksContainer) return;

  latestWorksContainer.innerHTML = `
    <div class="comic-item" data-title="ميتاليك #1" data-id="1" data-date="none" data-status="published">
      <a href="../comic.html?id=metalic"><img src="comics/photos/metalc_poster.jpg" alt="غلاف القصة الأولى">ميتاليك #1</a>
    </div>
  `;
}

function displayInProgress() {
  const inProgressContainer = document.getElementById('in-progress');
  if (!inProgressContainer) return;
  inProgressContainer.innerHTML = '';
}

function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  const menuButton = document.querySelector('.menu-toggle');
  const isOpen = navLinks?.classList.toggle('show');
  if (menuButton) menuButton.setAttribute('aria-expanded', String(Boolean(isOpen)));
}

document.addEventListener('DOMContentLoaded', () => {
  displayLatestWorks();
  displayInProgress();
  updatePagination();
});

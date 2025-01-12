// 1. البحث عن قصة
function searchComics() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const comics = document.querySelectorAll(".comic-item");

    comics.forEach(comic => {
        const title = comic.getAttribute("data-title").toLowerCase();
        const id = comic.getAttribute("data-id");

        if (title.includes(searchInput) || id.includes(searchInput)) {
            comic.style.display = "block";
        } else {
            comic.style.display = "none";
        }
    });
}

// 2. إدارة التنقل بين الصفحات
let currentPage = 1;
const comicsPerPage = 6;

function updatePagination() {
    const comics = document.querySelectorAll(".comic-item");
    const totalPages = Math.ceil(comics.length / comicsPerPage);

    comics.forEach((comic, index) => {
        comic.style.display =
            index >= (currentPage - 1) * comicsPerPage &&
            index < currentPage * comicsPerPage
                ? "block"
                : "none";
    });

    document.getElementById("prev-button").disabled = currentPage === 1;
    document.getElementById("next-button").disabled = currentPage === totalPages;
}

function nextPage() {
    const totalPages = Math.ceil(document.querySelectorAll(".comic-item").length / comicsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

// 5. تهيئة الصفحة عند التحميل
document.addEventListener("DOMContentLoaded", () => {
    updatePagination();
    displayLatestWorks();
    displayInProgress();
});

function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
  }

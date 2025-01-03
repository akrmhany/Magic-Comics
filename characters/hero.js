document.addEventListener("DOMContentLoaded", () => {
    const toggleStoryBtn = document.getElementById("toggle-story");
    const storyParagraph = document.getElementById("story");

    toggleStoryBtn.addEventListener("click", () => {
        if (storyParagraph.style.display === "none") {
            storyParagraph.style.display = "block";
            toggleStoryBtn.textContent = "إخفاء القصة";
        } else {
            storyParagraph.style.display = "none";
            toggleStoryBtn.textContent = "عرض القصة الكاملة";
        }
    });

    const resetStatsBtn = document.getElementById("reset-stats");
    const bars = document.querySelectorAll(".bar");

    resetStatsBtn.addEventListener("click", () => {
        bars.forEach(bar => {
            const originalValue = bar.getAttribute("data-value");
            bar.style.width = `${originalValue}%`;
        });
    });
});

document.querySelectorAll(".circle").forEach(circle => {
    const value = parseInt(circle.getAttribute("data-value"));
    const percentage = (value / 10) * 100; // Assuming max value is 5
    circle.style.background = `conic-gradient(black ${percentage}%, lightgray ${percentage}%)`;
  });
  
  // خاصية البحث
function searchComic() {
    const query = document.getElementById('search').value.toLowerCase();
    const comics = document.querySelectorAll('.comic-item');
    
    comics.forEach(comic => {
        const title = comic.getAttribute('data-title').toLowerCase();
        const id = comic.getAttribute('data-id');
        
        if (title.includes(query) || id.includes(query)) {
            comic.style.display = "block";
        } else {
            comic.style.display = "none";
        }
    });
}

// شريط التنقل
let currentPage = 1;
const itemsPerPage = 6;

function updatePagination() {
    const comics = document.querySelectorAll('.comic-item');
    const totalItems = comics.length;

    comics.forEach((comic, index) => {
        if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
            comic.style.display = "block";
        } else {
            comic.style.display = "none";
        }
    });
}

function nextPage() {
    const comics = document.querySelectorAll('.comic-item');
    const totalPages = Math.ceil(comics.length / itemsPerPage);
    
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

// تحديث أولي
updatePagination();

function createPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Clear existing buttons
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.onclick = () => {
        state.currentPage = i;
        updatePagination();
      };
      if (i === state.currentPage) {
        button.classList.add("active");
      }
      pagination.appendChild(button);
    }
  }
  
  document.addEventListener("DOMContentLoaded", updatePagination);
  
  function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
  }

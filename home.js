let lastScroll = 0;
const navbar = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll) {
    navbar.style.top = "-80px"; // أخفي الشريط
  } else {
    navbar.style.top = "0"; // أظهر الشريط
  }
  lastScroll = currentScroll;
});

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  alert(`نتائج البحث عن: ${query}`);
  // هنا يمكنك إضافة كود لعرض النتائج
});

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      section.classList.add("visible");
    } else {
      section.classList.remove("visible");
    }
  });
});

document.querySelectorAll(".dropdown-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const dropdown = button.nextElementSibling;
      dropdown.classList.toggle("show");
    });
  });
  
  function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
  }
  
  const slides = document.querySelector('.slider-container');
const paginationDots = document.querySelectorAll('.pagination div');
let currentIndex = 0;

function updateSlider() {
  const width = slides.offsetWidth;
  slides.style.transform = `translateX(-${currentIndex * width}px)`;
  paginationDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % paginationDots.length;
  updateSlider();
}

setInterval(nextSlide, 5000); // Change slide every 5 seconds

paginationDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
  });
});

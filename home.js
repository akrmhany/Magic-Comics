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
  
  const swiper = new Swiper('.swiper-container', {
    loop: true, // لجعل السلايدر يعمل بشكل دائري
    autoplay: {
      delay: 5000, // تغيير الشريحة كل 5 ثوانٍ
      disableOnInteraction: false, // استمرارية التشغيل التلقائي حتى بعد التفاعل
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
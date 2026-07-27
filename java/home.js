function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("show");

  const isOpen = navLinks.classList.contains("show");
  document.body.classList.toggle("menu-open", isOpen);
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.remove("show");
    document.body.classList.remove("menu-open");
  }
});

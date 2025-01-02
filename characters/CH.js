function filterCharacters() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  const cards = document.querySelectorAll(".character-card");

  let hasResults = false;

  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    const description = card.getAttribute("data-description").toLowerCase();

    if (name.includes(searchInput) || description.includes(searchInput)) {
      card.style.display = "block";
      hasResults = true;
    } else {
      card.style.display = "none";
    }
  });

  if (!hasResults) {
    document.querySelector("#characters-list").innerHTML = "<p>لا توجد نتائج مطابقة.</p>";
  }
}

let state = {
  currentPage: 1,
  charactersPerPage: 4
};

function updatePagination() {
  const cards = document.querySelectorAll(".character-card");
  const totalPages = Math.ceil(cards.length / state.charactersPerPage);

  cards.forEach((card, index) => {
    card.style.display =
      index >= (state.currentPage - 1) * state.charactersPerPage &&
      index < state.currentPage * state.charactersPerPage
        ? "block"
        : "none";
  });

  document.querySelector("#pagination button:first-child").disabled =
    state.currentPage === 1;
  document.querySelector("#pagination button:last-child").disabled =
    state.currentPage === totalPages;

  createPagination(totalPages);
}

function prevPage() {
  if (state.currentPage > 1) {
    state.currentPage--;
    updatePagination();
  }
}

function nextPage() {
  const cards = document.querySelectorAll(".character-card");
  if (state.currentPage < Math.ceil(cards.length / state.charactersPerPage)) {
    state.currentPage++;
    updatePagination();
  }
}

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

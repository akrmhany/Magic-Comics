function filterCharacters() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const cards = document.querySelectorAll(".character-card");
  
    cards.forEach(card => {
      const name = card.getAttribute("data-name").toLowerCase();
      const description = card.getAttribute("data-description").toLowerCase();
  
      if (name.includes(searchInput) || description.includes(searchInput)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
  
  let currentPage = 1;
  const charactersPerPage = 4;
  
  function updatePagination() {
    const cards = document.querySelectorAll(".character-card");
    const totalPages = Math.ceil(cards.length / charactersPerPage);
  
    cards.forEach((card, index) => {
      card.style.display =
        index >= (currentPage - 1) * charactersPerPage &&
        index < currentPage * charactersPerPage
          ? "block"
          : "none";
    });
  
    document.querySelector("#pagination button:first-child").disabled =
      currentPage === 1;
    document.querySelector("#pagination button:last-child").disabled =
      currentPage === totalPages;
  }
  
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  }
  
  function nextPage() {
    const cards = document.querySelectorAll(".character-card");
    if (currentPage < Math.ceil(cards.length / charactersPerPage)) {
      currentPage++;
      updatePagination();
    }
  }
  
  document.addEventListener("DOMContentLoaded", updatePagination);  
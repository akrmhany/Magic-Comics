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
  
  
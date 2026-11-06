// homepage javascript file - loaded with defer so DOM exists
const reducedMotionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const carouselPreviousCourseBtn = document.getElementById(
  "carousel-previous-course-btn",
);
const carouselNextCourseBtn = document.getElementById(
  "carousel-next-course-btn",
);
const carouselContainer = document.getElementById("carousel-container");
const card = carouselContainer.querySelector(".carousel-slide");

function updateCarouselButtons() {
  let maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
  carouselPreviousCourseBtn.disabled = carouselContainer.scrollLeft <= 1;
  carouselNextCourseBtn.disabled =
    carouselContainer.scrollLeft >= maxScroll - 1;
}

carouselContainer.addEventListener("scroll", updateCarouselButtons); // check and update button states on scroll
window.addEventListener("resize", updateCarouselButtons); // check and update button states on window resize
updateCarouselButtons(); // initial check to set button states correctly on page load

carouselPreviousCourseBtn.addEventListener("click", () => {
  // Logic to go to the previous course in the carousel
  let cardWidth = card.offsetWidth;
  let cardGap = parseFloat(getComputedStyle(carouselContainer).columnGap);

  carouselContainer.scrollBy({
    left: -(cardWidth + cardGap), // negative value to scroll left
    behavior: reducedMotionPreference.matches ? "auto" : "smooth",
  });
});

carouselNextCourseBtn.addEventListener("click", () => {
  // Logic to go to the next course in the carousel
  let cardWidth = card.offsetWidth;
  let cardGap = parseFloat(getComputedStyle(carouselContainer).columnGap);

  carouselContainer.scrollBy({
    left: cardWidth + cardGap, // positive value to scroll right
    behavior: reducedMotionPreference.matches ? "auto" : "smooth",
  });
});

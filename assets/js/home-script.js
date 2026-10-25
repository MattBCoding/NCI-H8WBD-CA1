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
  console.log("Card width:", cardWidth, "Card gap:", cardGap);
  console.log(
    "Card gap from gap property:",
    parseFloat(getComputedStyle(carouselContainer).gap),
  );
  carouselContainer.scrollBy({
    left: -(cardWidth + cardGap), // negative value to scroll left
    behavior: reducedMotionPreference.matches ? "auto" : "smooth",
  });
});

carouselNextCourseBtn.addEventListener("click", () => {
  // Logic to go to the next course in the carousel
  let cardWidth = card.offsetWidth;
  let cardGap = parseFloat(getComputedStyle(carouselContainer).columnGap);
  console.log("Card width:", cardWidth, "Card gap:", cardGap);
  console.log(
    "Card gap from gap property:",
    parseFloat(getComputedStyle(carouselContainer).gap),
  );
  console.log(reducedMotionPreference.matches);
  carouselContainer.scrollBy({
    left: cardWidth + cardGap, // positive value to scroll right
    behavior: reducedMotionPreference.matches ? "auto" : "smooth",
  });
});

// newsletter sign up - validate the email, then confirm in a modal
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("footer-email");
const newsletterModal = document.getElementById("newsletter-modal");
const newsletterModalClose = document.getElementById("newsletter-modal-close");

// type="email" accepts "name@domain" so also require a dot-separated domain with a 2+ letter ending
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;

// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input
newsletterEmail.addEventListener("input", () => {
  console.log("Newsletter email input changed:", newsletterEmail.value);
  newsletterEmail.setCustomValidity(""); // clear our custom message as soon as they edit
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the page from reloading
  newsletterEmail.value = newsletterEmail.value.trim();
  newsletterEmail.setCustomValidity(""); // reset before re-checking as once set it won't clear itself

  // use regex to validate email format
  if (!EMAIL_PATTERN.test(newsletterEmail.value)) {
    console.log("Invalid email format:", newsletterEmail.value);
    // return error to the user via custom validity message
    newsletterEmail.setCustomValidity(
      "Please enter a full email address, e.g. name@domain.com",
    ); // set error message on the email input field
    newsletterEmail.reportValidity(); // show the error message to the user.
    return;
  }
  // reset available on form element - https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
  newsletterForm.reset();
  // using dialog element - showModal() displays the modal and traps focus inside it - esc key closes it automatically
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#additional_notes
  newsletterModal.showModal();
});

// close modal if user clicks the close button
newsletterModalClose.addEventListener("click", () => newsletterModal.close());

// close modal if user clicks outside of the modal.
newsletterModal.addEventListener("click", (event) => {
  console.log("Newsletter modal clicked:", event.target);
  if (event.target === newsletterModal) {
    newsletterModal.close();
  }
});

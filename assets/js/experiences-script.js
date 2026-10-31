// documentation for Tom Select: https://tom-select.js.org/
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".search-results-card");

    // Initialize the Tom Select
    new TomSelect("#select-state", {
        maxItems: 16,
        plugins: ['remove_button'],  // adds the x to remove the tag

        onChange: function(selectedValues) {
            let counter = 0;
            cards.forEach(card => {
                const categoryString = card.getAttribute("data-category");
                const categoryArray = categoryString.split(" ");

                if (selectedValues.length === 0) {
                    card.classList.remove("hidden");
                    counter++;
                    return;  // skip to the next card
                }

                const hasCategory = selectedValues.some(filter => categoryArray.includes(filter));

                if (hasCategory) {
                    card.classList.remove("hidden");
                    counter++;
                } else {
                    card.classList.add("hidden");
                }
            });
            console.log(`Number of visible cards: ${counter}`);
            document.getElementById("card-number").textContent = counter;
        }
    });
});
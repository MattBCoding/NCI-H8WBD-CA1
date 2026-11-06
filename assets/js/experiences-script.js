// documentation for Tom Select: https://tom-select.js.org/
document.addEventListener("DOMContentLoaded", () => {
    const CARDS = document.querySelectorAll(".search-results-card");

    let selectedCourses = [];
    let maxBudgetEuros = 0;

    function applyFilters() {
        let counter = 0;

        CARDS.forEach(card => {
            const categoryString = card.getAttribute("data-category");
            const categoryArray = categoryString.split(" ");

            const priceEuros = Number(card.querySelector("[data-price-eur]").dataset.priceEur);

            const matchesCourse = selectedCourses.length === 0 || selectedCourses.some(filter => categoryArray.includes(filter));
            const matchesBudget = maxBudgetEuros === 0 || priceEuros <= maxBudgetEuros;

            if (matchesCourse && matchesBudget) {
                card.classList.remove("hidden");
                counter++;
            } else {
                card.classList.add("hidden");
            }
        });
        document.getElementById("card-number").textContent = counter;
    };

    // Initialise the Tom Select for the course selection
    const COURSESELECT = new TomSelect("#select-course", {
        maxItems: 16,
        plugins: ['remove_button'],  // adds the x to remove the tag

        onChange: function (selectedValues) {
            selectedCourses = selectedValues;
            applyFilters();
        }
    });

    // Initialise the Tom Select for the budget selection
    const BUDGETSELECT = new TomSelect("#select-value", {
        maxItems: 1,
        plugins: ['remove_button'],  // adds the x to remove the tag

        onChange: function (selectedValues) {
            maxBudgetEuros = Number(selectedValues || 0);  // default to 0 for unlimited budget
            applyFilters();
        }
    });

    function updateBudgetFilterLabels(currency) {
        Object.values(BUDGETSELECT.options).forEach(option => {
            if (!option.value || option.value === "0") {
                // unlimited budget is set to "" 
                return;
            }
            BUDGETSELECT.updateOption(option.value, {
                value: option.value,
                text: `Under ${formatPrice(Number(option.value), currency)}`
            });
        });
    }

    document.addEventListener("currencyChange", (event) => {
        updateBudgetFilterLabels(event.detail.currency || "EUR");
    });

    // set the initial budget filter labels based on the current currency from the selector
    updateBudgetFilterLabels(document.documentElement.dataset.currency || "EUR");

    // set the initial count
    applyFilters();

    // clear button reset the filter objects
    document.getElementById("clear-filters").addEventListener("click", () => {
        COURSESELECT.clear();
        BUDGETSELECT.clear();
        selectedCourses = [];
        maxBudgetEuros = 0;
        applyFilters();
    });

});
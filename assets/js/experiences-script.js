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
            console.log('categoryArray:', categoryArray);
            const priceEuros = Number(card.querySelector("[data-price-eur]").dataset.priceEur);
            console.log('card price in euros:', priceEuros);
            const matchesCourse = selectedCourses.length === 0 || selectedCourses.some(filter => categoryArray.includes(filter));
            const matchesBudget = maxBudgetEuros === 0 || priceEuros <= maxBudgetEuros;

            console.log('matchesCourse:', matchesCourse, 'matchesBudget:', matchesBudget);
            if (matchesCourse && matchesBudget) {
                card.classList.remove("hidden");
                counter++;
                console.log('Card matches filters, counter incremented to:', counter);
            } else {
                card.classList.add("hidden");
            }
        });
        console.log(`Number of visible cards: ${counter}`);
        document.getElementById("card-number").textContent = counter;
    };

    // Initialise the Tom Select for the course selection
    new TomSelect("#select-course", {
        maxItems: 16,
        plugins: ['remove_button'],  // adds the x to remove the tag

        onChange: function(selectedValues) {
            selectedCourses = selectedValues;
            applyFilters();
        }
    });

    // Initialise the Tom Select for the budget selection
    const BUDGETSELECT =new TomSelect("#select-value", {
        maxItems: 1,
        plugins: ['remove_button'],  // adds the x to remove the tag

        onChange: function(selectedValues) {
            console.log('Selected values from BUDGETSELECT onChange:', selectedValues);
            maxBudgetEuros = Number(selectedValues || 0);  // default to 0 for unlimited budget
            console.log('Selected max budget in euros:', maxBudgetEuros, 'from inside onChange on BUDGETSELECT');
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

});
// shared currency selector - loaded with defer on every page, before the page's own script

// these preset values are the fallback - should update object with fresh rates from the API
const CURRENCY_RATES = { 
    EUR: 1, 
    USD: 1.08, 
    GBP: 0.85 
};
const DEFAULT_CURRENCY = 'EUR';
const CURRENCY_STORAGE_KEY = 'currency';
const RATES_STORAGE_KEY = 'currencyRates';
const RATES_URL = 'https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,GBP';  // free currency rates API
const RATES_MAX_AGE_MS = 600000; // reuse fetched rates for 10 minutes so we don't hit the API too often (in this case super conservative)
const RATES_TIMEOUT_MS = 5000;

const currencySelect = document.getElementById('currency-select');

// rates fetched from the API are cached with a timestamp so they can be reused within the max age limit
function loadCachedRates() {
    try {
        const cached = JSON.parse(localStorage.getItem(RATES_STORAGE_KEY));
        if (cached 
            && cached.rates 
            && typeof cached.fetchedAt === 'number') {
            // check if there is anything there, then if it has the correct structure of rates object and fetchedAt timestamp
            // if so return the cached rates
            console.log('Using cached rates:', cached);
            return cached;
        }
    } catch {
        // missing, corrupt or inaccessible - treat as no cache
        console.error('Failed to load cached rates');
    }
    return null;
}

function saveCachedRates(rates) {
    try {
        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify({ rates, fetchedAt: Date.now() }));
    } catch {
        // not cached if user has settings blocking access to localStorage, will need to fetch again next time
        console.error('Failed to save cached rates');
    }
}

async function fetchRates() {
    // response shape: [{ date, base: "EUR", quote: "USD", rate: 1.12 }, { date, base: "EUR", quote: "GBP", rate: 0.85 }]
    const response = await fetch(RATES_URL, { signal: AbortSignal.timeout(RATES_TIMEOUT_MS) });
    if (!response.ok) {
        // failed to fetch rates from the API for some reason, raise error to make the caller handle it
        throw new Error(`Currency Rates lookup failed: ${response.status}`);
    }
    const rates = {};
    for (const { quote, rate } of await response.json()) {
        if (quote in CURRENCY_RATES && typeof rate === 'number') {
            rates[quote] = rate;
        }
    }
    return rates;
}

// makes sure CURRENCY_RATES is no more than ten minutes old; on any failure the
// existing (cached or preset) rates stay in place so the site keeps working
async function refreshRates() {
    console.log('Refreshing currency rates...');
    console.log(Date.now());
    const cached = loadCachedRates();
    if (cached) {
        Object.assign(CURRENCY_RATES, cached.rates);
        if (Date.now() - cached.fetchedAt < RATES_MAX_AGE_MS) {
            return;
        }
    }
    try {
        // get rates
        const rates = await fetchRates();
        // update CURRENCY_RATES with the newly fetched rates
        Object.assign(CURRENCY_RATES, rates);
        // save the fetched rates to local storage
        saveCachedRates(rates);
    } catch (error) {
        console.warn('Using previous exchange rates:', error);
    }
    console.log('Finished refreshing currency rates.');
    console.log(Date.now());
}

function getSavedCurrency() {
    try {
        // try to read the saved currency from local storage
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
        return Object.hasOwn(CURRENCY_RATES, saved) ? saved : DEFAULT_CURRENCY;
    } catch {
        // failed to read saved currency, will use default
        console.log('Failed to load saved currency from local storage');
        return DEFAULT_CURRENCY;
    }
}

function saveCurrency(currency) {
    // try to save the selected currency to local storage
    try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {
        // failed to save currency to local storage
        console.log('Failed to save currency to local storage');
    }
}

function formatPrice(amountInEur, currency) {
    // returns the formatted price string in the specified currency no decimal places.
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amountInEur * CURRENCY_RATES[currency]);
}

// any element with data-price-eur="<amount>" has its text replaced with the converted price
function applyCurrency(currency) {
    document.querySelectorAll('[data-price-eur]').forEach((element) => {
        element.textContent = formatPrice(Number(element.dataset.priceEur), currency);
    });
    document.documentElement.dataset.currency = currency;
}

const activeCurrency = getSavedCurrency();
applyCurrency(activeCurrency); // show something straight away using cached / preset rates

if (currencySelect) {
    currencySelect.value = activeCurrency;
    // event listener for currency selection changes
    currencySelect.addEventListener('change', async () => {
        // first saved the selected currency to local storage
        saveCurrency(currencySelect.value);
        // then refresh the exchange rates
        await refreshRates();
        // finally apply the new currency to the page
        applyCurrency(currencySelect.value);
    });
}

// when a non-default currency is set in local storage
// we need to refresh the exchange rates and apply the conversion to the page on load.
if (activeCurrency !== DEFAULT_CURRENCY) {
    refreshRates().then(() => applyCurrency(currencySelect ? currencySelect.value : activeCurrency));
}

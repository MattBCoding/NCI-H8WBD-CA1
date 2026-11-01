// https://intl-tel-input.com/docs/vanilla-javascript

const PHONE_INPUT = document.querySelector("#phone");
const INITIALCOUNTRYLOOKUP = async () => {
    try {
        const RES = await fetch("https://ipapi.co/json");
        const DATA = await RES.json();
        return DATA.country_code;
    } catch {
        console.log("Country lookup failed");
        return "ie"; // default to Ireland if lookup fails
    }
};

const CUSTOMPLACEHOLDER = (exampleNumber) =>
  exampleNumber ? exampleNumber.replace(/\d/g, "X") : "Enter Number";

const telInputObj = window.intlTelInput(PHONE_INPUT, {
  initialCountryLookup: INITIALCOUNTRYLOOKUP,
  customPlaceholder: CUSTOMPLACEHOLDER,
  countryOrder: ["ie", "gb", "ca", "de", "jp", "us"],
  allowedNumberTypes: ["FIXED_LINE","MOBILE","FIXED_LINE_OR_MOBILE"],
  loadUtils: () =>
    import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.5.10/dist/js/utils.js"),
});

// contact form validation and modal 
const FORM = document.getElementById("consultation-form");
const NAME_INPUT = document.getElementById("name");
const EMAIL_INPUT = document.getElementById("email");
const QUERY_INPUT = document.getElementById("query-type");
const MESSAGE_INPUT = document.getElementById("message");
const CONSULTATION_MODAL = document.getElementById("consultation-modal");
const CONSULTATION_MODAL_CLOSE = document.getElementById("consultation-modal-close");

[NAME_INPUT, EMAIL_INPUT, PHONE_INPUT, QUERY_INPUT, MESSAGE_INPUT].forEach((input) => {
  input.addEventListener("input", () => {
    input.setCustomValidity(""); // clear custom message as soon as they edit
  });
});

PHONE_INPUT.addEventListener("countrychange", () => PHONE_INPUT.setCustomValidity(""));

FORM.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent the page from reloading
    await telInputObj.promise;
    // EMAIL_PATTERN comes from shared.js
    const VALIDATIONS = [
        [NAME_INPUT, NAME_INPUT.value.trim().length >= 3, "Please enter your full name (at least 3 characters)."],
        [EMAIL_INPUT, EMAIL_PATTERN.test(EMAIL_INPUT.value.trim()), "Please enter a full email address, e.g. name@domain.com"],
        [PHONE_INPUT, telInputObj.isValidNumber(), "Please enter a valid phone number for the selected country."],
        [MESSAGE_INPUT, MESSAGE_INPUT.value.trim().length >= 10, "Please tell us a little bit more about your desired trip (at least 10 characters)."],
    ];
    console.log('email validation:', EMAIL_PATTERN);

    let firstInvalidInput = null;
    for (const [field, isValid, errorMessage] of VALIDATIONS) {
        console.log(`Validating field: ${field.id}, isValid: ${isValid}`);
        field.setCustomValidity(isValid ? "" : errorMessage);
        if (!isValid && !firstInvalidInput) {
            firstInvalidInput = field;
        }
    }
    if (firstInvalidInput) {
        firstInvalidInput.reportValidity();
        return;
    }

    const DETAILS = {
        name: NAME_INPUT.value.trim(),
        email: EMAIL_INPUT.value.trim(),
        phone: telInputObj.getNumber(),  // returns full international number
        queryType: QUERY_INPUT.value,
        message: MESSAGE_INPUT.value.trim(),
    };
    console.log("Consultation Form request received:", DETAILS);

    FORM.reset();  // clear the form fields after successful submission
     // using dialog element - showModal() displays the modal and traps focus inside it - esc key closes it automatically
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#additional_notes
    CONSULTATION_MODAL.showModal();
});

CONSULTATION_MODAL_CLOSE.addEventListener("click", () => CONSULTATION_MODAL.close());
CONSULTATION_MODAL.addEventListener("click", (event) => {
    if (event.target === CONSULTATION_MODAL) {
        CONSULTATION_MODAL.close();
    }
});
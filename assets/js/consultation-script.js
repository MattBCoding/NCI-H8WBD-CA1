// https://intl-tel-input.com/docs/vanilla-javascript

const input = document.querySelector("#phone");
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

const telInputObj = window.intlTelInput(input, {
  initialCountryLookup: INITIALCOUNTRYLOOKUP,
  customPlaceholder: CUSTOMPLACEHOLDER,
  countryOrder: ["ie", "gb", "ca", "de", "jp", "us"],
  allowedNumberTypes: ["FIXED_LINE","MOBILE","FIXED_LINE_OR_MOBILE"],
  loadUtils: () =>
    import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.5.10/dist/js/utils.js"),
});

import listOfCountries from "./countries-object";

// Map: label (country name) -> code
const countryLabelToCodeMap = new Map<string, string>(
  listOfCountries.map((country) => [country.label, country.code])
);

export default countryLabelToCodeMap;

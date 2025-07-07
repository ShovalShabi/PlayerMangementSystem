import listOfCountries from "./countries-object";

/**
 * Map that converts ISO country codes to their country names (labels).
 * Used for flag display and nationality filtering.
 *
 * Key: ISO country code (e.g., "US")
 * Value: Country name (e.g., "United States of America")
 */
const countryLabelToCodeMap = new Map<string, string>(
  listOfCountries.map((country) => [country.code, country.label])
);

export default countryLabelToCodeMap;

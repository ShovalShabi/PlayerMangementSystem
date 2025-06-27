import listOfCountries from "./countries-object";

/**
 * Map that converts country names (labels) to their ISO country codes.
 * Used for flag display and nationality filtering.
 *
 * Key: Country name (e.g., "United States")
 * Value: ISO country code (e.g., "US")
 */
const countryLabelToCodeMap = new Map<string, string>(
  listOfCountries.map((country) => [country.label, country.code])
);

export default countryLabelToCodeMap;

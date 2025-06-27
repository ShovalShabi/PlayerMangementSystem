import { Filters } from "./filters";

/**
 * Global application state interface for Redux store.
 * Contains theme, filters, and measurement unit preferences.
 */
interface State {
  /** Current theme mode (light or dark). */
  theme: "light" | "dark";
  /** Current filter state for player search. */
  filters: Filters;
  /** Current measurement unit for height display. */
  units: "M" | "FT";
}

export type { State };

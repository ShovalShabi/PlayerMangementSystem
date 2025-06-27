/**
 * Interface for player filter criteria.
 * Used for searching and filtering the player list.
 */
interface Filters {
  /** Player name filter (partial match). */
  name: string;
  /** Array of nationality filters. */
  nationality: string[];
  /** Minimum age filter. */
  minAge: string;
  /** Maximum age filter. */
  maxAge: string;
  /** Minimum height filter (in meters). */
  minHeight: string;
  /** Maximum height filter (in meters). */
  maxHeight: string;
  /** Array of position filters. */
  positions: string[];
  /** Number of rows per page for pagination. */
  rowsPerPage: number;
}

/**
 * Props for debounced filter hooks.
 * Used to manage filter state with delayed updates.
 */
interface UseDebouncedFiltersProps {
  /** Initial filter values. */
  initialFilters: Filters;
  /** Debounce delay in milliseconds (optional). */
  delay?: number;
  /** Callback when filters change after debounce. */
  onFiltersChange: (filters: Filters) => void;
}

export type { Filters, UseDebouncedFiltersProps };

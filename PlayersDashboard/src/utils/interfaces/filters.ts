interface Filters {
  name: string;
  nationality: string;
  minAge: string;
  maxAge: string;
  minHeight: string;
  maxHeight: string;
  positions: string[];
  rowsPerPage: number;
}

interface UseDebouncedFiltersProps {
  initialFilters: Filters;
  delay?: number;
  onFiltersChange: (filters: Filters) => void;
}

export type { Filters, UseDebouncedFiltersProps };

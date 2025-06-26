import { useState, useEffect, useCallback, useRef } from "react";
import { UseDebouncedFiltersProps, Filters } from "../utils/interfaces/filters";

export const useDebouncedFilters = ({
  initialFilters,
  delay = 500,
  onFiltersChange,
}: UseDebouncedFiltersProps) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] =
    useState<Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const previousFilters = useRef<Filters>(initialFilters);

  // Update debounced filters after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, delay);

    return () => clearTimeout(timer);
  }, [filters, delay]);

  // Trigger callback when debounced filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only trigger if filters actually changed
    if (
      JSON.stringify(debouncedFilters) !==
      JSON.stringify(previousFilters.current)
    ) {
      previousFilters.current = debouncedFilters;
      setIsLoading(true);
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, onFiltersChange]);

  const updateFilter = useCallback((field: keyof Filters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    filters,
    debouncedFilters,
    isLoading,
    updateFilter,
    setLoading,
  };
};

import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value with a specified delay.
 *
 * Useful for reducing the frequency of expensive operations like API calls
 * or search queries by waiting for the user to stop typing/changing values.
 *
 * @template T The type of the value to debounce.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (defaults to 500ms).
 * @returns The debounced value that updates after the specified delay.
 */
export default function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

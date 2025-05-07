import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the returned value until after a specified delay
 * Helps prevent excessive API calls when inputs change rapidly
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value that updates only after the specified delay
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

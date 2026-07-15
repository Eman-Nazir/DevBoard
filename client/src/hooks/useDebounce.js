import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until after a specified wait time.
 * Use for search inputs to avoid firing API calls on every keystroke.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 400)
 * @returns {any} - The debounced value
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 400);
 *   useEffect(() => { fetchResults(debouncedSearch) }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Clear on value/delay change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
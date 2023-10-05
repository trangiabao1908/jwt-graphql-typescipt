import { useState, useEffect } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<string>("");

  useEffect(() => {
    const handleTimeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handleTimeout);
    };
  }, [value, delay]);

  return debounceValue;
};

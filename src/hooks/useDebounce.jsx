import { useState, useEffect } from 'react';

function useDebounce(value, deplay) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceValue(value);
    }, deplay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, deplay]);

  return debounceValue;
}

export default useDebounce;

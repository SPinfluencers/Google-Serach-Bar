import React, { useRef, useState, useEffect } from "react";

export const useThrottle = (value, wait) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastCall = useRef(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Date.now() - lastCall.current >= wait) {
        setThrottledValue(value);
        lastCall.current = Date.now();
      }
    }, wait - (Date.now() - lastCall.current));

    return () => {
      clearTimeout(timer);
    };
  }, [value, wait]);

  return throttledValue;
};

import { useEffect, useState } from 'react';

/**
 * useClock – returns current Date updated every second.
 */
export default function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
} 
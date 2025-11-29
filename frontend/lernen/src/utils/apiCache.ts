const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const getCachedData = async <T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    } catch (err) {
      console.error('Error parsing cached data:', err);
    }
  }
  // Fetch new data
  const data = await fetchFn();
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
};
import { useCallback, useEffect, useRef, useState } from 'react';

// Generic data-fetching hook with simple caching keyed by stringified args.
// Returns { data, error, loading, refetch }.
export default function useFetch(fetcher, deps = [], { lazy = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!lazy);
  const mounted = useRef(true);

  const stableFetcher = useRef(fetcher);
  stableFetcher.current = fetcher;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await stableFetcher.current();
      if (mounted.current) setData(result);
    } catch (e) {
      if (mounted.current) setError(e);
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (!lazy) run();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, lazy]);

  return { data, error, loading, refetch: run };
}

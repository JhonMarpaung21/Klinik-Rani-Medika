import { useCallback, useEffect, useState } from "react";
import { apiEnabled, arrayOf, errorMessage, requestJson } from "./api";

export function useCatalog<T>(endpoint: string, fallback: T[], guard: (value: unknown) => value is T) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(apiEnabled);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    if (!apiEnabled) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    requestJson(endpoint, arrayOf(guard), { signal: controller.signal })
      .then(setData)
      .catch(error => {
        if (!controller.signal.aborted) { setData(fallback); setError(errorMessage(error)); }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [endpoint, fallback, guard, version]);
  return { data, setData, loading, error, reload };
}

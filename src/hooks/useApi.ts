import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        console.log('🎯 useApi - Setting data:', result);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as Error;
        console.error('❌ useApi - Error:', error);
        setError(error);
        onError?.(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  return { data, isLoading, error, execute, reset };
}

// Hook pour charger automatiquement les données au montage
export function useApiQuery<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const apiState = useApi(apiFunction);

  useEffect(() => {
    apiState.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return apiState;
}

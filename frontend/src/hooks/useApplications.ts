import { useState, useEffect, useCallback } from 'react';
import type { Application, PaginatedResponse, ListApplicationsParams } from '../types';
import { applicationsApi } from '../api/applications';

interface UseApplicationsReturn {
  data: PaginatedResponse<Application> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApplications = (params?: ListApplicationsParams): UseApplicationsReturn => {
  const [data, setData] = useState<PaginatedResponse<Application> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    applicationsApi
      .list(params)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.status, params?.search, params?.page, params?.limit, tick]);

  return { data, loading, error, refetch };
};

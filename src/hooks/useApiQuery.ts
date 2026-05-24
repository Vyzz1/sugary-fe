import { useQuery, type UseQueryOptions, type QueryKey } from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import api from "../lib/axios";

interface UseApiQueryOptions<TQueryFnData, TData = TQueryFnData, TError = AxiosError> extends Omit<
  UseQueryOptions<TQueryFnData, TError, TData, QueryKey>,
  "queryKey" | "queryFn"
> {
  axiosConfig?: AxiosRequestConfig;
}

/**
 * A generic React Query hook that uses our authenticated Axios instance.
 *
 * @param queryKey The React Query key array (e.g., ['expenses', 'list'])
 * @param url The API endpoint to fetch from
 * @param options React Query options and optional Axios config
 */
export function useApiQuery<TQueryFnData, TData = TQueryFnData, TError = AxiosError>(
  queryKey: QueryKey,
  url: string,
  options?: UseApiQueryOptions<TQueryFnData, TData, TError>
) {
  const { axiosConfig, ...reactQueryOptions } = options || {};

  return useQuery<TQueryFnData, TError, TData, QueryKey>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const response = await api.get<TQueryFnData>(url, axiosConfig);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        throw axiosError.response?.data || axiosError;
      }
    },
    ...reactQueryOptions,
  });
}

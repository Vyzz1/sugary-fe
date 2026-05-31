import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "@/lib/axios";
import { mealsHistoryKeys, type MealsHistoryQueryParams, type MealsHistoryResponse } from "../-queries/meals.query";

const DEFAULT_PAGE_SIZE = 20;

export function useMealsInfiniteQuery(filters: MealsHistoryQueryParams) {
  return useInfiniteQuery<MealsHistoryResponse, AxiosError | unknown>({
    queryKey: mealsHistoryKeys.list(filters),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const response = await api.get<MealsHistoryResponse>("/api/meals", {
          params: {
            ...filters,
            page: pageParam,
            page_size: DEFAULT_PAGE_SIZE,
          },
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data || axiosError;
      }
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.meta.page * lastPage.meta.page_size < lastPage.meta.total;
      return hasMore ? lastPage.meta.page + 1 : undefined;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

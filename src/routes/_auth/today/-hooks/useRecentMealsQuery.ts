import { useApiQuery } from "@/hooks/useApiQuery";
import { recentMealsKeys, type RecentMealsResponse } from "../-queries/today.query";

export function useRecentMealsQuery(query: string, enabled = true) {
  return useApiQuery<RecentMealsResponse>(recentMealsKeys.list(query), "/api/meals/recent", {
    enabled,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    axiosConfig: {
      params: query ? { q: query } : undefined,
    },
  });
}

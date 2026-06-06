import { useApiQuery } from "@/hooks/useApiQuery";
import { insightKeys, type InsightRange, type InsightResponse } from "../-queries/insights.query";

export function useInsightQuery(range: InsightRange) {
  return useApiQuery<InsightResponse>(insightKeys.summary(range), "/api/insight", {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    axiosConfig: {
      params: {
        range,
      },
    },
  });
}

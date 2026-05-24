import { useApiQuery } from "@/hooks/useApiQuery";
import {
  BASE_TODAY_MEALS_URL,
  todayKeys,
  todayQueryOptions,
  type TodayMealsResponse,
} from "../-queries/today.query";

function toTodayMealsApiParams(date: string) {
  return { date };
}

export function useTodayMealsQuery(date: string) {
  return useApiQuery<TodayMealsResponse>(todayKeys.list(date), BASE_TODAY_MEALS_URL, {
    ...todayQueryOptions,
    axiosConfig: {
      params: toTodayMealsApiParams(date),
    },
  });
}

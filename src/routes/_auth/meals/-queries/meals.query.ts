import type { BaseResponseWithMeta } from "@/types/api";
import type { TodayMeal } from "../../today/-queries/today.query";

export const mealsHistoryKeys = {
  all: ["meals-history"] as const,
  lists: () => [...mealsHistoryKeys.all, "list"] as const,
  list: (filters: MealsHistoryQueryParams) => [...mealsHistoryKeys.lists(), filters] as const,
};

export interface MealsHistoryQueryParams {
  start_date: string;
  end_date: string;
  q?: string;
  meal_type?: TodayMeal["meal_type"];
  sort_by?: "recorded_at";
  sort_type?: "desc" | "asc";
}

export interface MealsHistoryMeta {
  count: number;
  end_date: string;
  meal_type: string;
  page: number;
  page_size: number;
  query: string;
  sort_by: string;
  sort_type: string;
  sortable_columns: string[];
  start_date: string;
  timezone: string;
  total: number;
}

export interface MealsHistoryResponse extends BaseResponseWithMeta<TodayMeal[], MealsHistoryMeta> {
  request_id?: string;
}

import type { BaseResponseWithMeta } from "@/types/api";

export const BASE_TODAY_MEALS_URL = "/api/meals";

export const todayKeys = {
  all: ["today-meals"] as const,
  lists: () => [...todayKeys.all, "list"] as const,
  list: (date: string) => [...todayKeys.lists(), date] as const,
};

export const recentMealsKeys = {
  all: ["meals", "recent"] as const,
  lists: () => [...recentMealsKeys.all, "list"] as const,
  list: (query?: string) => [...recentMealsKeys.lists(), query ?? ""] as const,
};

export const todayQueryOptions = {
  staleTime: 60 * 1000,
  refetchOnWindowFocus: false,
};

export interface TodayMealAnalysis {
  estimated_sugar_grams: number;
  estimated_carbs_grams: number;
  estimated_protein_grams: number;
  estimated_calories: number;
  risk_level: "low" | "medium" | "high";
  notes: string[];
}

export interface TodayMeal {
  id: number;
  dish_name: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "drink" | "unspecified";
  image_url?: string;
  recorded_at: string;
  analysis_status: "pending" | "processing" | "completed" | "failed";
  is_user_edited: boolean;
  analysis: TodayMealAnalysis;
}

export interface TodayMealsMeta {
  count: number;
  date: string;
}

export interface TodayMealsResponse extends BaseResponseWithMeta<TodayMeal[], TodayMealsMeta> {
  request_id?: string;
}

export interface RecentMealsMeta {
  page: number;
  page_size: number;
  query: string;
  sort: string;
  total: number;
}

export interface RecentMealsResponse extends BaseResponseWithMeta<TodayMeal[], RecentMealsMeta> {
  request_id?: string;
}

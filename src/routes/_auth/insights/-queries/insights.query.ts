import type { BaseResponse } from "@/types/api";

export const insightKeys = {
  all: ["insights"] as const,
  summary: (range: InsightRange) => [...insightKeys.all, "summary", range] as const,
};

export type InsightRange = "7d" | "30d" | "90d";
export type InsightRiskLevel = "none" | "low" | "medium" | "high";

export interface InsightDaySummary {
  date: string;
  total_sugar_grams: number;
  meal_count: number;
  risk_level: InsightRiskLevel;
}

export interface InsightData {
  range: {
    from: string;
    to: string;
    days: number;
    range_type: InsightRange;
  };
  summary: {
    total_sugar_grams: number;
    average_sugar_per_day: number;
    average_sugar_per_meal: number;
    total_meals: number;
    high_risk_meals: number;
    high_risk_days: number;
    worst_day: InsightDaySummary | null;
    best_day: InsightDaySummary | null;
  };
  trend: {
    comparison_label: string;
    current_period: {
      from: string;
      to: string;
    };
    previous_period: {
      from: string;
      to: string;
    };
    sugar: {
      current_avg_daily_grams: number;
      previous_avg_daily_grams: number;
      direction: "up" | "down" | "stable";
      percent: number;
    };
    high_risk_meals: {
      current_count: number;
      previous_count: number;
      direction: "up" | "down" | "stable";
      percent: number;
    };
    meal_count: {
      current_count: number;
      previous_count: number;
      direction: "up" | "down" | "stable";
      percent: number;
    };
  };
  charts: {
    daily_sugar: Array<{
      date: string;
      total_sugar_grams: number;
      total_calories?: number;
      total_carbs_grams?: number;
      total_protein_grams?: number;
      meal_count: number;
      risk_level: InsightRiskLevel;
      target_grams?: number;
    }>;
    meal_type_breakdown: Array<{
      meal_type: string;
      total_sugar_grams: number;
      meal_count: number;
      average_sugar_grams: number;
    }>;
    risk_distribution: Array<{
      risk_level: InsightRiskLevel;
      count: number;
      percentage: number;
    }>;
    weekly_sugar: Array<{
      week: string;
      total_sugar_grams: number;
      average_per_day: number;
      meal_count: number;
      high_risk_meals: number;
    }>;
    sugar_vs_calories: Array<{
      meal_id: number;
      dish_name: string;
      sugar_grams: number;
      calories: number;
      risk_level: InsightRiskLevel;
      recorded_at: string;
    }>;
  };
  patterns: {
    top_sugar_meals: Array<{
      meal_id: number;
      dish_name: string;
      sugar_grams: number;
      calories: number;
      meal_type: string;
      risk_level: InsightRiskLevel;
      recorded_at: string;
    }>;
    top_sugar_dishes: Array<{
      dish_name: string;
      times_logged: number;
      total_sugar_grams: number;
      average_sugar_grams: number;
    }>;
    worst_meal_type: {
      meal_type: string;
      total_sugar_grams: number;
      average_sugar_grams: number;
    } | null;
  };
}

export interface InsightResponse extends BaseResponse<InsightData> {
  request_id?: string;
}

import type { BaseResponse } from "@/types/api";
import type { MealType } from "../../today/-hooks/add-meal.helpers";

export const BASE_DAILY_REPORT_URL = "/api/reports/daily";
export const BASE_RUN_DAILY_REPORT_URL = "/api/jobs/daily-report";

export const reportKeys = {
  all: ["reports"] as const,
  daily: (date: string) => ["reports", "daily", date] as const,
};

export const reportQueryOptions = {
  staleTime: 60 * 1000,
};

export type ReportRiskLevel = "low" | "medium" | "high";

export interface ReportTopContributor {
  dish_name: string;
  meal_type: MealType;
  estimated_sugar_grams: number;
  risk_level: ReportRiskLevel;
}

export interface DailyReportData {
  date: string;
  meal_count: number;
  total_sugar_grams: number;
  average_sugar_grams: number;
  highest_risk_level: ReportRiskLevel;
  summary: string;
  ai_insights: {
    summary: string;
    top_contributors: ReportTopContributor[];
    recommendations: string[];
    pattern_signals: string[];
  };
}

export type DailyReportResponse = BaseResponse<DailyReportData>;

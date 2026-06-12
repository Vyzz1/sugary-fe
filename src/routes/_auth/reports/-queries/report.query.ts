import type { BaseResponse } from "@/types/api";
import type { MealType } from "../../today/-hooks/add-meal.helpers";

export const BASE_DAILY_REPORT_URL = "/api/reports/daily";
export const BASE_RUN_DAILY_REPORT_URL = "/api/jobs/daily-report";
export const BASE_WEEKLY_REPORT_URL = "/api/reports/weekly";
export const BASE_RUN_WEEKLY_REPORT_URL = "/api/jobs/weekly-report";

export const reportKeys = {
  all: ["reports"] as const,
  daily: (date: string) => ["reports", "daily", date] as const,
  weekly: (weekStart: string) => ["reports", "weekly", weekStart] as const,
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

export interface ReportInsightData {
  summary: string;
  top_contributors: ReportTopContributor[];
  recommendations: string[];
  pattern_signals: string[];
}

export interface ReportSummaryData {
  meal_count: number;
  analyzed_meal_count?: number;
  total_sugar_grams: number;
  average_sugar_grams: number;
  highest_risk_level: ReportRiskLevel;
  summary: string;
  ai_insight_source?: string;
  ai_insight_status?: string;
  ai_insights: ReportInsightData;
}

export interface DailyReportData extends ReportSummaryData {
  date: string;
}

export interface WeeklyReportDailyBreakdown {
  date: string;
  meal_count: number;
  analyzed_meal_count: number;
  total_sugar_grams: number;
  average_sugar_grams: number;
  highest_risk_level: ReportRiskLevel;
}

export interface WeeklyReportData extends ReportSummaryData {
  week_start_date: string;
  week_end_date: string;
  created_at: string;
  daily_breakdown: WeeklyReportDailyBreakdown[];
}

export type DailyReportResponse = BaseResponse<DailyReportData>;
export type WeeklyReportResponse = BaseResponse<WeeklyReportData>;

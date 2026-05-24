import { getErrorMessage } from "@/lib/error";
import type {
  DailyReportData,
  DailyReportResponse,
  ReportRiskLevel,
  ReportTopContributor,
} from "../-queries/report.query";

interface ApiFailure {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

export function formatReportDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatMealType(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export function formatRiskLevel(risk: string) {
  return `${risk.charAt(0).toUpperCase()}${risk.slice(1)} risk`;
}

export function getRiskBadgeClass(risk: ReportRiskLevel) {
  if (risk === "high") {
    return "border-destructive/20 bg-destructive/8 text-destructive";
  }

  if (risk === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-border bg-muted/50 text-foreground";
}

export function calculateSugarProgress(totalSugar: number, goal = 50) {
  const percent = Math.min((totalSugar / goal) * 100, 100);
  const remaining = Math.max(goal - totalSugar, 0);
  const overBy = Math.max(totalSugar - goal, 0);

  return {
    goal,
    percent,
    remaining,
    overBy,
    isOverLimit: totalSugar > goal,
  };
}

export function normalizeReportResponse(response: DailyReportResponse): DailyReportData {
  const data = response.data;
  const topContributors = [...data.ai_insights.top_contributors].sort(
    (left, right) => right.estimated_sugar_grams - left.estimated_sugar_grams
  );

  return {
    ...data,
    ai_insights: {
      summary: data.ai_insights.summary || data.summary,
      top_contributors: topContributors,
      recommendations: data.ai_insights.recommendations,
      pattern_signals: data.ai_insights.pattern_signals,
    },
  };
}

export function getMaxContributorSugar(contributors: ReportTopContributor[]) {
  return contributors.reduce(
    (maxValue, contributor) => Math.max(maxValue, contributor.estimated_sugar_grams),
    0
  );
}

export function isDailyReportNotFound(error: unknown) {
  const apiError = error as ApiFailure | undefined;
  return apiError?.error?.code === "daily_report_not_found";
}

export function getReportErrorMessage(error: unknown) {
  return getErrorMessage(error, "Unable to load the daily report right now.");
}

export function getLocalDateString() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

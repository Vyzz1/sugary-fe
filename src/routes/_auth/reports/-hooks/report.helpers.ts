import { getErrorMessage } from "@/lib/error";
import type {
  DailyReportData,
  DailyReportResponse,
  ReportSummaryData,
  ReportRiskLevel,
  ReportTopContributor,
  WeeklyReportData,
  WeeklyReportResponse,
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

export function formatReportDateRange(startDate: string, endDate: string) {
  const start = formatReportDate(startDate);
  const end = formatReportDate(endDate);

  return `${start} - ${end}`;
}

export function formatReportWeekRange(report: WeeklyReportData) {
  return formatReportDateRange(report.week_start_date, report.week_end_date);
}

export function formatMealType(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export function formatRiskLevel(risk: string) {
  return `${risk.charAt(0).toUpperCase()}${risk.slice(1)} risk`;
}

export function formatSugarValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
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

function normalizeReportData<TReport extends ReportSummaryData>(data: TReport): TReport {
  const insights = data.ai_insights;
  const topContributors = [...insights.top_contributors].sort(
    (left, right) => right.estimated_sugar_grams - left.estimated_sugar_grams
  );

  return {
    ...data,
    ai_insights: {
      summary: insights.summary || data.summary,
      top_contributors: topContributors,
      recommendations: insights.recommendations,
      pattern_signals: insights.pattern_signals,
    },
  };
}

export function normalizeReportResponse(response: DailyReportResponse): DailyReportData {
  return normalizeReportData(response.data);
}

export function normalizeWeeklyReportResponse(response: WeeklyReportResponse): WeeklyReportData {
  return normalizeReportData(response.data);
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

export function isWeeklyReportNotFound(error: unknown) {
  const apiError = error as ApiFailure | undefined;
  return apiError?.error?.code === "weekly_report_not_found";
}

export function getReportErrorMessage(error: unknown) {
  return getErrorMessage(error, "Unable to load the report right now.");
}

export function getLocalDateString() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function toLocalDateString(date: Date) {
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

export function getDefaultDailyReportDate() {
  return toLocalDateString(addDays(new Date(), -1));
}

export function getWeekStartDate(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
}

export function getDefaultWeeklyReportStart() {
  return toLocalDateString(addDays(getWeekStartDate(new Date()), -7));
}

export function getWeekEndDateString(weekStart: string) {
  return toLocalDateString(addDays(new Date(`${weekStart}T00:00:00`), 6));
}

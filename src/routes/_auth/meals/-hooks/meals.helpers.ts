import type { TodayMeal } from "../../today/-queries/today.query";
import type { MealsHistoryQueryParams } from "../-queries/meals.query";

export interface MealsFilterValues {
  start_date: string;
  end_date: string;
  q: string;
  meal_type: TodayMeal["meal_type"] | "all";
}

export function getLocalDateString() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

export function getDateDaysAgo(daysAgo: number) {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

export function getDefaultMealsFilterValues(): MealsFilterValues {
  return {
    start_date: getDateDaysAgo(6),
    end_date: getLocalDateString(),
    q: "",
    meal_type: "all",
  };
}

export function normalizeMealsFilters(filters: MealsFilterValues): MealsHistoryQueryParams {
  return {
    start_date: filters.start_date,
    end_date: filters.end_date,
    q: filters.q.trim() || undefined,
    meal_type: filters.meal_type === "all" ? undefined : filters.meal_type,
    sort_by: "recorded_at",
    sort_type: "desc",
  };
}

export function toMealDateKey(recordedAt: string) {
  const date = new Date(recordedAt);
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

export function formatHistorySectionDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatHistoryRangeLabel(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(new Date(`${startDate}T00:00:00`))} - ${formatter.format(
    new Date(`${endDate}T00:00:00`)
  )}`;
}

export function groupMealsByDay(meals: TodayMeal[]) {
  const groups = new Map<string, TodayMeal[]>();

  for (const meal of meals) {
    const dateKey = toMealDateKey(meal.recorded_at);
    const currentMeals = groups.get(dateKey) ?? [];
    currentMeals.push(meal);
    groups.set(dateKey, currentMeals);
  }

  return Array.from(groups.entries()).map(([dateKey, dayMeals]) => ({
    dateKey,
    meals: dayMeals,
  }));
}

export function hasMealsFiltersApplied(filters: MealsFilterValues) {
  const defaults = getDefaultMealsFilterValues();

  return (
    filters.q.trim().length > 0 ||
    filters.meal_type !== "all" ||
    filters.start_date !== defaults.start_date ||
    filters.end_date !== defaults.end_date
  );
}

export function buildMealsSummary(meals: TodayMeal[]) {
  const analyzedMeals = meals.filter(
    (meal): meal is TodayMeal & { analysis: NonNullable<TodayMeal["analysis"]> } =>
      meal.analysis_status === "completed" && Boolean(meal.analysis)
  );

  const totalSugar = analyzedMeals.reduce(
    (sum, meal) => sum + meal.analysis.estimated_sugar_grams,
    0
  );
  const highRiskCount = analyzedMeals.filter((meal) => meal.analysis.risk_level === "high").length;
  const averageSugar = analyzedMeals.length > 0 ? totalSugar / analyzedMeals.length : 0;

  return {
    analyzedCount: analyzedMeals.length,
    averageSugar,
    highRiskCount,
    totalSugar,
  };
}

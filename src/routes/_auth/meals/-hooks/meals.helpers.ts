import type { TodayMeal } from "../../today/-queries/today.query";
import type { MealsHistoryQueryParams } from "../-queries/meals.query";

export interface MealsFilterValues {
  start_date: string;
  end_date: string;
  q: string;
  meal_type: TodayMeal["meal_type"] | "all";
  sort_by:
    | "recorded_at"
    | "dish_name"
    | "meal_type"
    | "estimated_sugar_grams"
    | "estimated_calories";
  sort_type: "desc" | "asc";
}

export const mealsSortOptions = [
  {
    value: "recorded_at_desc",
    label: "Newest first",
    group: "Time",
    sort_by: "recorded_at",
    sort_type: "desc",
  },
  {
    value: "recorded_at_asc",
    label: "Oldest first",
    group: "Time",
    sort_by: "recorded_at",
    sort_type: "asc",
  },
  {
    value: "dish_name_asc",
    label: "Name A-Z",
    group: "Name",
    sort_by: "dish_name",
    sort_type: "asc",
  },
  {
    value: "dish_name_desc",
    label: "Name Z-A",
    group: "Name",
    sort_by: "dish_name",
    sort_type: "desc",
  },
  {
    value: "estimated_sugar_grams_desc",
    label: "Highest sugar",
    group: "Nutrition",
    sort_by: "estimated_sugar_grams",
    sort_type: "desc",
  },
  {
    value: "estimated_sugar_grams_asc",
    label: "Lowest sugar",
    group: "Nutrition",
    sort_by: "estimated_sugar_grams",
    sort_type: "asc",
  },
  {
    value: "estimated_calories_desc",
    label: "Highest calories",
    group: "Nutrition",
    sort_by: "estimated_calories",
    sort_type: "desc",
  },
  {
    value: "estimated_calories_asc",
    label: "Lowest calories",
    group: "Nutrition",
    sort_by: "estimated_calories",
    sort_type: "asc",
  },
] as const;

export type MealsSortOptionValue = (typeof mealsSortOptions)[number]["value"];

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
    sort_by: "recorded_at",
    sort_type: "desc",
  };
}

export function normalizeMealsFilters(filters: MealsFilterValues): MealsHistoryQueryParams {
  return {
    start_date: filters.start_date,
    end_date: filters.end_date,
    q: filters.q.trim() || undefined,
    meal_type: filters.meal_type === "all" ? undefined : filters.meal_type,
    sort_by: filters.sort_by,
    sort_type: filters.sort_type,
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
    filters.sort_by !== defaults.sort_by ||
    filters.sort_type !== defaults.sort_type ||
    filters.start_date !== defaults.start_date ||
    filters.end_date !== defaults.end_date
  );
}

export function formatMealsSortLabel(filters: Pick<MealsFilterValues, "sort_by" | "sort_type">) {
  return getMealsSortOption(filters)?.label ?? "Time: Newest -> Oldest";
}

export function getMealsSortOption(filters: Pick<MealsFilterValues, "sort_by" | "sort_type">) {
  return mealsSortOptions.find(
    (option) => option.sort_by === filters.sort_by && option.sort_type === filters.sort_type
  );
}

export function toMealsSortOptionValue(
  filters: Pick<MealsFilterValues, "sort_by" | "sort_type">
): MealsSortOptionValue {
  return getMealsSortOption(filters)?.value ?? "recorded_at_desc";
}

export function fromMealsSortOptionValue(value: MealsSortOptionValue) {
  const option = mealsSortOptions.find((item) => item.value === value) ?? mealsSortOptions[0];

  return {
    sort_by: option.sort_by,
    sort_type: option.sort_type,
  };
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

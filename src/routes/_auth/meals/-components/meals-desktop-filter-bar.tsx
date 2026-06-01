import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatMealType } from "../../today/-hooks/add-meal.helpers";
import type { TodayMeal } from "../../today/-queries/today.query";
import { mealsSortOptions, type MealsSortOptionValue } from "../-hooks/meals.helpers";

const mealTypeOptions: Array<TodayMeal["meal_type"] | "all"> = [
  "all",
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "drink",
  "unspecified",
];

export function MealsDesktopFilterBar({
  endDate,
  mealType,
  onEndDateChange,
  onMealTypeChange,
  onSearchChange,
  onSortChange,
  onStartDateChange,
  search,
  sortValue,
  startDate,
}: {
  endDate: string;
  mealType: TodayMeal["meal_type"] | "all";
  onEndDateChange: (value: string) => void;
  onMealTypeChange: (value: TodayMeal["meal_type"] | "all") => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: MealsSortOptionValue) => void;
  onStartDateChange: (value: string) => void;
  search: string;
  sortValue: MealsSortOptionValue;
  startDate: string;
}) {
  return (
    <section className="hidden rounded-2xl border border-border bg-card p-5 md:block">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Search meals</span>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 rounded-xl border-border bg-background pl-10"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by dish name"
              type="search"
              value={search}
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Start date</span>
          <Input
            className="h-11 rounded-xl border-border bg-background"
            max={endDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            type="date"
            value={startDate}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">End date</span>
          <Input
            className="h-11 rounded-xl border-border bg-background"
            min={startDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            type="date"
            value={endDate}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Meal type</span>
          <select
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            onChange={(event) => onMealTypeChange(event.target.value as TodayMeal["meal_type"] | "all")}
            value={mealType}
          >
            {mealTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All meal types" : formatMealType(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Sort</span>
          <select
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            onChange={(event) => onSortChange(event.target.value as MealsSortOptionValue)}
            value={sortValue}
          >
            {mealsSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* TODO: wire risk_level filter when backend/query support is available. */}
      {/* TODO: wire analysis_status filter when backend/query support is available. */}
    </section>
  );
}

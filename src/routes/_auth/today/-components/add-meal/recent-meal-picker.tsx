import * as React from "react";
import { useDeferredValue } from "react";
import { Clock3, Flame, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecentMealsQuery } from "../../-hooks/useRecentMealsQuery";
import { formatMealType } from "../../-hooks/add-meal.helpers";

export function RecentMealPicker({
  selectedMealId,
  onSelectMeal,
}: {
  selectedMealId: number | null;
  onSelectMeal: (mealId: number) => void;
}) {
  const [query, setQuery] = React.useState("");
  const deferredQuery = useDeferredValue(query);
  const recentMealsQuery = useRecentMealsQuery(deferredQuery, true);
  const meals = recentMealsQuery.data?.data ?? [];

  return (
    <div className="space-y-4">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Search recent meals</span>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="rounded-xl pl-10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recent meals..."
            value={query}
          />
        </div>
      </label>

      <div className="max-h-[28vh] space-y-2 overflow-y-auto pr-1">
        {recentMealsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading recent meals...</p>
        ) : meals.length === 0 ? (
          <RecentMealsEmptyState
            hasQuery={Boolean(deferredQuery)}
            onClearQuery={() => setQuery("")}
          />
        ) : (
          meals.map((meal) => {
            const isSelected = selectedMealId === meal.id;

            return (
              <button
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isSelected ? "border-primary bg-primary/6" : "border-border bg-card"
                }`}
                key={meal.id}
                onClick={() => onSelectMeal(meal.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{meal.dish_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatMealType(meal.meal_type)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <Flame className="size-3.5" />
                    {meal.analysis.estimated_sugar_grams} g
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {meal.analysis.estimated_calories} kcal
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function RecentMealsEmptyState({
  hasQuery,
  onClearQuery,
}: {
  hasQuery: boolean;
  onClearQuery: () => void;
}) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center sm:min-h-40 sm:px-6">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock3 className="size-4.5" />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {hasQuery ? "No matching meals found" : "No recent meals yet"}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {hasQuery
            ? "Try a shorter keyword or clear the search to browse all recent meals."
            : "Meals you log today will appear here for quick reuse next time."}
        </p>
      </div>

      {hasQuery ? (
        <Button className="mt-4" onClick={onClearQuery} size="sm" type="button" variant="outline">
          Clear search
        </Button>
      ) : null}
    </div>
  );
}

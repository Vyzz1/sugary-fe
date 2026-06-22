import * as React from "react";
import { ChevronRight, Clock3, Flame, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRecentMealsQuery } from "../../-hooks/useRecentMealsQuery";
import { formatMealType } from "../../-hooks/add-meal.helpers";
import type { TodayMeal, TodayMealAnalysis } from "../../-queries/today.query";

export function RecentMealPicker({
  selectedMeal,
  onSelectMeal,
}: {
  selectedMeal: TodayMeal | null;
  onSelectMeal: (meal: TodayMeal) => void;
}) {
  const isMobile = useIsMobile();
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlightedMealId, setHighlightedMealId] = React.useState<number | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const recentMealsQuery = useRecentMealsQuery(debouncedQuery, true);
  const meals = recentMealsQuery.data?.data ?? [];

  React.useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    if (meals.length === 0) {
      setHighlightedMealId(null);
      return;
    }

    setHighlightedMealId((currentMealId) => {
      if (currentMealId && meals.some((meal) => meal.id === currentMealId)) {
        return currentMealId;
      }

      if (selectedMeal?.id && meals.some((meal) => meal.id === selectedMeal.id)) {
        return selectedMeal.id;
      }

      return meals[0].id;
    });
  }, [isPickerOpen, meals, selectedMeal?.id]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Recent meal</span>
        <button
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/20"
          onClick={() => setIsPickerOpen(true)}
          type="button"
        >
          <div className="min-w-0 flex-1">
            {selectedMeal ? (
              <div className="space-y-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {selectedMeal.dish_name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                  <span>{formatMealType(selectedMeal.meal_type)}</span>
                  <span>•</span>
                  <span>{getMealSugar(selectedMeal)} g sugar</span>
                  <span>•</span>
                  <span>{getMealCalories(selectedMeal)} kcal</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Choose a recent meal</p>
                <p className="text-sm text-muted-foreground">
                  Pick a past meal and log it again with a new time.
                </p>
              </div>
            )}
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>

      {isMobile ? (
        <Drawer onOpenChange={setIsPickerOpen} open={isPickerOpen} repositionInputs={false}>
          <DrawerContent className="h-[calc(100dvh-4rem)]">
            <DrawerHeader>
              <DrawerTitle>Select recent meal</DrawerTitle>
              <DrawerDescription>Search and reuse a meal you logged before.</DrawerDescription>
            </DrawerHeader>
            <div className="h-full flex-1 overflow-y-auto px-4 pb-6">
              <RecentMealPickerPanel
                meals={meals}
                highlightedMealId={highlightedMealId}
                onClearQuery={() => setQuery("")}
                onHighlightMeal={setHighlightedMealId}
                onQueryChange={setQuery}
                onSelectMeal={(meal) => {
                  onSelectMeal(meal);
                  setIsPickerOpen(false);
                }}
                query={query}
                recentMealsQuery={recentMealsQuery}
                selectedMealId={selectedMeal?.id ?? null}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : isPickerOpen ? (
        <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/30 p-6 backdrop-blur-sm md:flex">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div>
                <h2 className="font-heading text-2xl text-foreground">Select recent meal</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search and reuse a meal you logged before.
                </p>
              </div>
              <Button
                onClick={() => setIsPickerOpen(false)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="h-full max-h-[80vh] overflow-y-auto px-6 py-5">
              <RecentMealPickerPanel
                meals={meals}
                highlightedMealId={highlightedMealId}
                onClearQuery={() => setQuery("")}
                onHighlightMeal={setHighlightedMealId}
                onQueryChange={setQuery}
                onSelectMeal={(meal) => {
                  onSelectMeal(meal);
                  setIsPickerOpen(false);
                }}
                query={query}
                recentMealsQuery={recentMealsQuery}
                selectedMealId={selectedMeal?.id ?? null}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RecentMealPickerPanel({
  query,
  onQueryChange,
  onClearQuery,
  meals,
  highlightedMealId,
  selectedMealId,
  onHighlightMeal,
  onSelectMeal,
  recentMealsQuery,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onClearQuery: () => void;
  meals: TodayMeal[];
  highlightedMealId: number | null;
  selectedMealId: number | null;
  onHighlightMeal: (mealId: number | null) => void;
  onSelectMeal: (meal: TodayMeal) => void;
  recentMealsQuery: ReturnType<typeof useRecentMealsQuery>;
}) {
  const hasQuery = Boolean(query.trim());
  const highlightedMealIndex = meals.findIndex((meal) => meal.id === highlightedMealId);
  const highlightedMeal =
    highlightedMealIndex >= 0 ? meals[highlightedMealIndex] : (meals[0] ?? null);
  const highlightedMealRefs = React.useRef(new Map<number, HTMLButtonElement>());

  React.useEffect(() => {
    if (!highlightedMealId) {
      return;
    }

    highlightedMealRefs.current.get(highlightedMealId)?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedMealId]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (recentMealsQuery.isLoading || meals.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex =
        highlightedMealIndex >= 0 ? Math.min(highlightedMealIndex + 1, meals.length - 1) : 0;
      onHighlightMeal(meals[nextIndex].id);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = highlightedMealIndex >= 0 ? Math.max(highlightedMealIndex - 1, 0) : 0;
      onHighlightMeal(meals[nextIndex].id);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onSelectMeal(highlightedMeal);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4 md:h-[440px]">
      <label className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Search recent meals</span>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="rounded-xl pl-10"
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search recent meals..."
            value={query}
          />
        </div>
      </label>

      <div className="flex min-h-0 flex-1 overflow-y-auto pr-1">
        {recentMealsQuery.isLoading ? (
          <div className="w-full space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-14" />
                </div>
                <Skeleton className="mt-2 h-4 w-16" />
              </div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <RecentMealsEmptyState hasQuery={hasQuery} onClearQuery={onClearQuery} />
        ) : (
          <div className="w-full space-y-2">
            {meals.map((meal) => {
              const isSelected = selectedMealId === meal.id;
              const isHighlighted = highlightedMealId === meal.id;

              return (
                <button
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/6"
                      : isHighlighted
                        ? "border-primary/60 bg-primary/4"
                        : "border-border bg-card"
                  }`}
                  key={meal.id}
                  onClick={() => onSelectMeal(meal)}
                  onMouseEnter={() => onHighlightMeal(meal.id)}
                  ref={(element) => {
                    if (element) {
                      highlightedMealRefs.current.set(meal.id, element);
                      return;
                    }

                    highlightedMealRefs.current.delete(meal.id);
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-foreground">
                        {meal.dish_name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatMealType(meal.meal_type)}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                      <Flame className="size-3.5" />
                      {getMealSugar(meal)} g
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{getMealCalories(meal)} kcal</p>
                </button>
              );
            })}
          </div>
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
    <div className="flex min-h-full flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center sm:px-6">
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

function getMealSugar(meal: { analysis?: TodayMealAnalysis | null }) {
  return meal.analysis?.estimated_sugar_grams ?? 0;
}

function getMealCalories(meal: { analysis?: TodayMealAnalysis | null }) {
  return meal.analysis?.estimated_calories ?? 0;
}

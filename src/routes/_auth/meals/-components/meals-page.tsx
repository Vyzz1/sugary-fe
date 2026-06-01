import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { getErrorMessage } from "@/lib/error";
import { AddMealDialog } from "../../today/-components/add-meal/add-meal-dialog";
import { AddMealDrawer } from "../../today/-components/add-meal/add-meal-drawer";
import { AddMealForm } from "../../today/-components/add-meal/add-meal-form";
import { EditAnalysisForm } from "../../today/-components/edit-analysis-form";
import type { ImagePickerIntent } from "../../today/-components/add-meal/image-picker";
import { useDeleteMealMutation } from "../../today/-hooks/useDeleteMealMutation";
import type { TodayMeal } from "../../today/-queries/today.query";
import { MealsDesktopFilterBar } from "./meals-desktop-filter-bar";
import { MealsFilterDrawer } from "./meals-filter-drawer";
import { MealHistoryItem } from "./meal-history-item";
import { MealsMobileFilterBar } from "./meals-mobile-filter-bar";
import { MealsSortDrawer } from "./meals-sort-drawer";
import { MealsSummaryGrid } from "./meals-summary-grid";
import {
  buildMealsSummary,
  fromMealsSortOptionValue,
  formatMealsSortLabel,
  formatHistoryRangeLabel,
  formatHistorySectionDate,
  getDefaultMealsFilterValues,
  groupMealsByDay,
  hasMealsFiltersApplied,
  normalizeMealsFilters,
  toMealsSortOptionValue,
  toMealDateKey,
  type MealsFilterValues,
  type MealsSortOptionValue,
} from "../-hooks/meals.helpers";
import { useMealsInfiniteQuery } from "../-hooks/useMealsInfiniteQuery";

export function MealsPage() {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<MealsFilterValues>(getDefaultMealsFilterValues);
  const [mobileDrawerFilters, setMobileDrawerFilters] =
    useState<MealsFilterValues>(getDefaultMealsFilterValues);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);
  const [isMobileSortDrawerOpen, setIsMobileSortDrawerOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isEditMealOpen, setIsEditMealOpen] = useState(false);
  const [isEditAnalysisOpen, setIsEditAnalysisOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addMealSessionKey, setAddMealSessionKey] = useState(0);
  const [editMealSessionKey, setEditMealSessionKey] = useState(0);
  const [editAnalysisSessionKey, setEditAnalysisSessionKey] = useState(0);
  const [defaultImageIntent, setDefaultImageIntent] = useState<ImagePickerIntent>("manual");
  const [mealPendingDelete, setMealPendingDelete] = useState<TodayMeal | null>(null);
  const [mealEditing, setMealEditing] = useState<TodayMeal | null>(null);
  const [mealEditingAnalysis, setMealEditingAnalysis] = useState<TodayMeal | null>(null);
  const debouncedSearch = useDebounce(filters.q, 300);
  const queryFilters = useMemo(
    () => normalizeMealsFilters({ ...filters, q: debouncedSearch }),
    [debouncedSearch, filters]
  );
  const mealsQuery = useMealsInfiniteQuery(queryFilters);
  const deleteMealMutation = useDeleteMealMutation();

  const allMeals = useMemo(
    () => mealsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [mealsQuery.data?.pages]
  );
  const groupedMeals = useMemo(() => groupMealsByDay(allMeals), [allMeals]);
  const latestMeta = mealsQuery.data?.pages[mealsQuery.data.pages.length - 1]?.meta;
  const mealsSummary = useMemo(() => buildMealsSummary(allMeals), [allMeals]);
  const deletingMealId = deleteMealMutation.isPending ? deleteMealMutation.variables.mealId : null;
  const appliedFilters = hasMealsFiltersApplied(filters);
  const rangeLabel = formatHistoryRangeLabel(filters.start_date, filters.end_date);
  const sortLabel = formatMealsSortLabel(filters);
  const selectedSortValue = toMealsSortOptionValue(filters);

  useEffect(() => {
    if (!mealsQuery.hasNextPage || mealsQuery.isFetchingNextPage) {
      return;
    }

    const sentinel = document.getElementById("meals-history-sentinel");

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          void mealsQuery.fetchNextPage();
        }
      },
      { rootMargin: "320px 0px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [mealsQuery]);

  const openAddMeal = (intent: ImagePickerIntent) => {
    setDefaultImageIntent(intent);
    setAddMealSessionKey((current) => current + 1);
    setIsAddMealOpen(true);
  };

  const resetFilters = () => {
    const nextFilters = getDefaultMealsFilterValues();
    setFilters(nextFilters);
    setMobileDrawerFilters(nextFilters);
  };

  const handleOpenMobileFilters = () => {
    setMobileDrawerFilters(filters);
    setIsMobileFilterDrawerOpen(true);
  };

  const handleMobileSortSelect = (value: MealsSortOptionValue) => {
    const nextSort = fromMealsSortOptionValue(value);
    setFilters((current) => ({ ...current, ...nextSort }));
    setMobileDrawerFilters((current) => ({ ...current, ...nextSort }));
    setIsMobileSortDrawerOpen(false);
  };

  const handleApplyMobileFilters = () => {
    setFilters(mobileDrawerFilters);
    setIsMobileFilterDrawerOpen(false);
  };

  const handleClearMobileFilters = () => {
    resetFilters();
    setIsMobileFilterDrawerOpen(false);
  };

  const handleOpenEditMeal = (meal: TodayMeal) => {
    setMealEditing(meal);
    setEditMealSessionKey((current) => current + 1);
    setIsEditMealOpen(true);
  };

  const handleOpenEditAnalysis = (meal: TodayMeal) => {
    setMealEditingAnalysis(meal);
    setEditAnalysisSessionKey((current) => current + 1);
    setIsEditAnalysisOpen(true);
  };

  const handleOpenDeleteDialog = (meal: TodayMeal) => {
    setMealPendingDelete(meal);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMeal = async () => {
    if (!mealPendingDelete) {
      return;
    }

    try {
      await deleteMealMutation.mutateAsync({
        mealId: mealPendingDelete.id,
        dateKey: toMealDateKey(mealPendingDelete.recorded_at),
      });
      toast.success("Meal deleted successfully.");
      setIsDeleteDialogOpen(false);
      setMealPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete meal right now."));
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);

    if (!open) {
      window.setTimeout(() => {
        setMealPendingDelete(null);
      }, 200);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 pb-24 sm:space-y-5 sm:px-5 lg:px-6">
      <MealsMobileFilterBar
        highRiskCount={mealsSummary.highRiskCount}
        mealsFound={latestMeta?.total ?? allMeals.length}
        onAddMeal={() => openAddMeal("camera")}
        onOpenFilters={handleOpenMobileFilters}
        onOpenSort={() => setIsMobileSortDrawerOpen(true)}
        onSearchChange={(value) => {
          setFilters((current) => ({ ...current, q: value }));
          setMobileDrawerFilters((current) => ({ ...current, q: value }));
        }}
        rangeLabel={rangeLabel}
        search={filters.q}
        sortLabel={sortLabel}
        totalSugar={mealsSummary.totalSugar}
      />

      <section className="hidden rounded-2xl border border-border bg-card px-5 py-5 md:block">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{rangeLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Meals</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Search meal history, review AI nutrition estimates, and correct entries across days.
            </p>
          </div>

          <Button className="h-11 shrink-0 rounded-xl" onClick={() => openAddMeal("upload")} type="button">
            Add meal
          </Button>
        </div>
      </section>

      <MealsDesktopFilterBar
        endDate={filters.end_date}
        mealType={filters.meal_type}
        onEndDateChange={(value) => setFilters((current) => ({ ...current, end_date: value }))}
        onMealTypeChange={(value) => setFilters((current) => ({ ...current, meal_type: value }))}
        onSearchChange={(value) => setFilters((current) => ({ ...current, q: value }))}
        onSortChange={(value) =>
          setFilters((current) => ({ ...current, ...fromMealsSortOptionValue(value) }))
        }
        onStartDateChange={(value) => setFilters((current) => ({ ...current, start_date: value }))}
        search={filters.q}
        sortValue={selectedSortValue}
        startDate={filters.start_date}
      />

      <MealsSummaryGrid
        averageSugar={mealsSummary.averageSugar}
        highRiskCount={mealsSummary.highRiskCount}
        mealsFound={latestMeta?.total ?? allMeals.length}
        totalSugar={mealsSummary.totalSugar}
      />

      {mealsQuery.isLoading ? <MealsLoadingState /> : null}

      {mealsQuery.isError ? (
        <section className="rounded-2xl border border-destructive/20 bg-destructive/8 p-5 sm:p-6">
          <p className="text-lg font-semibold text-foreground">Unable to load meals</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getErrorMessage(mealsQuery.error, "Unable to load meals right now.")}
          </p>
          <div className="mt-4">
            <Button onClick={() => void mealsQuery.refetch()} type="button" variant="outline">
              Retry
            </Button>
          </div>
        </section>
      ) : null}

      {!mealsQuery.isLoading && !mealsQuery.isError ? (
        <>
          {allMeals.length > 0 ? (
            <div className="space-y-5 sm:space-y-6">
              {groupedMeals.map((group) => (
                <section key={group.dateKey} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {group.dateKey}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-foreground">
                        {formatHistorySectionDate(group.dateKey)}
                      </h2>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {group.meals.length} meal{group.meals.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.meals.map((meal) => (
                      <MealHistoryItem
                        key={meal.id}
                        isDeleting={deletingMealId === meal.id}
                        meal={meal}
                        onDelete={handleOpenDeleteDialog}
                        onEdit={handleOpenEditMeal}
                        onEditAnalysis={handleOpenEditAnalysis}
                      />
                    ))}
                  </div>
                </section>
              ))}

              <div className="flex flex-col items-center gap-3 pt-2">
                <div id="meals-history-sentinel" />
                {mealsQuery.isFetchingNextPage ? (
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading more meals...
                  </div>
                ) : null}
                {mealsQuery.hasNextPage ? (
                  <Button onClick={() => void mealsQuery.fetchNextPage()} type="button" variant="outline">
                    <ChevronDown className="size-4" />
                    Load more
                  </Button>
                ) : allMeals.length > 0 ? (
                  <p className="text-sm text-muted-foreground">You&apos;ve reached the end of this range.</p>
                ) : null}
              </div>
            </div>
          ) : (
            <MealsEmptyState
              hasFilters={appliedFilters}
              onAddMeal={() => openAddMeal("manual")}
              onClearFilters={resetFilters}
            />
          )}
        </>
      ) : null}

      <MealsFilterDrawer
        endDate={mobileDrawerFilters.end_date}
        mealType={mobileDrawerFilters.meal_type}
        onApply={handleApplyMobileFilters}
        onClear={handleClearMobileFilters}
        onEndDateChange={(value) =>
          setMobileDrawerFilters((current) => ({ ...current, end_date: value }))
        }
        onMealTypeChange={(value) =>
          setMobileDrawerFilters((current) => ({ ...current, meal_type: value }))
        }
        onOpenChange={setIsMobileFilterDrawerOpen}
        onStartDateChange={(value) =>
          setMobileDrawerFilters((current) => ({ ...current, start_date: value }))
        }
        open={isMobileFilterDrawerOpen}
        startDate={mobileDrawerFilters.start_date}
      />
      <MealsSortDrawer
        onOpenChange={setIsMobileSortDrawerOpen}
        onSelect={handleMobileSortSelect}
        open={isMobileSortDrawerOpen}
        selectedValue={selectedSortValue}
      />

      {isMobile ? (
        <>
          <AddMealDrawer
            description="Take a photo, upload an image, or log a meal manually."
            onOpenChange={setIsAddMealOpen}
            open={isAddMealOpen}
            title="Add meal"
          >
            <AddMealForm
              key={addMealSessionKey}
              dateKey={filters.end_date}
              defaultIntent={defaultImageIntent}
              defaultTab="new"
              onSuccess={() => setIsAddMealOpen(false)}
            />
          </AddMealDrawer>
          <AddMealDrawer
            description="Update meal details, image, and recorded time."
            onOpenChange={(open) => {
              setIsEditMealOpen(open);
              if (!open) {
                setMealEditing(null);
              }
            }}
            open={isEditMealOpen}
            title="Edit meal"
          >
            <AddMealForm
              key={editMealSessionKey}
              dateKey={mealEditing ? toMealDateKey(mealEditing.recorded_at) : filters.end_date}
              defaultIntent="manual"
              defaultTab="new"
              initialMeal={mealEditing}
              mode="edit"
              onSuccess={() => {
                setIsEditMealOpen(false);
                setMealEditing(null);
              }}
            />
          </AddMealDrawer>
          <AddMealDrawer
            description="Adjust the AI nutrition estimates for this meal."
            onOpenChange={(open) => {
              setIsEditAnalysisOpen(open);
              if (!open) {
                setMealEditingAnalysis(null);
              }
            }}
            open={isEditAnalysisOpen}
            title="Edit analysis"
          >
            <EditAnalysisForm
              key={editAnalysisSessionKey}
              dateKey={
                mealEditingAnalysis ? toMealDateKey(mealEditingAnalysis.recorded_at) : filters.end_date
              }
              meal={mealEditingAnalysis}
              onSuccess={() => {
                setIsEditAnalysisOpen(false);
                setMealEditingAnalysis(null);
              }}
            />
          </AddMealDrawer>
        </>
      ) : (
        <>
          <AddMealDialog
            description="Take a photo, upload an image, or log a meal manually."
            onOpenChange={setIsAddMealOpen}
            open={isAddMealOpen}
            title="Add meal"
          >
            <AddMealForm
              key={addMealSessionKey}
              dateKey={filters.end_date}
              defaultIntent={defaultImageIntent}
              defaultTab="new"
              onSuccess={() => setIsAddMealOpen(false)}
            />
          </AddMealDialog>
          <AddMealDialog
            description="Update meal details, image, and recorded time."
            onOpenChange={(open) => {
              setIsEditMealOpen(open);
              if (!open) {
                setMealEditing(null);
              }
            }}
            open={isEditMealOpen}
            title="Edit meal"
          >
            <AddMealForm
              key={editMealSessionKey}
              dateKey={mealEditing ? toMealDateKey(mealEditing.recorded_at) : filters.end_date}
              defaultIntent="manual"
              defaultTab="new"
              initialMeal={mealEditing}
              mode="edit"
              onSuccess={() => {
                setIsEditMealOpen(false);
                setMealEditing(null);
              }}
            />
          </AddMealDialog>
          <AddMealDialog
            description="Adjust the AI nutrition estimates for this meal."
            onOpenChange={(open) => {
              setIsEditAnalysisOpen(open);
              if (!open) {
                setMealEditingAnalysis(null);
              }
            }}
            open={isEditAnalysisOpen}
            title="Edit analysis"
          >
            <EditAnalysisForm
              key={editAnalysisSessionKey}
              dateKey={
                mealEditingAnalysis ? toMealDateKey(mealEditingAnalysis.recorded_at) : filters.end_date
              }
              meal={mealEditingAnalysis}
              onSuccess={() => {
                setIsEditAnalysisOpen(false);
                setMealEditingAnalysis(null);
              }}
            />
          </AddMealDialog>
        </>
      )}

      <AlertDialog onOpenChange={handleDeleteDialogOpenChange} open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete meal?</AlertDialogTitle>
            <AlertDialogDescription>
              {mealPendingDelete
                ? `This will remove "${mealPendingDelete.dish_name}" from meal history.`
                : "This will remove the selected meal from meal history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMealMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteMealMutation.isPending} onClick={handleDeleteMeal}>
              {deleteMealMutation.isPending ? "Deleting..." : "Delete meal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MealsEmptyState({
  hasFilters,
  onAddMeal,
  onClearFilters,
}: {
  hasFilters: boolean;
  onAddMeal: () => void;
  onClearFilters: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-center sm:p-7">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/6 text-primary">
        <Search className="size-5" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground">
        {hasFilters ? "No meals match these filters" : "No meals in this range"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {hasFilters
          ? "Try a wider date range, a different meal type, or clear the current search."
          : "Add a meal to start building your searchable history."}
      </p>
      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        {hasFilters ? (
          <Button onClick={onClearFilters} type="button" variant="outline">
            Clear filters
          </Button>
        ) : null}
        <Button onClick={onAddMeal} type="button">
          Add meal
        </Button>
      </div>
    </section>
  );
}

function MealsLoadingState() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-3 md:hidden">
        <Skeleton className="h-7 w-24 rounded-xl" />
        <Skeleton className="h-5 w-40 rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>

      <div className="hidden space-y-4 md:block">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>

      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-40 w-full rounded-2xl" />
      ))}
    </div>
  );
}

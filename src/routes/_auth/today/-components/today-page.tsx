import { useState } from "react";
import { toast } from "sonner";
import { Activity, AlertTriangle, CalendarDays, Flame, Soup } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { getErrorMessage } from "@/lib/error";
import { AddMealDialog } from "./add-meal/add-meal-dialog";
import { AddMealDrawer } from "./add-meal/add-meal-drawer";
import { AddMealForm } from "./add-meal/add-meal-form";
import { EditAnalysisForm } from "./edit-analysis-form";
import {
  AddMealTrigger,
  type AddMealTriggerIntent,
} from "./add-meal/add-meal-trigger";
import { useDeleteMealMutation } from "../-hooks/useDeleteMealMutation";
import { useTodayMealsQuery } from "../-hooks/useTodayMealsQuery";
import { TodayMealCard } from "./today-meal-card";
import type { TodayMeal } from "../-queries/today.query";
import type { ImagePickerIntent } from "./add-meal/image-picker";

export function TodayPage() {
  const [isRiskWatchOpen, setIsRiskWatchOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth >= 640;
  });
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isEditMealOpen, setIsEditMealOpen] = useState(false);
  const [isEditAnalysisOpen, setIsEditAnalysisOpen] = useState(false);
  const [addMealSessionKey, setAddMealSessionKey] = useState(0);
  const [editMealSessionKey, setEditMealSessionKey] = useState(0);
  const [editAnalysisSessionKey, setEditAnalysisSessionKey] = useState(0);
  const [defaultTab, setDefaultTab] = useState<"new" | "recent">("new");
  const [defaultImageIntent, setDefaultImageIntent] = useState<ImagePickerIntent>("manual");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mealPendingDelete, setMealPendingDelete] = useState<TodayMeal | null>(null);
  const [mealEditing, setMealEditing] = useState<TodayMeal | null>(null);
  const [mealEditingAnalysis, setMealEditingAnalysis] = useState<TodayMeal | null>(null);
  const isMobile = useIsMobile();
  const date = getLocalDateString();
  const todayMealsQuery = useTodayMealsQuery(date);
  const deleteMealMutation = useDeleteMealMutation(date);

  if (todayMealsQuery.isLoading) {
    return <TodayLoadingState />;
  }

  if (todayMealsQuery.isError) {
    return (
      <section className="border border-destructive/30 bg-destructive/8 p-5 text-sm text-destructive sm:p-6">
        Unable to load today&apos;s meals right now.
      </section>
    );
  }

  const response = todayMealsQuery.data;
  const meals = response?.data ?? [];
  const meta = response?.meta;
  const summary = buildTodaySummary(meals);

  const openAddMeal = (intent: AddMealTriggerIntent) => {
    const prefersMobile =
      typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : isMobile;

    if (intent === "recent") {
      setDefaultTab("recent");
      setDefaultImageIntent("manual");
    } else if (intent === "camera") {
      setDefaultTab("new");
      setDefaultImageIntent(prefersMobile ? "camera" : "upload");
    } else {
      setDefaultTab("new");
      setDefaultImageIntent("manual");
    }

    setAddMealSessionKey((current) => current + 1);
    setIsAddMealOpen(true);
  };

  const handleDeleteMeal = async () => {
    if (!mealPendingDelete) {
      return;
    }

    try {
      await deleteMealMutation.mutateAsync(mealPendingDelete.id);
      toast.success("Meal deleted successfully.");
      setIsDeleteDialogOpen(false);
      setMealPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete meal right now."));
    }
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

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);

    if (!open) {
      window.setTimeout(() => {
        setMealPendingDelete(null);
      }, 200);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
        <div className="border border-border bg-card px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarDays className="size-4" />
                {meta?.date ?? date}
              </div>
              <h2 className="mt-2 max-w-lg font-heading text-xl leading-tight text-foreground sm:text-3xl">
                Today&apos;s sugar check.
              </h2>
              <p className="mt-1.5 max-w-lg text-sm leading-5 text-muted-foreground sm:leading-6">
                Review meals and spot high-risk intake quickly.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <AddMealTrigger intent="camera" onClick={() => openAddMeal("camera")} />
            <AddMealTrigger intent="manual" onClick={() => openAddMeal("manual")} />
            <AddMealTrigger
              className="hidden sm:inline-flex"
              intent="recent"
              onClick={() => openAddMeal("recent")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <SummaryTile icon={Soup} label="Meals logged" value={String(meta?.count ?? meals.length)} />
          <SummaryTile
            icon={Flame}
            label="Total sugar"
            value={`${summary.totalSugar.toFixed(1)} g`}
          />
          <SummaryTile
            icon={Activity}
            label="Total calories"
            value={`${summary.totalCalories} kcal`}
          />
          <SummaryTile
            icon={AlertTriangle}
            label="High-risk meals"
            value={String(summary.highRiskCount)}
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr] xl:gap-6">
        <div className="space-y-3 sm:space-y-4">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <TodayMealCard
                key={meal.id}
                isDeleting={deleteMealMutation.isPending && deleteMealMutation.variables === meal.id}
                meal={meal}
                onEdit={handleOpenEditMeal}
                onEditAnalysis={handleOpenEditAnalysis}
                onDelete={handleOpenDeleteDialog}
              />
            ))
          ) : (
            <EmptyTodayState onAddFirstMeal={() => openAddMeal("first")} />
          )}
        </div>

        <aside className="space-y-3 sm:space-y-4">
          <section className="border border-border bg-card">
            <button
              aria-expanded={isRiskWatchOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
              onClick={() => setIsRiskWatchOpen((current) => !current)}
              type="button"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Risk watch
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {summary.highRiskCount} high-risk meal{summary.highRiskCount === 1 ? "" : "s"}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {isRiskWatchOpen ? "Hide" : "Show"}
              </span>
            </button>

            {isRiskWatchOpen ? (
              <div className="border-t border-border px-4 py-4 sm:px-5 sm:py-5">
                <div className="space-y-2.5 sm:space-y-3">
                  {summary.highRiskMeals.length > 0 ? (
                    summary.highRiskMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="border border-rose-200 bg-rose-50 px-3 py-3 sm:px-4"
                      >
                        <p className="text-sm font-semibold text-rose-700">{meal.dish_name}</p>
                        <p className="mt-1 text-sm text-rose-700/80">
                          {meal.analysis.estimated_sugar_grams} g sugar, {meal.analysis.estimated_calories} kcal
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-muted-foreground">
                      No high-risk meals for this day.
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          <section className="border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Guidance
            </p>
            <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {summary.topNotes.map((note) => (
                <li key={note} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <AddMealTrigger
        className="fixed right-4 bottom-24 z-30 h-12 rounded-full px-5 text-sm font-semibold shadow-[0_18px_36px_-18px_oklch(0.32_0.17_290/.85)] sm:hidden"
        intent="floating"
        onClick={() => openAddMeal("manual")}
      />

      {isMobile ? (
        <>
          <AddMealDrawer
            description="Take a photo, upload an image, or reuse a recent meal."
            onOpenChange={setIsAddMealOpen}
            open={isAddMealOpen}
            title="Add meal"
          >
            <AddMealForm
              key={addMealSessionKey}
              dateKey={meta?.date ?? date}
              defaultIntent={defaultImageIntent}
              defaultTab={defaultTab}
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
              dateKey={meta?.date ?? date}
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
              dateKey={meta?.date ?? date}
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
            description="Take a photo, upload an image, or reuse a recent meal."
            onOpenChange={setIsAddMealOpen}
            open={isAddMealOpen}
            title="Add meal"
          >
            <AddMealForm
              key={addMealSessionKey}
              dateKey={meta?.date ?? date}
              defaultIntent={defaultImageIntent}
              defaultTab={defaultTab}
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
              dateKey={meta?.date ?? date}
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
              dateKey={meta?.date ?? date}
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
                ? `This will remove "${mealPendingDelete.dish_name}" from today's log.`
                : "This will remove the selected meal from today's log."}
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

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-card px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.16em]">
        <Icon className="size-4 text-primary" />
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground sm:mt-3 sm:text-2xl">{value}</p>
    </div>
  );
}

function TodayLoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-border bg-card px-6 py-8">
          <div className="h-4 w-32 bg-muted" />
          <div className="mt-4 h-10 w-3/4 bg-muted" />
          <div className="mt-3 h-5 w-full bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 border border-border bg-card" />
          ))}
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-72 border border-border bg-card" />
      ))}
    </div>
  );
}

function buildTodaySummary(meals: TodayMeal[]) {
  const totalSugar = meals.reduce((sum, meal) => sum + meal.analysis.estimated_sugar_grams, 0);
  const totalCalories = meals.reduce((sum, meal) => sum + meal.analysis.estimated_calories, 0);
  const highRiskMeals = meals.filter((meal) => meal.analysis.risk_level === "high");
  const topNotes = highRiskMeals.flatMap((meal) => meal.analysis.notes).slice(0, 4);

  return {
    totalSugar,
    totalCalories,
    highRiskCount: highRiskMeals.length,
    highRiskMeals,
    topNotes,
  };
}

function getLocalDateString() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
  return localTime.toISOString().slice(0, 10);
}

function EmptyTodayState({ onAddFirstMeal }: { onAddFirstMeal: () => void }) {
  return (
    <section className="border border-border bg-card px-5 py-8 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        No meals yet
      </p>
      <h3 className="mt-3 font-heading text-2xl text-foreground">Start today&apos;s log.</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Add the first meal to begin tracking sugar and nutrition for the day.
      </p>
      <div className="mt-5 flex justify-center">
        <AddMealTrigger intent="first" onClick={onAddFirstMeal} />
      </div>
    </section>
  );
}

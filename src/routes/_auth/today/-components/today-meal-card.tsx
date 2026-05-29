import {
  AlertTriangle,
  Bot,
  CircleHelp,
  Drumstick,
  Ellipsis,
  Flame,
  Loader2,
  Pencil,
  Sandwich,
  SlidersHorizontal,
  Trash2,
  UtensilsCrossed,
  GlassWater,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TodayMeal } from "../-queries/today.query";

const mealTypeMeta = {
  breakfast: {
    label: "Breakfast",
    icon: UtensilsCrossed,
  },
  lunch: {
    label: "Lunch",
    icon: Sandwich,
  },
  dinner: {
    label: "Dinner",
    icon: Drumstick,
  },
  snack: {
    label: "Snack",
    icon: Flame,
  },
  unspecified: {
    label: "Unspecified",
    icon: CircleHelp,
  },
  drink: {
    label: "Drink",
    icon: GlassWater,
  },
} as const;

const riskClassNames = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

const emptyAnalysis = {
  estimated_sugar_grams: 0,
  estimated_carbs_grams: 0,
  estimated_protein_grams: 0,
  estimated_calories: 0,
  risk_level: "low" as const,
  notes: [],
};

export function TodayMealCard({
  meal,
  isDeleting = false,
  onEdit,
  onEditAnalysis,
  onDelete,
}: {
  meal: TodayMeal;
  isDeleting?: boolean;
  onEdit?: (meal: TodayMeal) => void;
  onEditAnalysis?: (meal: TodayMeal) => void;
  onDelete?: (meal: TodayMeal) => void;
}) {
  const mealMeta = mealTypeMeta[meal.meal_type];
  const MealIcon = mealMeta.icon;
  const mealTime = formatMealTime(meal.recorded_at);
  const isAnalyzing = meal.analysis_status === "pending" || meal.analysis_status === "processing";
  const analysis = meal.analysis ?? emptyAnalysis;

  return (
    <article className="border border-primary/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_3%,white),white_18%)] p-3.5 sm:p-5">
      {meal.image_url ? (
        <div className="mb-4 overflow-hidden border border-primary/10 bg-muted/20 sm:mb-5">
          <img
            alt={meal.dish_name}
            className="aspect-[16/10] w-full object-cover"
            loading="lazy"
            src={meal.image_url}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 border border-primary/15 bg-primary/6 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:px-2.5 sm:text-xs sm:tracking-[0.16em]">
              <MealIcon className="size-3.5" />
              {mealMeta.label}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">{mealTime}</span>
            <span
              aria-label={`AI ${meal.analysis_status}`}
              className={`inline-flex items-center text-primary ${isAnalyzing ? "animate-pulse" : ""}`}
              title={`AI ${meal.analysis_status}`}
            >
              <Bot className="size-3.5" />
            </span>
            {meal.is_user_edited ? (
              <span className="text-xs font-semibold text-primary">Edited</span>
            ) : null}
          </div>
          <div>
            <h3 className="max-w-3xl text-base font-semibold text-foreground sm:text-xl">
              {meal.dish_name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between">
          {isAnalyzing ? (
            <span className="inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-xs sm:tracking-[0.14em]">
              <Loader2 className="size-3.5 animate-spin" />
              Analyzing
            </span>
          ) : meal.analysis_status === "failed" ? (
            <span className="inline-flex w-fit items-center gap-2 border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-destructive sm:text-xs sm:tracking-[0.14em]">
              <AlertTriangle className="size-3.5" />
              Failed
            </span>
          ) : (
            <span
              className={`inline-flex w-fit items-center gap-2 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.14em] ${riskClassNames[analysis.risk_level]}`}
            >
              <AlertTriangle className="size-3.5" />
              {analysis.risk_level} risk
            </span>
          )}
          <div className="hidden items-center gap-2 sm:flex">
            {onEdit ? (
              <Button
                aria-label={`Edit ${meal.dish_name}`}
                onClick={() => onEdit(meal)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Pencil className="size-4 text-primary" />
              </Button>
            ) : null}
            {onEditAnalysis ? (
              <Button
                aria-label={`Edit analysis for ${meal.dish_name}`}
                onClick={() => onEditAnalysis(meal)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <SlidersHorizontal className="size-4 text-primary" />
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                aria-label={`Delete ${meal.dish_name}`}
                disabled={isDeleting}
                onClick={() => onDelete(meal)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            ) : null}
          </div>
          {onEdit || onEditAnalysis || onDelete ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={`Meal actions for ${meal.dish_name}`}
                  className="sm:hidden"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Ellipsis className="size-4 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="sm:hidden">
                {onEdit ? (
                  <DropdownMenuItem onClick={() => onEdit(meal)}>
                    <Pencil className="size-4 text-primary" />
                    Edit meal
                  </DropdownMenuItem>
                ) : null}
                {onEditAnalysis ? (
                  <DropdownMenuItem onClick={() => onEditAnalysis(meal)}>
                    <SlidersHorizontal className="size-4 text-primary" />
                    Edit analysis
                  </DropdownMenuItem>
                ) : null}
                {onDelete ? (
                  <DropdownMenuItem
                    disabled={isDeleting}
                    onClick={() => onDelete(meal)}
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />
                    Delete meal
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="mt-4 flex animate-pulse flex-col items-center justify-center border border-primary/10 bg-primary/4 p-8 sm:mt-5">
          <Bot className="mb-3 size-8 text-primary/40" />
          <p className="text-sm font-semibold text-primary/60">Our AI is analyzing your meal...</p>
          <p className="mt-1 text-xs text-primary/40">This usually takes a few seconds.</p>
        </div>
      ) : meal.analysis_status === "failed" ? (
        <div className="mt-4 border border-destructive/10 bg-destructive/5 p-4 sm:mt-5">
          <p className="text-sm font-medium text-destructive">
            Failed to analyze this meal. Will retry automatically in a few minutes.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3">
            <MetricTile label="Sugar" unit="g" value={analysis.estimated_sugar_grams} />
            <MetricTile label="Carbs" unit="g" value={analysis.estimated_carbs_grams} />
            <MetricTile label="Protein" unit="g" value={analysis.estimated_protein_grams} />
            <MetricTile label="Calories" unit="kcal" value={analysis.estimated_calories} />
          </div>

          <div className="mt-4 space-y-2 sm:mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Notes
            </p>
            <ul className="space-y-1.5 sm:space-y-2">
              {analysis.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-2 text-sm leading-5 text-muted-foreground sm:leading-6"
                >
                  <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </article>
  );
}

function MetricTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="border border-primary/10 bg-primary/4 px-3 py-2.5 sm:py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80 sm:text-xs sm:tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-1.5 text-base font-semibold text-foreground sm:mt-2 sm:text-xl">
        {value}
        <span className="ml-1 text-xs font-medium text-muted-foreground sm:text-sm">{unit}</span>
      </p>
    </div>
  );
}

function formatMealTime(recordedAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(recordedAt));
}

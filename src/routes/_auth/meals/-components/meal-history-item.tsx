import {
  AlertTriangle,
  Bot,
  ChevronDown,
  CircleHelp,
  Drumstick,
  Ellipsis,
  Flame,
  GlassWater,
  Loader2,
  Pencil,
  Sandwich,
  SlidersHorizontal,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TodayMeal } from "../../today/-queries/today.query";

const mealTypeMeta = {
  breakfast: {
    label: "Breakfast",
    icon: UtensilsCrossed,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  lunch: {
    label: "Lunch",
    icon: Sandwich,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  dinner: {
    label: "Dinner",
    icon: Drumstick,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  snack: {
    label: "Snack",
    icon: Flame,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  drink: {
    label: "Drink",
    icon: GlassWater,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  unspecified: {
    label: "Unspecified",
    icon: CircleHelp,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
} as const;

const riskClassNames = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export function MealHistoryItem({
  isDeleting = false,
  meal,
  onDelete,
  onEdit,
  onEditAnalysis,
}: {
  isDeleting?: boolean;
  meal: TodayMeal;
  onDelete: (meal: TodayMeal) => void;
  onEdit: (meal: TodayMeal) => void;
  onEditAnalysis: (meal: TodayMeal) => void;
}) {
  const mealMeta = mealTypeMeta[meal.meal_type];
  const MealIcon = mealMeta.icon;
  const isAnalyzing = meal.analysis_status === "pending" || meal.analysis_status === "processing";
  const firstNote = meal.analysis?.notes[0];
  const [isNotesOpen, setIsNotesOpen] = React.useState(false);
  const hasMoreNotes = (meal.analysis?.notes.length ?? 0) > 1;
  const remainingNotes = hasMoreNotes ? (meal.analysis?.notes.slice(1) ?? []) : [];
  const statusDotClassName = isAnalyzing
    ? "bg-sky-500 animate-pulse"
    : meal.analysis_status === "failed"
      ? "bg-rose-500"
      : "bg-emerald-500";

  return (
    <article className="overflow-hidden rounded-lg border border-primary/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_2.5%,white),white_22%)]">
      <div className="flex">
        {meal.image_url ? (
          <img
            alt={meal.dish_name}
            className="size-[88px] shrink-0 object-cover"
            loading="lazy"
            src={meal.image_url}
          />
        ) : (
          <div className="flex size-[88px] shrink-0 items-center justify-center bg-primary/6 text-primary/70">
            <MealIcon className="size-5" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-[5px] px-[13px] pt-[11px] pr-3 pb-[11px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 border px-[7px] py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-primary)_6%,white)] ${mealMeta.className}`}
                  style={{ borderRadius: 4 }}
                >
                  <MealIcon className="size-3.5" />
                  {mealMeta.label}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatMealTime(meal.recorded_at)}
                </span>
                <span
                  aria-label={`AI ${meal.analysis_status}`}
                  className={`size-1.5 rounded-full ${statusDotClassName}`}
                  title={`AI ${meal.analysis_status}`}
                />
                {meal.is_user_edited ? (
                  <span className="text-xs font-semibold text-primary/85">Edited</span>
                ) : null}
              </div>

              <h3 className="mt-2 truncate text-[15px] font-medium leading-[1.3] tracking-[-0.01em] text-foreground">
                {meal.dish_name}
              </h3>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={`Meal actions for ${meal.dish_name}`}
                  className="size-[26px] rounded-md hover:bg-primary/8"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Ellipsis className="size-3.5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(meal)}>
                  <Pencil className="size-4 text-primary" />
                  Edit meal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditAnalysis(meal)}>
                  <SlidersHorizontal className="size-4 text-primary" />
                  Edit analysis
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => onDelete(meal)}
                  variant="destructive"
                >
                  <Trash2 className="size-4" />
                  Delete meal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex min-h-6 items-center">
            {meal.analysis_status === "failed" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-700">
                <AlertTriangle className="size-3.5" />
                Failed
              </span>
            ) : meal.analysis ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${riskClassNames[meal.analysis.risk_level]}`}
              >
                <AlertTriangle className="size-3.5" />
                {meal.analysis.risk_level} risk
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {meal.analysis ? (
        <div className="grid grid-cols-4 border-t border-primary/10 ">
          <MetricCell label="Sugar" unit="g" value={meal.analysis.estimated_sugar_grams} />
          <MetricCell label="Carbs" unit="g" value={meal.analysis.estimated_carbs_grams} />
          <MetricCell label="Protein" unit="g" value={meal.analysis.estimated_protein_grams} />
          <MetricCell
            isLast
            label="Calories"
            unit="kcal"
            value={meal.analysis.estimated_calories}
          />
        </div>
      ) : null}

      {isAnalyzing ? (
        <FooterStrip>
          <Loader2 className="size-3 animate-spin" />
          <span>Analyzing nutrition data…</span>
        </FooterStrip>
      ) : meal.analysis_status === "failed" ? (
        <FooterStrip className="border-t-rose-200 bg-rose-50 text-rose-700">
          <Bot className="size-3.5" />
          <span>Failed to analyze this meal. Edit meal or analysis to correct it.</span>
        </FooterStrip>
      ) : firstNote ? (
        <div className="border-t border-primary/10 bg-primary/5">
          <FooterStrip className="border-t-0 bg-transparent">
            <Bot className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1">{firstNote}</span>
            {hasMoreNotes ? (
              <button
                aria-expanded={isNotesOpen}
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-primary/75 transition-colors hover:bg-primary/8 hover:text-primary"
                onClick={() => setIsNotesOpen((current) => !current)}
                type="button"
              >
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${isNotesOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : null}
          </FooterStrip>

          {hasMoreNotes ? (
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${isNotesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="space-y-1 border-t border-primary/10 px-3 py-[7px] text-[11.5px] leading-[1.5] text-muted-foreground">
                  {remainingNotes.map((note) => (
                    <div key={note} className="flex gap-1.5">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-primary/45" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function MetricCell({
  isLast = false,
  label,
  unit,
  value,
}: {
  isLast?: boolean;
  label: string;
  unit: string;
  value: number;
}) {
  return (
    <div className={`min-w-0 px-0 py-2 pl-2.5 ${isLast ? "" : "border-r border-primary/10"}`}>
      <p className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-primary/65">
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap font-mono text-[14px] font-medium text-foreground">
        {value}
        <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

function FooterStrip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 border-t border-primary/10 px-3 py-[7px] text-[11.5px] leading-[1.5] text-muted-foreground ${className}`}
    >
      {children}
    </div>
  );
}

function formatMealTime(recordedAt: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(recordedAt));
}

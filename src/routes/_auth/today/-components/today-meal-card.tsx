import { AlertTriangle, CircleHelp, Drumstick, Flame, Sandwich, UtensilsCrossed } from "lucide-react";
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
} as const;

const riskClassNames = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export function TodayMealCard({ meal }: { meal: TodayMeal }) {
  const mealMeta = mealTypeMeta[meal.meal_type];
  const MealIcon = mealMeta.icon;
  const mealTime = formatMealTime(meal.recorded_at);

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
            {meal.is_user_edited ? (
              <span className="text-xs font-semibold text-primary">Edited</span>
            ) : null}
          </div>
          <div>
            <h3 className="max-w-3xl text-base font-semibold text-foreground sm:text-xl">
              {meal.dish_name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Analysis status: <span className="font-medium text-foreground">{meal.analysis_status}</span>
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.14em] ${riskClassNames[meal.analysis.risk_level]}`}
        >
          <AlertTriangle className="size-3.5" />
          {meal.analysis.risk_level} risk
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 sm:grid-cols-4">
        <MetricTile label="Sugar" unit="g" value={meal.analysis.estimated_sugar_grams} />
        <MetricTile label="Carbs" unit="g" value={meal.analysis.estimated_carbs_grams} />
        <MetricTile label="Protein" unit="g" value={meal.analysis.estimated_protein_grams} />
        <MetricTile label="Calories" unit="kcal" value={meal.analysis.estimated_calories} />
      </div>

      <div className="mt-4 space-y-2 sm:mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Notes
        </p>
        <ul className="space-y-1.5 sm:space-y-2">
          {meal.analysis.notes.map((note) => (
            <li key={note} className="flex gap-2 text-sm leading-5 text-muted-foreground sm:leading-6">
              <span className="mt-2 size-1.5 shrink-0 bg-primary" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function MetricTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
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

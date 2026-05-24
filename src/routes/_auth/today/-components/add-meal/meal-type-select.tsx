import { formatMealType, type MealType } from "../../-hooks/add-meal.helpers";
import { Label } from "@/components/ui/label";

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack", "unspecified"];

export function MealTypeSelect({
  value,
  onChange,
}: {
  value: MealType;
  onChange: (value: MealType) => void;
}) {
  return (
    <label className="space-y-2">
      <Label>Meal type</Label>
      <select
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        onChange={(event) => onChange(event.target.value as MealType)}
        value={value}
      >
        {mealTypes.map((mealType) => (
          <option key={mealType} value={mealType}>
            {formatMealType(mealType)}
          </option>
        ))}
      </select>
    </label>
  );
}

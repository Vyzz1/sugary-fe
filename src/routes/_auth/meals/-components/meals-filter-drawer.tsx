import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { formatMealType } from "../../today/-hooks/add-meal.helpers";
import type { TodayMeal } from "../../today/-queries/today.query";

const mealTypeOptions: Array<TodayMeal["meal_type"] | "all"> = [
  "all",
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "drink",
  "unspecified",
];

export function MealsFilterDrawer({
  endDate,
  mealType,
  onApply,
  onClear,
  onEndDateChange,
  onMealTypeChange,
  onOpenChange,
  onStartDateChange,
  open,
  startDate,
}: {
  endDate: string;
  mealType: TodayMeal["meal_type"] | "all";
  onApply: () => void;
  onClear: () => void;
  onEndDateChange: (value: string) => void;
  onMealTypeChange: (value: TodayMeal["meal_type"] | "all") => void;
  onOpenChange: (open: boolean) => void;
  onStartDateChange: (value: string) => void;
  open: boolean;
  startDate: string;
}) {
  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent className="md:hidden">
        <DrawerHeader className="px-3.5 pt-3.5 pb-2.5">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Adjust date range and meal type for meal history.</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-3.5 overflow-y-auto px-3.5 pb-3.5">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Start date</span>
            <Input
              className="h-9 rounded-xl border-border bg-background px-2.5 text-sm"
              max={endDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              type="date"
              value={startDate}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">End date</span>
            <Input
              className="h-9 rounded-xl border-border bg-background px-2.5 text-sm"
              min={startDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              type="date"
              value={endDate}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Meal type</span>
            <select
              className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
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

          {/* TODO: wire risk_level filter when backend/query support is available. */}
          {/* TODO: wire analysis_status filter when backend/query support is available. */}
        </div>

        <DrawerFooter className="p-3 pt-2">
          <Button className="h-9 rounded-xl text-sm" onClick={onApply} type="button">
            Apply filters
          </Button>
          <Button className="h-9 rounded-xl text-sm" onClick={onClear} type="button" variant="outline">
            Clear filters
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

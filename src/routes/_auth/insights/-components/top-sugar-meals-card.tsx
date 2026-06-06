import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatInsightDateTime,
  formatInsightNumber,
  formatMealTypeLabel,
  getRiskBadgeVariant,
} from "../-hooks/insight.helpers";
import { MetricText } from "./metric-text";
import type { InsightData } from "../-queries/insights.query";

export function TopSugarMealsCard({ insight }: { insight: InsightData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Sugar Meals</CardTitle>
        <CardDescription>Individual meals with the highest sugar estimate</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {insight.patterns.top_sugar_meals.map((meal) => (
          <div
            key={meal.meal_id}
            className="min-h-[104px] rounded-2xl border border-border bg-muted/25 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{meal.dish_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatMealTypeLabel(meal.meal_type)} - {formatInsightDateTime(meal.recorded_at)}
                </p>
              </div>
              <Badge variant={getRiskBadgeVariant(meal.risk_level)}>{meal.risk_level}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <MetricText label="Sugar" value={`${formatInsightNumber(meal.sugar_grams)} g`} />
              <MetricText
                label="Calories"
                value={`${formatInsightNumber(meal.calories, 0)} kcal`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

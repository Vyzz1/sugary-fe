import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInsightNumber } from "../-hooks/insight.helpers";
import { MetricText } from "./metric-text";
import type { InsightData } from "../-queries/insights.query";

export function TopSugarDishesCard({ insight }: { insight: InsightData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Sugar Dishes</CardTitle>
        <CardDescription>Recurring dishes ranked by sugar load</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {insight.patterns.top_sugar_dishes.map((dish) => (
          <div
            key={dish.dish_name}
            className="min-h-[104px] rounded-2xl border border-border bg-muted/25 p-3"
          >
            <p className="truncate text-sm font-semibold text-foreground">{dish.dish_name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Logged {dish.times_logged} time{dish.times_logged === 1 ? "" : "s"}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <MetricText
                label="Total"
                value={`${formatInsightNumber(dish.total_sugar_grams)} g`}
              />
              <MetricText label="Times" value={String(dish.times_logged)} />
              <MetricText
                label="Avg"
                value={`${formatInsightNumber(dish.average_sugar_grams)} g`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

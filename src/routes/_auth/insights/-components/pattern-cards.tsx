import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatInsightDate,
  formatInsightNumber,
  formatMealTypeLabel,
} from "../-hooks/insight.helpers";
import type { InsightData } from "../-queries/insights.query";

export function PatternCards({ insight }: { insight: InsightData }) {
  const patterns = [
    {
      label: "Worst day",
      value: insight.summary.worst_day
        ? `${formatInsightDate(insight.summary.worst_day.date)} - ${formatInsightNumber(
            insight.summary.worst_day.total_sugar_grams
          )} g`
        : "No data",
    },
    {
      label: "Best day",
      value: insight.summary.best_day
        ? `${formatInsightDate(insight.summary.best_day.date)} - ${formatInsightNumber(
            insight.summary.best_day.total_sugar_grams
          )} g`
        : "No data",
    },
    {
      label: "Worst meal type",
      value: insight.patterns.worst_meal_type
        ? `${formatMealTypeLabel(insight.patterns.worst_meal_type.meal_type)} - ${formatInsightNumber(
            insight.patterns.worst_meal_type.total_sugar_grams
          )} g`
        : "No data",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
      {patterns.map((pattern) => (
        <Card key={pattern.label} size="sm">
          <CardHeader>
            <CardDescription>{pattern.label}</CardDescription>
            <CardTitle className="text-base">{pattern.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}

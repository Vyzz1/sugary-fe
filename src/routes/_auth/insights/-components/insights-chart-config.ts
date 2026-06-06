import type { ChartConfig } from "@/components/ui/chart";
import type { InsightRiskLevel } from "../-queries/insights.query";

export const insightChartConfig = {
  sugar: {
    label: "Sugar",
    color: "var(--color-primary)",
  },
  total_sugar_grams: {
    label: "Sugar",
    color: "var(--color-primary)",
  },
  target: {
    label: "Target",
    color: "var(--color-muted-foreground)",
  },
  calories: {
    label: "Calories",
    color: "var(--color-chart-2, oklch(0.66 0.16 65))",
  },
  total_calories: {
    label: "Calories",
    color: "var(--color-chart-2, oklch(0.66 0.16 65))",
  },
  carbs: {
    label: "Carbs",
    color: "var(--color-chart-3, oklch(0.62 0.13 180))",
  },
  total_carbs_grams: {
    label: "Carbs",
    color: "var(--color-chart-3, oklch(0.62 0.13 180))",
  },
  protein: {
    label: "Protein",
    color: "var(--color-chart-4, oklch(0.58 0.14 285))",
  },
} satisfies ChartConfig;

export const riskColors: Record<InsightRiskLevel, string> = {
  none: "var(--color-muted)",
  low: "var(--color-primary)",
  medium: "#f59e0b",
  high: "#e11d48",
};

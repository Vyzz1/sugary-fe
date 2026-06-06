import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatInsightDate,
  formatInsightNumber,
  getSugarTrendTone,
} from "../-hooks/insight.helpers";
import type { InsightData } from "../-queries/insights.query";

export function HeroSummaryCard({ insight }: { insight: InsightData }) {
  const tone = getSugarTrendTone(insight.trend.sugar.direction);
  const TrendIcon =
    insight.trend.sugar.direction === "down"
      ? ArrowDown
      : insight.trend.sugar.direction === "up"
        ? ArrowUp
        : ArrowRight;

  return (
    <Card className="border-primary/12 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_5%,white),white_24%)]">
      <CardHeader>
        <CardDescription>
          {formatInsightDate(insight.range.from)} - {formatInsightDate(insight.range.to)}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tracking-tight md:text-4xl">
          {formatInsightNumber(insight.summary.average_sugar_per_day)} g
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Average sugar per day</p>
            <p className="mt-1 text-sm text-muted-foreground">{insight.trend.comparison_label}</p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${tone.className}`}
          >
            <TrendIcon className="size-4" />
            {tone.label} {Math.abs(insight.trend.sugar.percent).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

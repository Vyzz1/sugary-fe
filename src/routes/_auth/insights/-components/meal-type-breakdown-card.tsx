import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatInsightNumber, formatMealTypeLabel } from "../-hooks/insight.helpers";
import { insightChartConfig } from "./insights-chart-config";
import type { InsightData } from "../-queries/insights.query";

export function MealTypeBreakdownCard({ insight }: { insight: InsightData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugar by Meal Type</CardTitle>
        <CardDescription>Where sugar appears most often</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[260px] w-full" config={insightChartConfig}>
          <BarChart
            data={insight.charts.meal_type_breakdown}
            layout="vertical"
            margin={{ left: 4, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis dataKey="total_sugar_grams" hide type="number" />
            <YAxis
              axisLine={false}
              dataKey="meal_type"
              tickFormatter={formatMealTypeLabel}
              tickLine={false}
              type="category"
              width={76}
            />
            <ChartTooltip content={<MealTypeTooltip />} />
            <Bar dataKey="total_sugar_grams" fill="var(--color-sugar)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MealTypeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: InsightData["charts"]["meal_type_breakdown"][number] }>;
}) {
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  return (
    <div className="rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <p className="font-medium">{formatMealTypeLabel(data.meal_type)}</p>
      <p className="mt-1 text-muted-foreground">
        {formatInsightNumber(data.total_sugar_grams)} g sugar
      </p>
      <p className="text-muted-foreground">{data.meal_count} meals</p>
      <p className="text-muted-foreground">{formatInsightNumber(data.average_sugar_grams)} g avg</p>
    </div>
  );
}

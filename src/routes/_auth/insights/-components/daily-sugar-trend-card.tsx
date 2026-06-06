import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { formatInsightDate, formatInsightNumber } from "../-hooks/insight.helpers";
import { insightChartConfig } from "./insights-chart-config";
import type { InsightData } from "../-queries/insights.query";

export function DailySugarTrendCard({ insight }: { insight: InsightData }) {
  const target = insight.charts.daily_sugar.find((day) => day.target_grams)?.target_grams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sugar Trend</CardTitle>
        <CardDescription>Sugar, carbs, calories, and daily target</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[240px] w-full" config={insightChartConfig}>
          <AreaChart data={insight.charts.daily_sugar} margin={{ left: -20, right: 12, top: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tickFormatter={formatInsightDate}
              tickLine={false}
            />
            <YAxis axisLine={false} tickLine={false} yAxisId="grams" />
            <YAxis axisLine={false} hide tickLine={false} yAxisId="calories" />
            <ChartTooltip content={<DailySugarTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            {target ? (
              <ReferenceLine
                stroke="var(--color-muted-foreground)"
                strokeDasharray="4 4"
                y={target}
              />
            ) : null}
            <Area
              dataKey="total_sugar_grams"
              fill="var(--color-total_sugar_grams)"
              fillOpacity={0.18}
              name="Sugar"
              stroke="var(--color-total_sugar_grams)"
              type="monotone"
              yAxisId="grams"
            />
            <Area
              dataKey="total_carbs_grams"
              fill="var(--color-total_carbs_grams)"
              fillOpacity={0.08}
              name="Carbs"
              stroke="var(--color-total_carbs_grams)"
              strokeWidth={1.5}
              type="monotone"
              yAxisId="grams"
            />
            <Area
              dataKey="total_calories"
              fill="var(--color-total_calories)"
              fillOpacity={0.05}
              name="Calories"
              stroke="var(--color-total_calories)"
              strokeWidth={1.5}
              type="monotone"
              yAxisId="calories"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function DailySugarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: InsightData["charts"]["daily_sugar"][number] }>;
}) {
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  return (
    <div className="rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <p className="font-medium">{formatInsightDate(data.date)}</p>
      <p className="mt-1 text-muted-foreground">
        {formatInsightNumber(data.total_sugar_grams)} g sugar
      </p>
      {data.total_carbs_grams !== undefined ? (
        <p className="text-muted-foreground">{formatInsightNumber(data.total_carbs_grams)} g carbs</p>
      ) : null}
      {data.total_protein_grams !== undefined ? (
        <p className="text-muted-foreground">
          {formatInsightNumber(data.total_protein_grams)} g protein
        </p>
      ) : null}
      {data.total_calories !== undefined ? (
        <p className="text-muted-foreground">
          {formatInsightNumber(data.total_calories, 0)} kcal
        </p>
      ) : null}
      <p className="text-muted-foreground">{data.meal_count} meals</p>
      <p className="text-muted-foreground">{data.risk_level} risk</p>
    </div>
  );
}

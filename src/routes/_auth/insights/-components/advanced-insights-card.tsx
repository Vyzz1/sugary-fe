import {
  Bar,
  BarChart,
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatInsightNumber } from "../-hooks/insight.helpers";
import { insightChartConfig } from "./insights-chart-config";
import type { InsightData } from "../-queries/insights.query";

export function AdvancedInsightsCard({ insight }: { insight: InsightData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>Longer range signals for deeper review</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion collapsible defaultValue="weekly" type="single">
          <AccordionItem value="weekly">
            <AccordionTrigger>Weekly Sugar Trend</AccordionTrigger>
            <AccordionContent>
              <ChartContainer className="h-[240px] w-full" config={insightChartConfig}>
                <BarChart data={insight.charts.weekly_sugar} margin={{ left: -20, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis axisLine={false} dataKey="week" tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<WeeklyTooltip />} />
                  <Bar dataKey="total_sugar_grams" fill="var(--color-sugar)" radius={6} />
                </BarChart>
              </ChartContainer>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="scatter">
            <AccordionTrigger>Sugar vs Calories</AccordionTrigger>
            <AccordionContent>
              <ChartContainer className="h-[260px] w-full" config={insightChartConfig}>
                <ScatterChart margin={{ bottom: 8, left: 8, right: 12, top: 8 }}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="sugar_grams"
                    name="Sugar"
                    tickLine={false}
                    type="number"
                    unit="g"
                  />
                  <YAxis
                    dataKey="calories"
                    name="Calories"
                    tickLine={false}
                    type="number"
                    unit="kcal"
                    width={64}
                  />
                  <ChartTooltip content={<ScatterTooltip />} />
                  <Scatter data={insight.charts.sugar_vs_calories} fill="var(--color-sugar)" />
                </ScatterChart>
              </ChartContainer>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function WeeklyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: InsightData["charts"]["weekly_sugar"][number] }>;
}) {
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  return (
    <div className="rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <p className="font-medium">{data.week}</p>
      <p className="mt-1 text-muted-foreground">
        {formatInsightNumber(data.total_sugar_grams)} g sugar
      </p>
      <p className="text-muted-foreground">{data.meal_count} meals</p>
      <p className="text-muted-foreground">{data.high_risk_meals} high-risk</p>
    </div>
  );
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: InsightData["charts"]["sugar_vs_calories"][number] }>;
}) {
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  return (
    <div className="max-w-64 rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <p className="truncate font-medium">{data.dish_name}</p>
      <p className="mt-1 text-muted-foreground">{formatInsightNumber(data.sugar_grams)} g sugar</p>
      <p className="text-muted-foreground">{formatInsightNumber(data.calories, 0)} kcal</p>
    </div>
  );
}

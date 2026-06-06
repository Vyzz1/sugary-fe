import { useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { formatInsightNumber, getRiskBadgeVariant } from "../-hooks/insight.helpers";
import { insightChartConfig, riskColors } from "./insights-chart-config";
import type { InsightData } from "../-queries/insights.query";

export function RiskDistributionCard({ insight }: { insight: InsightData }) {
  const totalMeals = useMemo(
    () => insight.charts.risk_distribution.reduce((sum, item) => sum + item.count, 0),
    [insight.charts.risk_distribution]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Meal risk levels in this range</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[250px] w-full" config={insightChartConfig}>
          <PieChart>
            <ChartTooltip content={<RiskTooltip />} />
            <Pie
              data={insight.charts.risk_distribution}
              dataKey="count"
              innerRadius={58}
              nameKey="risk_level"
              outerRadius={86}
              strokeWidth={2}
            >
              {insight.charts.risk_distribution.map((entry) => (
                <Cell key={entry.risk_level} fill={riskColors[entry.risk_level]} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  return (
                    <text textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan
                        className="fill-foreground text-xl font-semibold"
                        x={viewBox.cx}
                        y={viewBox.cy}
                      >
                        {totalMeals}
                      </tspan>
                      <tspan
                        className="fill-muted-foreground text-xs"
                        x={viewBox.cx}
                        y={viewBox.cy + 18}
                      >
                        meals
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {insight.charts.risk_distribution.map((entry) => (
            <Badge key={entry.risk_level} variant={getRiskBadgeVariant(entry.risk_level)}>
              {entry.risk_level}: {entry.count}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: InsightData["charts"]["risk_distribution"][number] }>;
}) {
  const data = payload?.[0]?.payload;

  if (!active || !data) return null;

  return (
    <div className="rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5">
      <p className="font-medium">{data.risk_level} risk</p>
      <p className="mt-1 text-muted-foreground">{data.count} meals</p>
      <p className="text-muted-foreground">{formatInsightNumber(data.percentage)}%</p>
    </div>
  );
}

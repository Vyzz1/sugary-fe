import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  formatReportDate,
  formatRiskLevel,
  formatSugarValue,
  getRiskBadgeClass,
} from "../-hooks/report.helpers";
import type { WeeklyReportData } from "../-queries/report.query";

const weeklyBreakdownChartConfig = {
  total_sugar_grams: {
    label: "Sugar",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function WeeklyBreakdownCard({ report }: { report: WeeklyReportData }) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Daily breakdown
        </p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">Sugar trend across the week</h3>
      </div>

      <ChartContainer
        className="mt-4 h-56 w-full"
        config={weeklyBreakdownChartConfig}
        initialDimension={{ width: 320, height: 224 }}
      >
        <AreaChart data={report.daily_breakdown} margin={{ left: -12, right: 12, top: 10 }}>
          <defs>
            <linearGradient id="weeklySugar" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--color-total_sugar_grams)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-total_sugar_grams)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            tickFormatter={formatChartDate}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickFormatter={(value) => `${value}g`}
            tickLine={false}
            tickMargin={8}
            width={42}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const day = item.payload as WeeklyReportData["daily_breakdown"][number];

                  return (
                    <div className="grid min-w-40 gap-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Sugar</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatSugarValue(Number(value))} g
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Average</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatSugarValue(day.average_sugar_grams)} g
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Meals</span>
                        <span className="font-mono font-medium text-foreground">
                          {day.meal_count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Risk</span>
                        <span className="font-medium text-foreground">
                          {formatRiskLevel(day.highest_risk_level)}
                        </span>
                      </div>
                    </div>
                  );
                }}
                labelFormatter={(value) => formatReportDate(String(value))}
              />
            }
          />
          <Area
            dataKey="total_sugar_grams"
            fill="url(#weeklySugar)"
            fillOpacity={1}
            stroke="var(--color-total_sugar_grams)"
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ChartContainer>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {report.daily_breakdown.map((day) => (
          <article
            key={day.date}
            className="min-w-0 rounded-xl border border-border bg-muted/25 p-3"
          >
            <div className="flex items-center justify-between gap-2 lg:block">
              <p className="text-xs font-semibold text-foreground">{formatChartDate(day.date)}</p>
              <span
                className={cn(
                  "inline-flex w-fit max-w-full items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
                  getRiskBadgeClass(day.highest_risk_level)
                )}
              >
                {day.highest_risk_level}
              </span>
            </div>
            <p className="mt-2 font-mono text-sm font-semibold text-foreground">
              {formatSugarValue(day.total_sugar_grams)} g
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{day.meal_count} meals</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

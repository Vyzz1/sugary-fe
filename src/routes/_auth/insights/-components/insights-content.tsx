import { AdvancedInsightsCard } from "./advanced-insights-card";
import { DailySugarTrendCard } from "./daily-sugar-trend-card";
import { HeroSummaryCard } from "./hero-summary-card";
import { MealTypeBreakdownCard } from "./meal-type-breakdown-card";
import { MetricGrid } from "./metric-grid";
import { PatternCards } from "./pattern-cards";
import { RiskDistributionCard } from "./risk-distribution-card";
import { TopSugarDishesCard } from "./top-sugar-dishes-card";
import { TopSugarMealsCard } from "./top-sugar-meals-card";
import type { InsightData } from "../-queries/insights.query";

export function InsightsContent({ insight }: { insight: InsightData }) {
  return (
    <>
      <HeroSummaryCard insight={insight} />
      <MetricGrid insight={insight} />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <DailySugarTrendCard insight={insight} />
        <PatternCards insight={insight} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <MealTypeBreakdownCard insight={insight} />
        <RiskDistributionCard insight={insight} />
      </div>
      <AdvancedInsightsCard insight={insight} />

      <div className="grid gap-4 lg:grid-cols-2">
        <TopSugarMealsCard insight={insight} />
        <TopSugarDishesCard insight={insight} />
      </div>
    </>
  );
}

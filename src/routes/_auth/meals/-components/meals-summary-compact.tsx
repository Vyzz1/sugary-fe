export function MealsSummaryCompact({
  highRiskCount,
  mealsFound,
  rangeLabel,
  totalSugar,
}: {
  highRiskCount: number;
  mealsFound: number;
  rangeLabel: string;
  totalSugar: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-sm md:hidden">
      <p className="text-foreground">
        <span className="font-semibold">{mealsFound} meals found</span>
        <span className="text-muted-foreground"> · {rangeLabel}</span>
      </p>
      {totalSugar > 0 || highRiskCount > 0 ? (
        <p className="mt-1 text-muted-foreground">
          {totalSugar > 0 ? `${totalSugar.toFixed(1)}g sugar` : "No completed analysis yet"}
          {highRiskCount > 0 ? ` · ${highRiskCount} high-risk` : ""}
        </p>
      ) : null}
    </div>
  );
}

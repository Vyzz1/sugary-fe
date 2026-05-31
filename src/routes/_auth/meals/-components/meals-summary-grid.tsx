export function MealsSummaryGrid({
  averageSugar,
  highRiskCount,
  mealsFound,
  totalSugar,
}: {
  averageSugar: number;
  highRiskCount: number;
  mealsFound: number;
  totalSugar: number;
}) {
  return (
    <section className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Meals found" value={String(mealsFound)} />
      <SummaryCard label="Loaded sugar" value={`${formatMetricValue(totalSugar)} g`} />
      <SummaryCard label="Avg sugar" value={`${formatMetricValue(averageSugar)} g`} />
      <SummaryCard label="High-risk loaded" value={String(highRiskCount)} />
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 break-words text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function formatMetricValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

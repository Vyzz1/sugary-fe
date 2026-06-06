import { Button } from "@/components/ui/button";
import type { InsightRange } from "../-queries/insights.query";

const rangeTabs: Array<{ label: string; value: InsightRange }> = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
];

export function InsightsHeader({
  onRangeChange,
  range,
}: {
  onRangeChange: (range: InsightRange) => void;
  range: InsightRange;
}) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Insight
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your sugar patterns</p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-1">
        {rangeTabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => onRangeChange(tab.value)}
            size="sm"
            type="button"
            variant={range === tab.value ? "default" : "ghost"}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </header>
  );
}

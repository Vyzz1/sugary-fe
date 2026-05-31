import { Activity, AlertTriangle, Flame, Soup } from "lucide-react";
import { formatRiskLevel, formatSugarValue, getRiskBadgeClass } from "../-hooks/report.helpers";
import { cn } from "@/lib/utils";
import type { DailyReportData } from "../-queries/report.query";

export function ReportStatsGrid({ report }: { report: DailyReportData }) {
  return (
    <section className="grid grid-cols-2 gap-2.5 sm:gap-3">
      <StatsCard icon={Soup} label="Meals logged" value={String(report.meal_count)} />
      <StatsCard icon={Flame} label="Total sugar" value={`${formatSugarValue(report.total_sugar_grams)} g`} />
      <StatsCard icon={Activity} label="Average sugar" value={`${formatSugarValue(report.average_sugar_grams)} g`} />
      <StatsRiskCard risk={report.highest_risk_level} />
    </section>
  );
}

function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
      <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.14em]">
        <Icon className="size-4 text-primary" />
        <span className="min-w-0 break-words">{label}</span>
      </div>
      <p className="mt-2 break-words text-base font-semibold text-foreground sm:mt-3 sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function StatsRiskCard({ risk }: { risk: DailyReportData["highest_risk_level"] }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-3.5 shadow-sm sm:p-4">
      <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.14em]">
        <AlertTriangle className="size-4 text-primary" />
        <span className="min-w-0 break-words">Highest risk</span>
      </div>
      <span
        className={cn(
          "mt-2 inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:mt-3 sm:px-3 sm:text-xs sm:tracking-[0.14em]",
          getRiskBadgeClass(risk)
        )}
      >
        {formatRiskLevel(risk)}
      </span>
    </div>
  );
}

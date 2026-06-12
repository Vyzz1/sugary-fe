import { AlertTriangle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatSugarValue,
  formatReportDate,
  formatReportWeekRange,
  formatRiskLevel,
  getRiskBadgeClass,
} from "../-hooks/report.helpers";
import type { DailyReportData, WeeklyReportData } from "../-queries/report.query";

export function DailyReportHero({
  report,
  mode,
}: {
  report: DailyReportData | WeeklyReportData;
  mode: "daily" | "weekly";
}) {
  const periodLabel = getReportPeriodLabel(report, mode);

  return (
    <section className="min-w-0 rounded-2xl border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_4%,white),white_18%)] p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="space-y-3">
        <div className="inline-flex max-w-full items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <CalendarDays className="size-4 text-primary" />
          <span className="min-w-0 break-words">{periodLabel}</span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="min-w-0 break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {formatSugarValue(report.total_sugar_grams)} g sugar
            </h2>
            <span
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                getRiskBadgeClass(report.highest_risk_level)
              )}
            >
              <AlertTriangle className="size-3.5" />
              {formatRiskLevel(report.highest_risk_level)}
            </span>
          </div>

          <p className="max-w-3xl break-words text-sm leading-6 text-muted-foreground">
            {report.ai_insights.summary || report.summary}
          </p>
        </div>
      </div>
    </section>
  );
}

function getReportPeriodLabel(report: DailyReportData | WeeklyReportData, mode: "daily" | "weekly") {
  if (mode === "weekly" && "week_start_date" in report) {
    return formatReportWeekRange(report);
  }

  if ("date" in report) {
    return formatReportDate(report.date);
  }

  return formatReportWeekRange(report);
}

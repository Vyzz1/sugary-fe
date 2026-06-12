import { AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyReportHero } from "./daily-report-hero";
import { PatternSignalsCard } from "./pattern-signals-card";
import { RecommendationsCard } from "./recommendations-card";
import { ReportHeader, type ReportMode } from "./report-header";
import { ReportStatsGrid } from "./report-stats-grid";
import { TopContributorsCard } from "./top-contributors-card";
import { WeeklyBreakdownCard } from "./weekly-breakdown-card";
import {
  getDefaultDailyReportDate,
  getDefaultWeeklyReportStart,
  getWeekStartDate,
  getReportErrorMessage,
  isDailyReportNotFound,
  isWeeklyReportNotFound,
  normalizeReportResponse,
  normalizeWeeklyReportResponse,
  toLocalDateString,
} from "../-hooks/report.helpers";
import { useDailyReportQuery } from "../-hooks/useDailyReportQuery";
import { useRunDailyReportMutation } from "../-hooks/useRunDailyReportMutation";
import { useRunWeeklyReportMutation } from "../-hooks/useRunWeeklyReportMutation";
import { useWeeklyReportQuery } from "../-hooks/useWeeklyReportQuery";
import type { DailyReportData, WeeklyReportData } from "../-queries/report.query";

export function ReportsPage() {
  const [mode, setMode] = useState<ReportMode>("daily");
  const [date, setDate] = useState(getDefaultDailyReportDate);
  const [weekStart, setWeekStart] = useState(getDefaultWeeklyReportStart);
  const dailyReportQuery = useDailyReportQuery(date, mode === "daily");
  const weeklyReportQuery = useWeeklyReportQuery(weekStart, mode === "weekly");
  const runDailyReportMutation = useRunDailyReportMutation();
  const runWeeklyReportMutation = useRunWeeklyReportMutation();
  const activeQuery = mode === "daily" ? dailyReportQuery : weeklyReportQuery;
  const activeMutation = mode === "daily" ? runDailyReportMutation : runWeeklyReportMutation;
  const isNotFound =
    activeQuery.isError &&
    (mode === "daily"
      ? isDailyReportNotFound(activeQuery.error)
      : isWeeklyReportNotFound(activeQuery.error));

  const handleGenerateReport = () => {
    if (mode === "daily") {
      runDailyReportMutation.mutate(date);
      return;
    }

    runWeeklyReportMutation.mutate(weekStart);
  };

  const handleWeekStartChange = (value: string) => {
    if (!value) {
      setWeekStart(value);
      return;
    }

    setWeekStart(toLocalDateString(getWeekStartDate(new Date(`${value}T00:00:00`))));
  };

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-5 overflow-x-hidden px-4 py-4 sm:space-y-6 sm:px-5 lg:px-6">
      <ReportHeader
        date={date}
        mode={mode}
        onDateChange={setDate}
        onModeChange={setMode}
        onWeekStartChange={handleWeekStartChange}
        weekStart={weekStart}
      />

      {activeMutation.isSuccess ? (
        <div className="rounded-2xl border border-primary/12 bg-primary/6 px-4 py-3 text-sm text-primary">
          Report job started. Refreshing the {mode} report.
        </div>
      ) : null}

      {activeMutation.isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {getReportErrorMessage(activeMutation.error)}
        </div>
      ) : null}

      {activeQuery.isLoading ? <ReportsLoadingState /> : null}

      {isNotFound ? (
        <ReportEmptyState
          isGenerating={activeMutation.isPending}
          mode={mode}
          onGenerate={handleGenerateReport}
        />
      ) : null}

      {activeQuery.isError && !isNotFound ? (
        <ReportErrorState
          errorMessage={getReportErrorMessage(activeQuery.error)}
          isGenerating={activeMutation.isPending}
          mode={mode}
          onGenerate={handleGenerateReport}
          onRetry={() => {
            void activeQuery.refetch();
          }}
        />
      ) : null}

      {mode === "daily" && dailyReportQuery.data ? (
        <ReportsContent mode={mode} report={normalizeReportResponse(dailyReportQuery.data)} />
      ) : null}

      {mode === "weekly" && weeklyReportQuery.data ? (
        <ReportsContent
          mode={mode}
          report={normalizeWeeklyReportResponse(weeklyReportQuery.data)}
        />
      ) : null}
    </div>
  );
}

function ReportsContent({
  mode,
  report,
}: {
  mode: ReportMode;
  report: DailyReportData | WeeklyReportData;
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <DailyReportHero mode={mode} report={report} />

      {mode === "weekly" && "daily_breakdown" in report ? (
        <WeeklyBreakdownCard report={report} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-5">
        <div className="space-y-4 sm:space-y-5">
          <TopContributorsCard
            contributors={report.ai_insights.top_contributors}
            periodLabel={mode === "weekly" ? "week" : "day"}
            totalSugar={report.total_sugar_grams}
          />
          <RecommendationsCard recommendations={report.ai_insights.recommendations} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ReportStatsGrid report={report} />
          <PatternSignalsCard
            patternSignals={report.ai_insights.pattern_signals}
            title={mode === "weekly" ? "Weekly patterns worth watching" : undefined}
          />
        </aside>
      </div>
    </div>
  );
}

function ReportEmptyState({
  mode,
  onGenerate,
  isGenerating,
}: {
  mode: ReportMode;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const periodLabel = mode === "weekly" ? "week" : "day";

  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        No report yet
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        No report for this {periodLabel} yet
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Log meals for the {periodLabel}, then generate a {periodLabel} report.
      </p>
      <div className="mt-5 flex justify-center">
        <Button disabled={isGenerating} onClick={onGenerate} type="button">
          <Sparkles className="size-4" />
          {isGenerating ? "Running report..." : "Generate report"}
        </Button>
      </div>
    </section>
  );
}

function ReportErrorState({
  mode,
  errorMessage,
  onRetry,
  onGenerate,
  isGenerating,
}: {
  mode: ReportMode;
  errorMessage: string;
  onRetry: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="rounded-2xl border border-destructive/20 bg-destructive/8 p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">Unable to load the report</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{errorMessage}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={onRetry} type="button" variant="outline">
              Retry
            </Button>
            <Button disabled={isGenerating} onClick={onGenerate} type="button">
              <Sparkles className="size-4" />
              {isGenerating ? "Running report..." : `Run ${mode} report manually`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportsLoadingState() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-10 w-2/3" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-5">
        <div className="space-y-4 sm:space-y-5">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

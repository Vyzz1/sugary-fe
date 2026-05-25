import { AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyReportHero } from "./daily-report-hero";
import { PatternSignalsCard } from "./pattern-signals-card";
import { RecommendationsCard } from "./recommendations-card";
import { ReportHeader } from "./report-header";
import { ReportStatsGrid } from "./report-stats-grid";
import { TopContributorsCard } from "./top-contributors-card";
import {
  getLocalDateString,
  getReportErrorMessage,
  isDailyReportNotFound,
  normalizeReportResponse,
} from "../-hooks/report.helpers";
import { useDailyReportQuery } from "../-hooks/useDailyReportQuery";
import { useRunDailyReportMutation } from "../-hooks/useRunDailyReportMutation";

export function ReportsPage() {
  const [date, setDate] = useState(getLocalDateString);
  const dailyReportQuery = useDailyReportQuery(date);
  const runDailyReportMutation = useRunDailyReportMutation();

  const handleGenerateReport = () => {
    runDailyReportMutation.mutate(date);
  };

  return (
    <div className="mx-auto min-w-0 max-w-7xl space-y-5 overflow-x-hidden px-4 py-4 sm:space-y-6 sm:px-5 lg:px-6">
      <ReportHeader
        date={date}
        onDateChange={setDate}
      />

      {runDailyReportMutation.isSuccess ? (
        <div className="rounded-2xl border border-primary/12 bg-primary/6 px-4 py-3 text-sm text-primary">
          Report job started. Refreshing the daily report.
        </div>
      ) : null}

      {runDailyReportMutation.isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {getReportErrorMessage(runDailyReportMutation.error)}
        </div>
      ) : null}

      {dailyReportQuery.isLoading ? <ReportsLoadingState /> : null}

      {dailyReportQuery.isError && isDailyReportNotFound(dailyReportQuery.error) ? (
        <ReportEmptyState
          isGenerating={runDailyReportMutation.isPending}
          onGenerate={handleGenerateReport}
        />
      ) : null}

      {dailyReportQuery.isError && !isDailyReportNotFound(dailyReportQuery.error) ? (
        <ReportErrorState
          errorMessage={getReportErrorMessage(dailyReportQuery.error)}
          isGenerating={runDailyReportMutation.isPending}
          onGenerate={handleGenerateReport}
          onRetry={() => {
            void dailyReportQuery.refetch();
          }}
        />
      ) : null}

      {dailyReportQuery.data ? (
        <ReportsContent report={normalizeReportResponse(dailyReportQuery.data)} />
      ) : null}
    </div>
  );
}

function ReportsContent({
  report,
}: {
  report: ReturnType<typeof normalizeReportResponse>;
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <DailyReportHero report={report} />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-5">
        <div className="space-y-4 sm:space-y-5">
          <TopContributorsCard
            contributors={report.ai_insights.top_contributors}
            totalSugar={report.total_sugar_grams}
          />
          <RecommendationsCard recommendations={report.ai_insights.recommendations} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ReportStatsGrid report={report} />
          <PatternSignalsCard patternSignals={report.ai_insights.pattern_signals} />
        </aside>
      </div>
    </div>
  );
}

function ReportEmptyState({
  onGenerate,
  isGenerating,
}: {
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        No report yet
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        No report for this day yet
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Log meals throughout the day, then generate a daily report.
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
  errorMessage,
  onRetry,
  onGenerate,
  isGenerating,
}: {
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
              {isGenerating ? "Running report..." : "Run report manually"}
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

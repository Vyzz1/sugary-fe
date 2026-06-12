import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatReportDateRange, getWeekEndDateString } from "../-hooks/report.helpers";

export type ReportMode = "daily" | "weekly";

export function ReportHeader({
  mode,
  onModeChange,
  date,
  onDateChange,
  weekStart,
  onWeekStartChange,
}: {
  mode: ReportMode;
  onModeChange: (value: ReportMode) => void;
  date: string;
  onDateChange: (value: string) => void;
  weekStart: string;
  onWeekStartChange: (value: string) => void;
}) {
  const weekRange = formatReportDateRange(weekStart, getWeekEndDateString(weekStart));

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {mode === "daily" ? "Daily report" : "Weekly report"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Sugar report
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Review sugar patterns and AI recommendations.
        </p>
      </div>

      <div className="flex w-fit rounded-2xl border border-border bg-card p-1">
        {(["daily", "weekly"] as const).map((item) => (
          <Button
            key={item}
            className={cn("rounded-xl px-4", mode !== item && "text-muted-foreground")}
            onClick={() => onModeChange(item)}
            size="sm"
            type="button"
            variant={mode === item ? "default" : "ghost"}
          >
            {item === "daily" ? "Daily" : "Weekly"}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        {mode === "daily" ? (
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="size-4 text-primary" />
              Report date
            </span>
            <input
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              onChange={(event) => onDateChange(event.target.value)}
              type="date"
              value={date}
            />
          </label>
        ) : (
          <label className="space-y-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <CalendarDays className="size-4 text-primary" />
            Week start
          </span>
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            onChange={(event) => onWeekStartChange(event.target.value)}
            type="date"
            value={weekStart}
          />
          <p className="text-xs text-muted-foreground">{weekRange}</p>
        </label>
        )}
      </div>
    </section>
  );
}

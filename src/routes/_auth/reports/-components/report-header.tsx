import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportHeader({
  date,
  onDateChange,
  onGenerate,
  isGenerating,
}: {
  date: string;
  onDateChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Daily report
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Sugar report
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Review daily sugar patterns and AI recommendations.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
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

        <Button
          className="h-11 w-full sm:mt-auto sm:w-auto"
          disabled={isGenerating}
          onClick={onGenerate}
          type="button"
        >
          <Sparkles className="size-4" />
          {isGenerating ? "Running report..." : "Generate report"}
        </Button>
      </div>
    </section>
  );
}

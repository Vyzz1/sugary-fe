import { ActivitySquare } from "lucide-react";

export function PatternSignalsCard({ patternSignals }: { patternSignals: string[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pattern signals
        </p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">Daily patterns worth watching</h3>
      </div>

      {patternSignals.length > 0 ? (
        <div className="mt-4 space-y-3">
          {patternSignals.map((signal) => (
            <article
              key={signal}
              className="rounded-2xl border border-border bg-muted/25 p-4"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ActivitySquare className="size-4" />
                </div>
                <p className="text-sm leading-6 text-foreground">{signal}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          No pattern signals detected.
        </p>
      )}
    </section>
  );
}

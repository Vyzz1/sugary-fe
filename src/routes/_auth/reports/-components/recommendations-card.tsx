import { CheckCheck } from "lucide-react";

export function RecommendationsCard({ recommendations }: { recommendations: string[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Recommendations
        </p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">Action plan for the next meals</h3>
      </div>

      {recommendations.length > 0 ? (
        <div className="mt-4 space-y-3">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation}
              className="flex gap-3 rounded-2xl border border-border bg-muted/25 p-4"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCheck className="size-4" />
              </div>
              <p className="text-sm leading-6 text-foreground">{recommendation}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          No recommendations for this day.
        </p>
      )}
    </section>
  );
}

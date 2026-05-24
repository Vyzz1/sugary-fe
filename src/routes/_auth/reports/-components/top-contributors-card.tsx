import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatMealType,
  formatRiskLevel,
  getRiskBadgeClass,
} from "../-hooks/report.helpers";
import type { ReportTopContributor } from "../-queries/report.query";

export function TopContributorsCard({
  contributors,
  totalSugar,
}: {
  contributors: ReportTopContributor[];
  totalSugar: number;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Top contributors
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">Meals driving sugar intake</h3>
        </div>
      </div>

      {contributors.length > 0 ? (
        <div className="mt-4 space-y-3">
          {contributors.map((contributor, index) => {
            const percent = totalSugar > 0 ? (contributor.estimated_sugar_grams / totalSugar) * 100 : 0;

            return (
              <article
                key={`${contributor.dish_name}-${index}`}
                className="min-w-0 rounded-2xl border border-border bg-muted/25 p-3.5 sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                      <h4 className="min-w-0 break-words text-sm font-semibold text-foreground sm:text-base">
                        {contributor.dish_name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatMealType(contributor.meal_type)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <span className="inline-flex min-w-0 items-center gap-1 text-sm font-medium text-foreground">
                        <ArrowUpRight className="size-4 text-primary" />
                        {contributor.estimated_sugar_grams} g sugar
                      </span>
                      <span
                        className={cn(
                          "inline-flex w-fit max-w-full items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                          getRiskBadgeClass(contributor.risk_level)
                        )}
                      >
                        {formatRiskLevel(contributor.risk_level)}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {percent.toFixed(0)}% of today&apos;s total sugar
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          No major sugar contributors found.
        </p>
      )}
    </section>
  );
}

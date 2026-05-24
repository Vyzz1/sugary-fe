interface SectionPlaceholderProps {
  title: string;
  description: string;
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Overview
        </p>
        <h2 className="mt-3 font-heading text-3xl text-foreground">{title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Recent activity</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This area is ready for live sugar entries, meal tracking, or report summaries.
          </p>
        </div>
        <div className="border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Next step</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Connect the real data views here once the feature APIs are wired.
          </p>
        </div>
      </div>
    </section>
  );
}

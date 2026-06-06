import { Activity, Flame, Soup, Target } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInsightNumber } from "../-hooks/insight.helpers";
import type { InsightData } from "../-queries/insights.query";

export function MetricGrid({ insight }: { insight: InsightData }) {
  const cards = [
    {
      label: "Total sugar",
      value: `${formatInsightNumber(insight.summary.total_sugar_grams)} g`,
      icon: Flame,
    },
    {
      label: "Avg / meal",
      value: `${formatInsightNumber(insight.summary.average_sugar_per_meal)} g`,
      icon: Activity,
    },
    {
      label: "High-risk meals",
      value: String(insight.summary.high_risk_meals),
      icon: Target,
    },
    {
      label: "Total meals",
      value: String(insight.summary.total_meals),
      icon: Soup,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-[0.14em]">
              <card.icon className="size-4 text-primary" />
              {card.label}
            </CardDescription>
            <CardTitle className="break-words text-xl font-semibold">{card.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}

import type { InsightRiskLevel } from "../-queries/insights.query";

export function formatInsightNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

export function formatInsightDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function formatInsightDateTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatMealTypeLabel(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export function getRiskBadgeVariant(risk: InsightRiskLevel) {
  if (risk === "high") return "destructive" as const;
  if (risk === "medium") return "secondary" as const;
  if (risk === "none") return "outline" as const;
  return "outline" as const;
}

export function getSugarTrendTone(direction: "up" | "down" | "stable") {
  if (direction === "down") {
    return {
      label: "Improving",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (direction === "up") {
    return {
      label: "Needs attention",
      className: "border-destructive/20 bg-destructive/8 text-destructive",
    };
  }

  return {
    label: "Stable",
    className: "border-border bg-muted/50 text-foreground",
  };
}

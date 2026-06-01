import { ArrowDownUp, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MealsSummaryCompact } from "./meals-summary-compact";

export function MealsMobileFilterBar({
  highRiskCount,
  mealsFound,
  onAddMeal,
  onOpenFilters,
  onOpenSort,
  onSearchChange,
  rangeLabel,
  search,
  sortLabel,
  totalSugar,
}: {
  highRiskCount: number;
  mealsFound: number;
  onAddMeal: () => void;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onSearchChange: (value: string) => void;
  rangeLabel: string;
  search: string;
  sortLabel: string;
  totalSugar: number;
}) {
  return (
    <section className="space-y-3 md:hidden">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Meals</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rangeLabel}</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 rounded-xl border-border bg-card pl-8.5 text-sm"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search meals..."
          type="search"
          value={search}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          className="h-9 rounded-xl px-3 text-sm"
          onClick={onOpenFilters}
          type="button"
          variant="outline"
        >
          <Filter className="size-4" />
          Filters
        </Button>
        <Button
          className="h-9 rounded-xl px-3 text-sm"
          onClick={onOpenSort}
          type="button"
          variant="outline"
        >
          <ArrowDownUp className="size-4" />
          Sort
        </Button>
        <Button className="h-9 rounded-xl px-3 text-sm" onClick={onAddMeal} type="button">
          <Plus className="size-4" />
          Add meal
        </Button>
      </div>

      <MealsSummaryCompact
        highRiskCount={highRiskCount}
        mealsFound={mealsFound}
        rangeLabel={`${rangeLabel} · ${sortLabel}`}
        totalSugar={totalSugar}
      />
    </section>
  );
}

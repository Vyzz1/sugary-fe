import { Link } from "@tanstack/react-router";
import { PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InsightsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PieChartIcon className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">No insight yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Log a few meals to see your sugar trend.
          </p>
        </div>
        <Button asChild>
          <Link to="/">Add meal</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function InsightsLoadingState() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-44 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[320px] rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    </div>
  );
}

import { formatReportDate } from "../-hooks/report.helpers";
import { useTodayMealsQuery } from "../../today/-hooks/useTodayMealsQuery";
import { MealHistoryItem } from "../../meals/-components/meal-history-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function ReportMealsDrawer({
  date,
  isOpen,
  onClose,
}: {
  date: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const title = date ? formatReportDate(date) : "Meals";

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[90dvh] flex flex-col">
          <DrawerHeader className="shrink-0 text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>Meals consumed on this day.</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
            <MealsList date={date} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 px-6 pt-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Meals consumed on this day.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6">
          <MealsList date={date} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MealsList({ date }: { date: string | null }) {
  const queryDate = date ? date.split("T")[0] : "";
  const { data, isLoading, isError } = useTodayMealsQuery(queryDate);

  if (!date) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/8 p-4 text-sm text-destructive">
        Failed to load meals for this date.
      </div>
    );
  }

  const meals = data?.data ?? [];

  if (meals.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No meals found for this date.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <MealHistoryItem key={meal.id} meal={meal} />
      ))}
    </div>
  );
}

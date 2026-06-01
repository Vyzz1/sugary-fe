import {
  ArrowDown,
  ArrowUp,
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { mealsSortOptions, type MealsSortOptionValue } from "../-hooks/meals.helpers";

const sortOptionGroups = [
  { key: "Time", label: "Time" },
  { key: "Nutrition", label: "Nutrition" },
  { key: "Name", label: "Name" },
] as const;

export function MealsSortDrawer({
  onOpenChange,
  onSelect,
  open,
  selectedValue,
}: {
  onOpenChange: (open: boolean) => void;
  onSelect: (value: MealsSortOptionValue) => void;
  open: boolean;
  selectedValue: MealsSortOptionValue;
}) {
  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent className="md:hidden">
        <DrawerHeader className="px-3.5 pt-3.5 pb-2.5">
          <DrawerTitle>Sort meals</DrawerTitle>
          <DrawerDescription>Choose how meal history should be ordered.</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-auto px-3.5 pb-4">
          {sortOptionGroups.map((group) => (
            <section key={group.key} className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-2">
                {mealsSortOptions
                  .filter((option) => option.group === group.key)
                  .map((option) => {
                    const isSelected = option.value === selectedValue;

                    return (
                      <Button
                        key={option.value}
                        className="h-auto min-h-11 w-full justify-between rounded-xl px-3 py-2.5 text-left"
                        onClick={() => onSelect(option.value)}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                      >
                        <span className="flex items-center gap-2">
                          <SortOptionIcon group={option.group} sortType={option.sort_type} />
                          <span className="text-[13px]">{option.label}</span>
                        </span>
                        {isSelected ? <Check className="size-4 shrink-0" /> : null}
                      </Button>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SortOptionIcon({
  group,
  sortType,
}: {
  group: "Time" | "Nutrition" | "Name";
  sortType: "desc" | "asc";
}) {
  if (group === "Name") {
    const Icon = sortType === "desc" ? ArrowDownAZ : ArrowUpAZ;
    return <Icon className="size-4 shrink-0" />;
  }

  const Icon = sortType === "desc" ? ArrowDown : ArrowUp;
  return <Icon className="size-4 shrink-0" />;
}

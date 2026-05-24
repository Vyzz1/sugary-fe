import { Camera, Plus, RotateCcw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const intentMap: Record<
  AddMealTriggerIntent,
  { label: string; icon: LucideIcon; variant: "default" | "outline" | "secondary" }
> = {
  camera: { label: "Take photo", icon: Camera, variant: "default" },
  manual: { label: "Add manually", icon: Plus, variant: "outline" },
  first: { label: "Add first meal", icon: Plus, variant: "default" },
  recent: { label: "Reuse recent meal", icon: RotateCcw, variant: "outline" },
  floating: { label: "Add meal", icon: Plus, variant: "default" },
};

export type AddMealTriggerIntent = "camera" | "manual" | "first" | "recent" | "floating";

export function AddMealTrigger({
  intent,
  className,
  onClick,
}: {
  intent: AddMealTriggerIntent;
  className?: string;
  onClick: () => void;
}) {
  const config = intentMap[intent];
  const Icon = config.icon;

  return (
    <Button className={className} onClick={onClick} type="button" variant={config.variant}>
      <Icon className="size-4" />
      {config.label}
    </Button>
  );
}

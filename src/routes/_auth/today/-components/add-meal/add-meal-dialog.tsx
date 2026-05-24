import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddMealDialog({
  open,
  title,
  description,
  children,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/30 p-6 backdrop-blur-sm md:flex">
      <div className="w-full max-w-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button onClick={() => onOpenChange(false)} size="icon-sm" type="button" variant="ghost">
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function AddMealDrawer({
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
    <div className="md:hidden">
      <Drawer onOpenChange={onOpenChange} open={open} repositionInputs={false}>
        <DrawerContent className="flex max-h-[calc(100dvh-0.75rem)] flex-col overflow-hidden">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

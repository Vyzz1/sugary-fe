import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "@/components/section-placeholder";

export const Route = createFileRoute("/_auth/meals")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SectionPlaceholder
      description="Track meal-related sugar activity, compare entries around breakfast, lunch, and dinner, and keep meal logs in one focused view."
      title="Meals"
    />
  );
}

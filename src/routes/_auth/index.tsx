import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "@/components/section-placeholder";

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SectionPlaceholder
      description="Review today's sugar checks, spot missing entries quickly, and keep the day moving without digging through separate screens."
      title="Today"
    />
  );
}

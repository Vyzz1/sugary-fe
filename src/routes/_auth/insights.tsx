import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "@/components/section-placeholder";

export const Route = createFileRoute("/_auth/insights")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SectionPlaceholder
      description="Surface trends, exceptions, and recurring signals so the app can support smarter follow-up decisions over time."
      title="Insights"
    />
  );
}

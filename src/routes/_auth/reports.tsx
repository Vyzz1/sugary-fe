import { createFileRoute } from "@tanstack/react-router";
import { SectionPlaceholder } from "@/components/section-placeholder";

export const Route = createFileRoute("/_auth/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SectionPlaceholder
      description="Summarize daily and weekly sugar patterns, review consistency, and prepare the reporting surface for export or review workflows."
      title="Reports"
    />
  );
}

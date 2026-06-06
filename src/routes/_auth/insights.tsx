import { createFileRoute } from "@tanstack/react-router";
import { InsightsPage } from "./insights/-components/insights-page";

export const Route = createFileRoute("/_auth/insights")({
  component: RouteComponent,
});

function RouteComponent() {
  return <InsightsPage />;
}

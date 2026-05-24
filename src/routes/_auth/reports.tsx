import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "./reports/-components/reports-page";

export const Route = createFileRoute("/_auth/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportsPage />;
}

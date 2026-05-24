import { createFileRoute } from "@tanstack/react-router";
import { TodayPage } from "@/routes/_auth/today/-components/today-page";

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TodayPage />;
}

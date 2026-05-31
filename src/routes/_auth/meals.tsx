import { createFileRoute } from "@tanstack/react-router";
import { MealsPage } from "./meals/-components/meals-page";

export const Route = createFileRoute("/_auth/meals")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MealsPage />;
}

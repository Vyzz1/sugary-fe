import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { getAccessToken } from "@/lib/auth-token";

export const Route = createFileRoute("/_auth")({
  ssr: false,
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthShell />;
}

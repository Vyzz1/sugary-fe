import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { getAccessToken } from "@/lib/auth-token";
import { useWebSocket } from "@/hooks/use-websocket";

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
  useWebSocket();

  return <AuthShell />;
}

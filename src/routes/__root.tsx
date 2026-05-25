import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  ssr: false,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Sugary",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: () => <RootDocument />,
});

function RootDocument() {
  return (
    <>
      <HeadContent />
      <Toaster position="top-center" />
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

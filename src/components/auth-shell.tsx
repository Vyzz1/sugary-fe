import {
  Activity,
  BarChart3,
  CalendarDays,
  ChartColumnBig,
  Soup,
} from "lucide-react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    label: "Today",
    to: "/",
    icon: Activity,
    description: "Live checks",
  },
  {
    label: "Meals",
    to: "/meals",
    icon: Soup,
    description: "Meal logs",
  },
  {
    label: "Reports",
    to: "/reports",
    icon: CalendarDays,
    description: "Daily summaries",
  },
  {
    label: "Insights",
    to: "/insights",
    icon: ChartColumnBig,
    description: "Trend review",
  },
] as const;

export function AuthShell() {
  const location = useLocation();
  const activeItem = navigationItems.find((item) => item.to === location.pathname) ?? navigationItems[0];

  return (
    <SidebarProvider
      className="min-h-svh bg-[linear-gradient(180deg,oklch(0.985_0.004_320),oklch(1_0_0))]"
      defaultOpen
    >
      <Sidebar
        className="border-r border-primary/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_6%,white),color-mix(in_oklab,var(--color-primary)_2%,white))]"
        collapsible="icon"
      >
        <SidebarContent className="pt-6">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-[0.2em] text-primary">
              Sugar Checker
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-[0_12px_28px_-18px_oklch(0.32_0.17_290/.85)]"
                        isActive={location.pathname === item.to}
                        tooltip={item.label}
                      >
                        <Link to={item.to}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="hidden md:flex group-data-[collapsible=icon]:hidden">
          <div className="rounded-xl border border-primary/15 bg-primary/8 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Monitoring
            </p>
            <p className="mt-1 text-sm text-sidebar-foreground/85">
              Keep meal entries, reports, and insights aligned in one workflow.
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

        <SidebarInset className="min-h-svh pb-20 md:pb-0">
          <header className="border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur md:px-8 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <SidebarTrigger className="mt-0.5 hidden md:inline-flex" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Sugar Checker
                  </p>
                  <h1 className="mt-1 font-heading text-2xl text-foreground md:text-3xl">
                    {activeItem.label}
                  </h1>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
                <BarChart3 className="size-4 text-foreground" />
              {activeItem.description}
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 py-2 backdrop-blur md:hidden">
          <ul className="grid grid-cols-4 gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <li key={item.to}>
                  <Link
                    activeProps={{
                      className:
                        "bg-primary text-primary-foreground shadow-[0_12px_28px_-18px_oklch(0.32_0.17_290/.8)]",
                    }}
                    className="flex min-h-15 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold text-muted-foreground transition-colors"
                    to={item.to}
                  >
                    <Icon className={isActive ? "size-4" : "size-4 opacity-70"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}

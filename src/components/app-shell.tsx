import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  LayoutGrid,
  MessageSquare,
  Settings,
  Sparkles,
  Sun,
  Timer,
  UserCog,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/app-state";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/daily", label: "Daily OS", icon: Sun },
  { to: "/protocol", label: "Protocol", icon: Compass },
  { to: "/mentor", label: "AI Mentor", icon: MessageSquare },
  { to: "/character", label: "Character", icon: UserCog },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/legacy", label: "Legacy", icon: Timer },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const mobileItems = navItems.filter((i) =>
  ["/dashboard", "/daily", "/mentor", "/protocol", "/settings"].includes(i.to),
);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { settings, tasks } = useAppState();
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Alter Ego OS</span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "size-4 transition-colors",
                    active ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {item.label}
                {item.to === "/daily" && remaining > 0 && (
                  <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                    {remaining}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="label-eyebrow">Alter ego</p>
          <p className="mt-1.5 font-display text-lg leading-tight">{settings.alterEgo}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {settings.displayName}
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-5 py-3.5 backdrop-blur-md lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-sm font-semibold">Alter Ego OS</span>
          </Link>
          <span className="text-xs text-muted-foreground">{settings.alterEgo}</span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pb-28 pt-6 sm:px-8 lg:pb-16 lg:pt-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        {mobileItems.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-accent" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rise-in mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="label-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-display text-3xl sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

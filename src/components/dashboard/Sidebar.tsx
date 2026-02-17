"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Workflow, 
  Key, 
  Settings, 
  ChevronRight,
  Shield,
  CreditCard,
  Users
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Workflows",
    icon: Workflow,
    href: "/dashboard/workflows",
  },
  {
    title: "Credentials",
    icon: Key,
    href: "/dashboard/credentials",
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "Subscription",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    title: "Security",
    icon: Shield,
    href: "/dashboard/security",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-all">
      <div className="flex flex-col h-full py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                  <span>{item.title}</span>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 transform transition-transform opacity-0 group-hover:opacity-100",
                  isActive ? "opacity-100 translate-x-0" : "-translate-x-2"
                )} />
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="rounded-xl border border-border bg-accent/30 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Pro Plan
            </h4>
            <p className="text-sm text-balance mb-4">
              Unlock all features and priority support.
            </p>
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

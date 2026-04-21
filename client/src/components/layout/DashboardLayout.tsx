import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Trophy,
  Heart,
  Target,
  CreditCard,
  Award,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/scores", icon: Target, label: "My Scores" },
  { to: "/dashboard/draws", icon: Trophy, label: "Draws" },
  { to: "/dashboard/winnings", icon: Award, label: "Winnings" },
  { to: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
  { to: "/dashboard/charity", icon: Heart, label: "My Charity" },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex-1 flex gap-8 py-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-60 shrink-0">
          <nav className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
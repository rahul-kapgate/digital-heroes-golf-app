import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";
import { Shield, Users, Trophy, Heart, Award, BarChart3 } from "lucide-react";

const adminNav = [
  { to: "/admin", icon: BarChart3, label: "Overview", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/draws", icon: Trophy, label: "Draws" },
  { to: "/admin/winners", icon: Award, label: "Winners" },
  { to: "/admin/charities", icon: Heart, label: "Charities" },
];

export function AdminLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex-1 flex gap-8 py-8">
        <aside className="hidden md:block w-60 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 mb-4 px-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Admin Panel</span>
            </div>
            <nav className="space-y-1">
              {adminNav.map((item) => {
                const isActive = item.end
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
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
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
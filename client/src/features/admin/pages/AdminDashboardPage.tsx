import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, Trophy, Heart, Coins } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const stats = [
    { icon: Users, label: "Total Users", value: data?.total_users, color: "bg-blue-500" },
    { icon: CreditCard, label: "Active Subscriptions", value: data?.active_subscriptions, color: "bg-primary" },
    { icon: Trophy, label: "Total Draws", value: data?.total_draws, color: "bg-amber-500" },
    { icon: Coins, label: "Prizes Awarded", value: formatCurrency(data?.total_prizes_awarded || 0), color: "bg-purple-500" },
    { icon: Heart, label: "Charity Contributions", value: formatCurrency(data?.total_charity_contributions || 0), color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview at a glance</p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`h-10 w-10 rounded-lg ${s.color} flex items-center justify-center mb-4`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value ?? "0"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
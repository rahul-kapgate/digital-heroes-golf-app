import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { dashboardApi } from "../api/dashboard.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Target, Heart, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export function DashboardHome() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28" />
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const hasActiveSubscription = data?.subscription?.status === "active";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.full_name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your summary for this month</p>
      </div>

      {/* Subscription banner */}
      {!hasActiveSubscription && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold">Subscribe to start participating</p>
              <p className="text-sm text-muted-foreground">You need an active subscription to enter draws.</p>
            </div>
            <Button asChild>
              <Link to="/pricing">Choose a plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stat cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Scores on file"
          value={`${data?.scores.length || 0}/5`}
          link="/dashboard/scores"
        />
        <StatCard
          icon={Trophy}
          label="Draws entered"
          value={String(data?.stats.draws_entered || 0)}
          link="/dashboard/draws"
        />
        <StatCard
          icon={TrendingUp}
          label="Total won"
          value={formatCurrency(data?.stats.total_won || 0)}
          link="/dashboard/winnings"
        />
        <StatCard
          icon={Heart}
          label="Supporting"
          value={data?.charity?.name || "—"}
          link="/dashboard/charity"
          isText
        />
      </div>

      {/* Recent scores */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Scores</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/scores">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data?.scores.length ? (
              <div className="space-y-3">
                {data.scores.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {s.score}
                      </div>
                      <span className="text-sm">{formatDate(s.play_date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No scores yet. Add your first one!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subscription</CardTitle>
            {hasActiveSubscription && <Badge variant="default">Active</Badge>}
          </CardHeader>
          <CardContent>
            {data?.subscription ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-medium capitalize">{data.subscription.plan_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next billing</span>
                  <span className="text-sm font-medium">{formatDate(data.subscription.current_period_end)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-medium">{formatCurrency(data.subscription.amount)}</span>
                </div>
              </div>
            ) : (
              <Button asChild><Link to="/pricing">Subscribe now</Link></Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, link, isText }: any) {
  return (
    <Link to={link}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`font-bold mt-1 ${isText ? "text-base truncate" : "text-2xl"}`}>{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
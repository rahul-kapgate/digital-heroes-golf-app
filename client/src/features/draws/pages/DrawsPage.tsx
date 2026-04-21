import { useQuery } from "@tanstack/react-query";
import { drawsApi } from "../api/draws.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Trophy, Zap } from "lucide-react";
import { formatCurrency, formatMonth } from "@/lib/utils";
import { motion } from "framer-motion";

export function DrawsPage() {
  const { data: draw, isLoading } = useQuery({
    queryKey: ["draw", "latest"],
    queryFn: drawsApi.getLatest,
  });

  if (isLoading) return <Skeleton className="h-96" />;

  if (!draw) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Draws</h1>
        <EmptyState
          icon={Trophy}
          title="No draws yet"
          description="The first monthly draw will be announced here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Latest Draw</h1>
        <p className="text-muted-foreground mt-1">{formatMonth(draw.draw_month)}</p>
      </div>

      {/* Winning numbers display */}
      <Card className="bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 text-white border-0 overflow-hidden">
        <CardContent className="p-8 md:p-12 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15),transparent)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-4">
              <Zap className="h-3 w-3" /> Winning Numbers
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {draw.draw_numbers.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl md:text-4xl font-bold shadow-xl"
                >
                  {n}
                </motion.div>
              ))}
            </div>
            <p className="mt-6 text-white/80 text-sm uppercase tracking-wider">
              {draw.draw_type} draw
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prize pools */}
      <div className="grid md:grid-cols-3 gap-4">
        <PoolCard
          label="5-Match Jackpot"
          amount={draw.pool_5_match}
          subtitle={draw.rollover_amount > 0 ? `Incl. ${formatCurrency(draw.rollover_amount)} rollover` : undefined}
          gradient="from-amber-500 to-orange-500"
        />
        <PoolCard
          label="4-Match Pool"
          amount={draw.pool_4_match}
          gradient="from-primary to-emerald-600"
        />
        <PoolCard
          label="3-Match Pool"
          amount={draw.pool_3_match}
          gradient="from-blue-500 to-indigo-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Pool for this Draw</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{formatCurrency(draw.total_pool)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Distributed automatically · 40% / 35% / 25%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PoolCard({ label, amount, subtitle, gradient }: any) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white border-0`}>
      <CardContent className="p-6 text-center">
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-3xl font-bold mt-2">{formatCurrency(amount)}</p>
        {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}